import axios from 'axios';
import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import './admin.css';

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [inventoryData, setInventoryData] = useState({
    condition: '',
    year: '',
    make: '',
    model: '',
    horsepower: '',
    engineHours: '',
    fuelType: '',
    liftCapacity: '',
    weight: '',
    drive: '',
    images: []
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', loginData);
      if (response.data.success) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append all inventory data
    Object.keys(inventoryData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, inventoryData[key]);
      }
    });

    // Append images
    inventoryData.images.forEach(image => {
      formData.append('images', image);
    });

    try {
      await axios.post('/api/inventory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Reset form or show success message
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <Container className="admin-container">
      {!isLoggedIn ? (
        <Form onSubmit={handleLogin} className="login-form">
          <h2>Admin Login</h2>
          {/* Login form fields */}
        </Form>
      ) : (
        <Form onSubmit={handleInventorySubmit} className="inventory-form">
          <h2>Add New Machine</h2>
          {/* Inventory form fields */}
        </Form>
      )}
    </Container>
  );
};

export default AdminPage;
