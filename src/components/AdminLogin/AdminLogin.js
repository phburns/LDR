import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get the base URL depending on environment
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? '' // Empty string for relative URLs in production
    : 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // For demonstration, just set test password directly
    // In production, use a proper authentication system
    if (password === 'admin') {
      localStorage.setItem('adminAuthenticated', 'true');
      window.location.href = '/admin'; // Force full page reload
      return;
    }
    
    try {
      const response = await axios.post(`${baseUrl}/api/auth/login`, {
        password
      });
      
      if (response.data.success) {
        localStorage.setItem('adminAuthenticated', 'true');
        window.location.href = '/admin'; // Force full page reload
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleSubmit} className="admin-login-form">
        <h2>Admin Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-group">
          <label htmlFor="password">Enter Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;