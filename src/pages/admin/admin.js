import axios from 'axios';
import React, { useState } from 'react';
import './admin.css';

const AdminPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    });

    try {
      const base64Images = await Promise.all(imagePromises);
      setInventoryData(prev => ({
        ...prev,
        images: [...prev.images, ...base64Images]
      }));
    } catch (error) {
      setError('Error processing images');
    }
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/inventory', inventoryData);
      setSuccess('Machine added successfully!');
      setInventoryData({
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
    } catch (error) {
      setError('Failed to add machine');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInventoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="admin-container">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleInventorySubmit} className="inventory-form">
        <h2>Add New Machine</h2>
        
        <div className="form-group">
          <label htmlFor="condition">Condition *</label>
          <select
            id="condition"
            name="condition"
            className="form-control"
            value={inventoryData.condition}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Condition</option>
            <option value="new">New</option>
            <option value="pre-owned">Pre-Owned</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="year">Year *</label>
          <input
            type="number"
            id="year"
            name="year"
            className="form-control"
            value={inventoryData.year}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="make">Make *</label>
          <input
            type="text"
            id="make"
            name="make"
            className="form-control"
            value={inventoryData.make}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="model">Model *</label>
          <input
            type="text"
            id="model"
            name="model"
            className="form-control"
            value={inventoryData.model}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="horsepower">Horsepower</label>
          <input
            type="number"
            id="horsepower"
            name="horsepower"
            className="form-control"
            value={inventoryData.horsepower}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="engineHours">Engine Hours</label>
          <input
            type="number"
            id="engineHours"
            name="engineHours"
            className="form-control"
            value={inventoryData.engineHours}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fuelType">Fuel Type</label>
          <input
            type="text"
            id="fuelType"
            name="fuelType"
            className="form-control"
            value={inventoryData.fuelType}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="liftCapacity">Lift Capacity</label>
          <input
            type="text"
            id="liftCapacity"
            name="liftCapacity"
            className="form-control"
            value={inventoryData.liftCapacity}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight</label>
          <input
            type="text"
            id="weight"
            name="weight"
            className="form-control"
            value={inventoryData.weight}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="drive">Drive</label>
          <input
            type="text"
            id="drive"
            name="drive"
            className="form-control"
            value={inventoryData.drive}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">Images</label>
          <input
            type="file"
            id="images"
            name="images"
            className="form-control"
            onChange={handleImageUpload}
            multiple
            accept="image/*"
          />
        </div>

        {inventoryData.images.length > 0 && (
          <div className="image-previews">
            {inventoryData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index + 1}`}
                className="image-preview"
              />
            ))}
          </div>
        )}

        <button type="submit" className="btn btn-success">Add Machine</button>
      </form>
    </div>
  );
};

export default AdminPage;
