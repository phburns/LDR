import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import "./inventory.css";
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const capitalizeString = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
    .join(" ");
};

const Inventory = () => {
  const { brand } = useParams();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: "768px" });

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/inventory");
        if (!response.data) {
          throw new Error("No data received from server");
        }

        let inventoryData = Array.isArray(response.data)
          ? response.data.filter((item) => item && item.id && !item.hidden)
          : [];

        // Filter by brand if specified
        if (brand) {
          if (brand.toLowerCase() === "new") {
            inventoryData = inventoryData.filter(
              (item) => item.condition?.toLowerCase() === "new"
            );
          } else if (brand.toLowerCase() === "pre-owned") {
            inventoryData = inventoryData.filter(
              (item) =>
                item.condition?.toLowerCase() === "used" ||
                item.condition?.toLowerCase() === "pre-owned"
            );
          } else {
            inventoryData = inventoryData.filter((item) => {
              const itemBrand = item.brand?.toLowerCase() || "";
              const searchBrand = brand.toLowerCase();
              return (
                itemBrand === searchBrand ||
                (searchBrand === "claas" && itemBrand.includes("claas")) ||
                (itemBrand === "claas" && searchBrand.includes("claas"))
              );
            });
          }
        }

        setInventory(inventoryData);
      } catch (error) {
        setError("Failed to load inventory items");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [brand]);

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index);
  };

  const handleNextImage = () => {
    if (selectedItem?.images) {
      setActiveImageIndex((prev) =>
        prev === selectedItem.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedItem?.images) {
      setActiveImageIndex((prev) =>
        prev === 0 ? selectedItem.images.length - 1 : prev - 1
      );
    }
  };

  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart(touch.clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    const touch = e.touches[0];
    const diff = touchStart - touch.clientX;

    if (diff > 50) {
      handleNextImage();
    } else if (diff < -50) {
      handlePrevImage();
    }
    setTouchStart(null);
  };

  return (
    <div className="inventory-container">
      <h1>Our Inventory</h1>

      {loading ? (
        <div className="text-center">Loading inventory...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : inventory && inventory.length > 0 ? (
        <>
          <div className="inventory-grid">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="inventory-card"
                onClick={() => handleCardClick(item)}
              >
                <div className="inventory-image-container">
                  <img
                    src={item.images?.[0] || "/images/placeholder.jpg"}
                    alt={`${item.make || ""} ${item.model || ""}`}
                    className="inventory-image"
                    onError={(e) => {
                      e.target.src = "/images/placeholder.jpg";
                    }}
                  />
                </div>
                <div className="inventory-details">
                  <h3>{(item.make || "Unknown") + " " + (item.model || "")}</h3>
                  <p className="brand">
                    {capitalizeString(item.brand) || "Unknown Brand"}
                  </p>
                  <p className="year">{item.year || "Year N/A"}</p>
                  <p className="condition">
                    {item.condition || "Condition N/A"}
                  </p>
                  <p className="description">
                    {item.description || "No description available"}
                  </p>
                  <p className="price">${(item.price || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {selectedItem && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={handleCloseModal}>
                  &times;
                </button>
                <div className="modal-grid">
                <div className="modal-images">
  <div className="carousel-container">
    <div 
      className="carousel-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <button className="carousel-button prev" onClick={handlePrevImage}>
        <IoChevronBack size={24}/>
      </button>
      <img 
        src={selectedItem.images?.[activeImageIndex] || '/images/placeholder.jpg'} 
        alt={`${selectedItem.make || ''} ${selectedItem.model || ''}`}
        className="modal-main-image"
      />
      <button className="carousel-button next" onClick={handleNextImage}>
        <IoChevronForward size={24}/>
      </button>
      {isMobile && (
        <div className="carousel-indicators">
          {selectedItem.images?.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === activeImageIndex ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
        </div>
      )}
    </div>
  </div>
  {!isMobile && (
    <div className="other-pictures">
      {selectedItem.images?.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Additional view ${index + 1}`}
          className={`modal-thumbnail ${index === activeImageIndex ? 'active' : ''}`}
          onClick={() => handleThumbnailClick(index)}
        />
      ))}
    </div>
  )}
</div>
                  <div className="modal-details">
                    <div className="modal-header">
                      <h2>{`${selectedItem.make} ${selectedItem.model}`}</h2>
                      <br />
                      <p className="modal-price fw-bold">
                        ${selectedItem.price?.toLocaleString()}
                      </p>
                    </div>
                    <div className="modal-info">
                      {(selectedItem.brand ||
                        selectedItem.year ||
                        selectedItem.condition) && (
                        <div className="info-section">
                          <h3>Information</h3>
                          {selectedItem.brand && (
                            <p>
                              <strong>Brand:</strong>{" "}
                              {capitalizeString(selectedItem.brand)}
                            </p>
                          )}
                          {selectedItem.year && (
                            <p>
                              <strong>Year:</strong> {selectedItem.year}
                            </p>
                          )}
                          {selectedItem.condition && (
                            <p>
                              <strong>Condition:</strong>{" "}
                              {selectedItem.condition}
                            </p>
                          )}
                        </div>
                      )}
                      {(selectedItem.horsepower ||
                        selectedItem.engineHours ||
                        selectedItem.fuelType ||
                        selectedItem.drive ||
                        selectedItem.weight ||
                        selectedItem.separator) && (
                        <div className="info-section">
                          <h3>Specifications</h3>
                          {selectedItem.horsepower && (
                            <p>
                              <strong>Horsepower:</strong>{" "}
                              {selectedItem.horsepower}
                            </p>
                          )}
                          {selectedItem.engineHours && (
                            <p>
                              <strong>Engine Hours:</strong>{" "}
                              {selectedItem.engineHours}
                            </p>
                          )}
                          {selectedItem.fuelType && (
                            <p>
                              <strong>Fuel Type:</strong>{" "}
                              {selectedItem.fuelType}
                            </p>
                          )}
                          {selectedItem.drive && (
                            <p>
                              <strong>Drive:</strong> {selectedItem.drive}
                            </p>
                          )}
                          {selectedItem.weight && (
                            <p>
                              <strong>Weight:</strong> {selectedItem.weight}
                            </p>
                          )}
                          {selectedItem.separator && (
                            <p>
                              <strong>Separator:</strong>{" "}
                              {selectedItem.separator}
                            </p>
                          )}
                        </div>
                      )}
                      {selectedItem.description && (
                        <div className="description-section">
                          <h3>Description</h3>
                          <p>{selectedItem.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center">No inventory items available</div>
      )}
    </div>
  );
};

export default Inventory;
