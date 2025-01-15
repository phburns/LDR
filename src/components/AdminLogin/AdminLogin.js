import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting login with password:', password);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        password
      });
      console.log('Server response:', response.data);
      
      if (response.data.success) {
        console.log('Login successful, attempting navigation...');
        localStorage.setItem('adminAuthenticated', 'true');
        setTimeout(() => {
          navigate('/admin');
          window.location.reload();
          console.log('Navigation completed');
        }, 100);
      } else {
        setError('Invalid password');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid password');
      setTimeout(() => navigate('/'), 2000);
    }
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleSubmit} className="admin-login-form">
        <h2>Admin Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-group">
          <label htmlFor="password">Password</label>
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