import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('adminAuthenticated') === 'true') {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
        localStorage.setItem('adminAuthenticated', 'true');
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;