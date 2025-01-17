import { Icon } from "@iconify/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import { deleteFromS3, uploadToS3 } from "../../utils/s3";
import "./admin.css";

const AdminPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [inventoryData, setInventoryData] = useState({
    condition: "",
    year: "",
    make: "",
    model: "",
    brand: "",
    description: "",
    price: "",
    horsepower: "",
    engineHours: "",
    fuelType: "",
    liftCapacity: "",
    weight: "",
    drive: "",
    deckSize: "",
    separator: "",
    images: [],
  });
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingImages, setEditingImages] = useState(null);
  const [tempEditingImages, setTempEditingImages] = useState(null);
  const [showAdditionalFieldsModal, setShowAdditionalFieldsModal] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/inventory");

        if (!response.data) {
          throw new Error("No data received from server");
        }

        // Filter out any null or invalid items, using id instead of _id
        const inventoryData = Array.isArray(response.data)
          ? response.data.filter((item) => item && item.id)
          : [];

        setInventory(inventoryData);
      } catch (error) {
        setError(
          "Failed to load inventory items: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    try {
      const uploadPromises = files.map(file => uploadToS3(file));
      const imageUrls = await Promise.all(uploadPromises);
      
      setInventoryData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));
    } catch (error) {
      setError("Error uploading images: " + error.message);
    }
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Send the data directly as JSON, no need for FormData
      const response = await axios.post(
        "/api/inventory",
        inventoryData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        setSuccess("Inventory added successfully!");
        setShowSuccessModal(true);
        setInventoryData({
          condition: "",
          year: "",
          make: "",
          model: "",
          brand: "",
          description: "",
          price: "",
          horsepower: "",
          engineHours: "",
          fuelType: "",
          liftCapacity: "",
          weight: "",
          drive: "",
          deckSize: "",
          separator: "",
          images: [],
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add inventory. Please try again."
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInventoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        // Find the item to get its images
        const itemToDelete = inventory.find(item => item.id === id);
        if (!itemToDelete) {
          throw new Error("Item not found");
        }

        // Delete all associated images from S3
        if (itemToDelete.images && itemToDelete.images.length > 0) {
          const deletePromises = itemToDelete.images.map(imageUrl => deleteFromS3(imageUrl));
          await Promise.all(deletePromises);
        }

        // Delete the item from the database
        await axios.delete(`/api/inventory/${id}`);
        
        // Update local state
        setInventory((prevInventory) =>
          prevInventory.filter((item) => item.id !== id)
        );
        setSuccess("Item and associated images deleted successfully");
      } catch (error) {
        setError("Failed to delete item: " + error.message);
        console.error("Delete error:", error);
      }
    }
  };

  const handleEditClick = (item) => {
    if (!item || !item.id) {
      setError("Cannot edit this item: Invalid data");
      return;
    }
    setEditingItem(item);
    setEditFormData({ ...item });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!editingItem || !editingItem.id) {
        throw new Error("No item selected for editing");
      }

      if (!editFormData || !editFormData.make || !editFormData.model) {
        throw new Error("Required fields are missing");
      }

      const response = await axios.put(
        `/api/inventory/${editingItem.id}`,
        editFormData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setInventory((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? response.data : item
          )
        );
        setEditingItem(null);
        setEditFormData(null);
        setSuccess("Item updated successfully");
        setShowSuccessModal(true);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update inventory. Please try again."
      );
    }
  };

  const handleEditCancel = () => {
    setEditingItem(null);
    setEditFormData(null);
  };

  const handleToggleVisibility = async (id, currentHidden) => {
    try {
      const itemToUpdate = inventory.find(item => item.id === id);
      if (!itemToUpdate) {
        throw new Error("Item not found");
      }

      const response = await axios.put(
        `/api/inventory/${id}`,
        {
          ...itemToUpdate,
          hidden: !currentHidden
        }
      );

      if (response.data) {
        setInventory((prevInventory) =>
          prevInventory.map((item) =>
            item.id === id ? { ...item, hidden: !currentHidden } : item
          )
        );
        setSuccess("Item visibility updated successfully");
        setShowSuccessModal(true);
      }
    } catch (error) {
      setError("Failed to update item visibility");
      console.error("Visibility update error:", error);
    }
  };

  const handleAdditionalImageUpload = async (e, itemId) => {
    e.stopPropagation();
    const files = Array.from(e.target.files);
    try {
      const uploadPromises = files.map(file => uploadToS3(file));
      const newImageUrls = await Promise.all(uploadPromises);
      
      const itemToUpdate = inventory.find(item => item.id === itemId);
      const updatedImages = [...(itemToUpdate.images || []), ...newImageUrls];
      
      const response = await axios.put(
        `/api/inventory/${itemId}`,
        {
          ...itemToUpdate,
          images: updatedImages
        }
      );

      if (response.data) {
        setInventory(prevInventory =>
          prevInventory.map(item =>
            item.id === itemId ? { ...item, images: updatedImages } : item
          )
        );
        setSuccess("Images added successfully");
      }
    } catch (error) {
      setError("Failed to upload images");
      console.error("Image upload error:", error);
    }
  };

  const handleImageManagement = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingItem(item);
    setEditingImages(item.images || []);
    setTempEditingImages(item.images || []);
    setShowImageModal(true);
  };

  const handleDeleteImage = async (e, index) => {
    e.stopPropagation();
    try {
      const imageUrl = tempEditingImages[index];
      await deleteFromS3(imageUrl);
      
      const updatedImages = [...tempEditingImages];
      updatedImages.splice(index, 1);
      setTempEditingImages(updatedImages);

      const response = await axios.put(
        `/api/inventory/${editingItem.id}`,
        {
          ...editingItem,
          images: updatedImages
        }
      );

      if (response.data) {
        setEditingImages(updatedImages);
        setInventory(prevInventory =>
          prevInventory.map(item =>
            item.id === editingItem.id ? { ...item, images: updatedImages } : item
          )
        );
        setEditingItem(prev => ({...prev, images: updatedImages}));
        setEditFormData(prev => ({...prev, images: updatedImages}));
        setSuccess("Image deleted successfully");
        setShowSuccessModal(true);
      }
    } catch (error) {
      setError("Failed to delete image");
      console.error("Image deletion error:", error);
    }
  };

  const handleSaveImages = async () => {
    try {
      const response = await axios.put(
        `/api/inventory/${editingItem.id}`,
        {
          ...editingItem,
          images: tempEditingImages
        }
      );

      if (response.data) {
        setEditingImages(tempEditingImages);
        setInventory(prevInventory =>
          prevInventory.map(item =>
            item.id === editingItem.id ? { ...item, images: tempEditingImages } : item
          )
        );
        setEditingItem(prev => ({...prev, images: tempEditingImages}));
        setEditFormData(prev => ({...prev, images: tempEditingImages}));
        setSuccess("Images updated successfully");
        setShowSuccessModal(true);
        setShowImageModal(false);
      }
    } catch (error) {
      setError("Failed to update images");
      console.error("Image update error:", error);
    }
  };

  const handleAddMoreImages = async (e) => {
    const files = Array.from(e.target.files);
    try {
      const uploadPromises = files.map(file => uploadToS3(file));
      const newImageUrls = await Promise.all(uploadPromises);
      
      const updatedImages = [...editingImages, ...newImageUrls];
      
      const response = await axios.put(
        `/api/inventory/${editingItem.id}`,
        {
          ...editingItem,
          images: updatedImages
        }
      );

      if (response.data) {
        setEditingImages(updatedImages);
        setTempEditingImages(updatedImages);
        setInventory(prevInventory =>
          prevInventory.map(item =>
            item.id === editingItem.id ? { ...item, images: updatedImages } : item
          )
        );
        setEditingItem(prev => ({...prev, images: updatedImages}));
        setEditFormData(prev => ({...prev, images: updatedImages}));
        setSuccess("Images added successfully");
        setShowSuccessModal(true);
        setShowImageModal(false);
      }
    } catch (error) {
      setError("Failed to add images");
      console.error("Image upload error:", error);
    }
  };

  return (
    <div className="admin-container">
      {error && <div className="alert alert-danger">{error}</div>}
      {showSuccessModal && (
        <SuccessModal
          message={success}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

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
            placeholder="Enter Machine Year"
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
            placeholder="Enter Machine Make"
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
            placeholder="Enter Machine Model"
            value={inventoryData.model}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="brand">Brand *</label>
          <input
            type="text"
            id="brand"
            name="brand"
            className="form-control"
            value={inventoryData.brand}
            onChange={handleInputChange}
            required
            placeholder="Enter Machine Brand Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={inventoryData.description}
            onChange={handleInputChange}
            rows="4"
            required
            placeholder="Enter detailed description of the machine..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price *</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              id="price"
              name="price"
              className="form-control"
              value={inventoryData.price}
              onChange={handleInputChange}
              required
              placeholder="Enter price"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="horsepower">Horsepower</label>
          <input
            type="number"
            id="horsepower"
            name="horsepower"
            className="form-control"
            placeholder="Enter Machine Horsepower"
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
            placeholder="Enter Machine Engine Hours"
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
            placeholder="Enter Machine Fuel Type"
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
            placeholder="Enter Machine Lift Capacity"
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
            placeholder="Enter Machine Weight"
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
            placeholder="Enter Machine Drive Type"
            value={inventoryData.drive}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="deckSize">Deck Size</label>
          <div className="input-group">
            <input
              type="text"
              id="deckSize"
              name="deckSize"
              className="form-control"
              value={inventoryData.deckSize}
              onChange={handleInputChange}
              placeholder="Enter Mower Deck Size (e.g., 52 inch)"
            />
            <span className="input-group-text">Inches</span>
          </div>
          <small className="text-muted">
            Enter deck size for mowers (if applicable)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="separator">Separator</label>
          <input
            type="text"
            id="separator"
            name="separator"
            className="form-control"
            value={inventoryData.separator}
            onChange={handleInputChange}
            placeholder="Enter separator type"
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">Images</label>
          <div className="image-upload-container">
            <input
              type="file"
              id="imageInput"
              name="images"
              className="form-control"
              onChange={handleImageUpload}
              multiple
              accept="image/*"
            />
            <small className="text-muted">Upload one or more photos</small>
          </div>
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

        <button type="submit" className="add-button">
          Add Inventory
        </button>
      </form>

      <div className="current-inventory">
        <h2>Current Inventory</h2>
        {loading ? (
          <div className="text-center">Loading inventory...</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : inventory && inventory.length > 0 ? (
          <div className="inventory-grid">
            {inventory
              .filter((item) => item && item.id)
              .map((item) => (
                <div
                  key={item.id}
                  className={`inventory-card ${
                    editingItem?.id === item.id ? "editing" : ""
                  }`}
                  onClick={() => !editingItem && handleEditClick(item)}
                >
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    aria-label="Delete item"
                  >
                    <Icon
                      icon="mdi:trash-can-outline"
                      width="1.2rem"
                      height="1.2rem"
                    />
                  </button>

                  <button
                    className="visibility-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVisibility(item.id, item.hidden);
                    }}
                    aria-label={item.hidden ? "Show item" : "Hide item"}
                  >
                    <Icon
                      icon={item.hidden ? "mdi:eye-off" : "mdi:eye"}
                      width="1.2rem"
                      height="1.2rem"
                    />
                  </button>

                  {editingItem?.id === item.id ? (
                    <form
                      onSubmit={handleEditSubmit}
                      className="edit-form"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="form-group">
                        <label>Make</label>
                        <input
                          type="text"
                          name="make"
                          value={editFormData.make}
                          onChange={handleEditInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Model</label>
                        <input
                          type="text"
                          name="model"
                          value={editFormData.model}
                          onChange={handleEditInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Brand</label>
                        <input
                          type="text"
                          name="brand"
                          value={editFormData.brand}
                          onChange={handleEditInputChange}
                          className="form-control"
                          placeholder="Enter brand name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Year</label>
                        <input
                          type="number"
                          name="year"
                          value={editFormData.year}
                          onChange={handleEditInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditInputChange}
                          className="form-control"
                          rows="3"
                        />
                      </div>
                      <div className="form-group">
                        <label>Price</label>
                        <input
                          type="number"
                          name="price"
                          value={editFormData.price}
                          onChange={handleEditInputChange}
                          className="form-control"
                        />
                      </div>
                      {editFormData.separator && (
                        <div className="form-group">
                          <label>Separator</label>
                          <input
                            type="text"
                            name="separator"
                            value={editFormData.separator}
                            onChange={handleEditInputChange}
                            className="form-control"
                            placeholder="Enter separator type"
                          />
                        </div>
                      )}
                      <div className="button-group mb-3">
                        <button
                          type="button"
                          className="btn manage-button"
                          onClick={(e) => handleImageManagement(e, editingItem)}
                        >
                          Manage Images
                        </button>
                        <button
                          type="button"
                          className="btn manage-button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowAdditionalFieldsModal(true);
                          }}
                        >
                          Additional Fields
                        </button>
                      </div>
                      <div className="edit-form-buttons">
                        <button type="submit" className="btn save-button">
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleEditCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="inventory-image-container">
                        <img
                          src={item.images?.[0] || "/images/placeholder.jpg"}
                          alt={`${item.make || ""} ${item.model || ""}`}
                          className="inventory-image"
                          onError={(e) => {
                            e.target.src = "/images/placeholder.jpg";
                          }}
                        />
                        <div className="image-actions">
                          <label className="add-image-button" onClick={(e) => e.stopPropagation()}>
                            <Icon icon="mdi:image-plus" width="1.2rem" height="1.2rem" />
                            <input
                              type="file"
                              onChange={(e) => handleAdditionalImageUpload(e, item.id)}
                              multiple
                              accept="image/*"
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="inventory-details">
                        <h3>
                          {(item.make || "Unknown") + " " + (item.model || "")}
                        </h3>
                        <p className="brand">{item.brand || "Unknown Brand"}</p>
                        <p className="year">{item.year || "Year N/A"}</p>
                        <p className="description">
                          {item.description || "No description available"}
                        </p>
                        <p className="price">
                          ${(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center">No inventory items found</div>
        )}
      </div>

      {showImageModal && (
        <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-management-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Manage Images</h3>
            </div>
            
            <div className="image-upload-section">
              <label className="btn manage-button  mb-3">
                Add Images
                <input
                  type="file"
                  onChange={handleAddMoreImages}
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="image-grid">
              {tempEditingImages?.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image} alt={`Item ${index + 1}`} />
                  <button
                    type="button"
                    className="delete-image-button"
                    onClick={(e) => handleDeleteImage(e, index)}
                  >
                    <Icon icon="mdi:trash-can-outline" width="1.2rem" height="1.2rem" />
                  </button>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowImageModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn save-button"
                onClick={handleSaveImages}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showAdditionalFieldsModal && (
        <div className="modal-overlay" onClick={() => setShowAdditionalFieldsModal(false)}>
          <div className="additional-fields-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Additional Fields</h3>
            </div>
            
            <form className="additional-fields-form">
              <div className="form-group">
                <label>Horsepower</label>
                <input
                  type="number"
                  name="horsepower"
                  value={editFormData.horsepower}
                  onChange={handleEditInputChange}
                  className="form-control"
                  placeholder="Enter horsepower"
                />
              </div>
              <div className="form-group">
                <label>Engine Hours</label>
                <input
                  type="number"
                  name="engineHours"
                  value={editFormData.engineHours}
                  onChange={handleEditInputChange}
                  className="form-control"
                  placeholder="Enter engine hours"
                />
              </div>
              <div className="form-group">
                <label>Fuel Type</label>
                <input
                  type="text"
                  name="fuelType"
                  value={editFormData.fuelType}
                  onChange={handleEditInputChange}
                  className="form-control"
                  placeholder="Enter fuel type"
                />
              </div>
              <div className="form-group">
                <label>Lift Capacity</label>
                <input
                  type="text"
                  name="liftCapacity"
                  value={editFormData.liftCapacity}
                  onChange={handleEditInputChange}
                  className="form-control"
                  placeholder="Enter lift capacity"
                />
              </div>
              <div className="form-group">
                <label>Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={editFormData.weight}
                  onChange={handleEditInputChange}
                  className="form-control"
                  placeholder="Enter weight"
                />
              </div>
              <div className="form-group">
                <label>Drive</label>
                <input
                  type="text"
                  name="drive"
                  value={editFormData.drive}
                  onChange={handleEditInputChange}
                  className="form-control"
                  placeholder="Enter drive type"
                />
              </div>
              <div className="form-group">
                <label>Deck Size</label>
                <div className="input-group">
                  <input
                    type="text"
                    name="deckSize"
                    value={editFormData.deckSize}
                    onChange={handleEditInputChange}
                    className="form-control"
                    placeholder="Enter deck size"
                  />
                  <span className="input-group-text">Inches</span>
                </div>
              </div>
              <div className="form-group">
                <label>Separator</label>
                <input
                  type="text"
                  name="separator"
                  value={editFormData.separator}
                  onChange={handleEditInputChange}
                  className="form-control"
                  placeholder="Enter separator type"
                />
              </div>
            </form>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAdditionalFieldsModal(false)}
              >
                Close
              </button>
              <button 
                className="btn save-button"
                onClick={() => {
                  setShowAdditionalFieldsModal(false);
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
