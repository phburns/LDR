import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { useMediaQuery } from "react-responsive";
import { useNavigate, useParams } from "react-router-dom";
import "./inventory.css";

const capitalizeString = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
    .join(" ");
};

const Inventory = () => {
  const { brand } = useParams();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [brands, setBrands] = useState([]);
  const [types] = useState(["Tractor", "Harvester", "Mower", "Attachment"]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: "768px" });
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        console.log("Making request to inventory endpoint");
        const response = await axios.get("/api/inventory");
        console.log("Response received:", response);

        if (!response.data) {
          throw new Error("No data received from server");
        }

        let inventoryData = Array.isArray(response.data)
          ? response.data.filter((item) => item && item.id && !item.hidden)
          : [];


        // Extract unique brands
        const uniqueBrands = [...new Set(inventoryData.map(item => item.brand))].filter(Boolean);
        setBrands(uniqueBrands);

        // Filter by brand if specified in URL
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
        setFilteredInventory(inventoryData);
      } catch (error) {
        console.error("Detailed fetch error:", error);
        const errorMessage = error.response?.data?.details || error.response?.data?.message || error.message;
        setError("Failed to load inventory items: " + errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [brand]);

  useEffect(() => {
    let filtered = [...inventory];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.make?.toLowerCase().includes(search) ||
        item.model?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search)
      );
    }

    // Apply brand filter
    if (selectedBrand) {
      filtered = filtered.filter(item => item.brand === selectedBrand);
    }

    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    setFilteredInventory(filtered);
  }, [searchTerm, selectedBrand, selectedType, inventory]);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setActiveImageIndex(0);
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

  const handleImageEnlarge = (e, image) => {
    e.stopPropagation();
    setEnlargedImage(image);
  };

  const handleCloseEnlarged = () => {
    setEnlargedImage(null);
  };

  const handleModalTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleModalTouchMove = (e) => {
    if (!touchStartX) return;
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNextImage();
    } else if (diff < -50) {
      handlePrevImage();
    }
    setTouchStartX(null);
  };

const [touchStart, setTouchStart] = useState(null);
const [touchEnd, setTouchEnd] = useState(null);

// Add these handler functions
const handleTouchStart = (e) => {
  setTouchStart(e.touches[0].clientX);
};

const handleTouchMove = (e) => {
  setTouchEnd(e.touches[0].clientX);
};

const handleTouchEnd = () => {
  if (!touchStart || !touchEnd) return;

  const distance = touchStart - touchEnd;
  const isLeftSwipe = distance > 50;
  const isRightSwipe = distance < -50;

  if (isLeftSwipe) {
    handleNextImage();
  } else if (isRightSwipe) {
    handlePrevImage();
  }

  setTouchStart(null);
  setTouchEnd(null);
};

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <div className="inventory-container">
      <h1>Our Inventory</h1>

      <div className="inventory-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="filter-dropdowns">
          <select
            className="form-select"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {capitalizeString(brand)}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading inventory...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : filteredInventory && filteredInventory.length > 0 ? (
        <>
          <div className="inventory-grid">
            {filteredInventory.map((item) => (
              <div
                key={item.id}
                className="inventory-card"
                onClick={() => handleCardClick(item)}
              >
                <div className="inventory-image-container">
                  <img
                    src={item.images?.[0] || "/images/placeholder.jpg"}
                    alt={`${item.make || ""} ${item.model || ""}`}
                    className="inventory-image hover-enlarge"
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
        </>
      ) : (
        <div className="text-center">No inventory items available</div>
      )}

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
                <div 
                  className="carousel-container"
                  onTouchStart={handleModalTouchStart}
                  onTouchMove={handleModalTouchMove}
                  onTouchEnd={() => setTouchStartX(null)}
                >
                  <button className="carousel-button prev" onClick={handlePrevImage}>
                    <IoChevronBack size={24}/>
                  </button>
                  <div className="modal-main-image-container"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}>
                    <img 
                      src={selectedItem.images?.[activeImageIndex] || '/images/placeholder.jpg'} 
                      alt={`${selectedItem.make || ''} ${selectedItem.model || ''}`}
                      className="modal-main-image"
                      onClick={(e) => handleImageEnlarge(e, selectedItem.images?.[activeImageIndex])}
                    />
                  </div>
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
                {!isMobile && (
                  <div className="other-pictures">
                    {selectedItem.images?.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Additional view ${index + 1}`}
                        className={`modal-thumbnail ${index === activeImageIndex ? 'active' : ''} hover-enlarge`}
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
                    selectedItem.separator ||
                    selectedItem.deckSize ||
                    selectedItem.liftCapacity) && (
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
                      {selectedItem.deckSize && (
                        <p>
                          <strong>Deck Size:</strong> {selectedItem.deckSize} Inches
                        </p>
                      )}
                      {selectedItem.liftCapacity && (
                        <p>
                          <strong>Lift Capacity:</strong> {selectedItem.liftCapacity}
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

      {enlargedImage && (
        <div className="enlarged-image-overlay" onClick={handleCloseEnlarged}>
          <div className="enlarged-image-container">
            <img 
              src={enlargedImage} 
              alt="Enlarged view" 
              className="enlarged-image"
            />
            <button className="modal-close" onClick={handleCloseEnlarged}>
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="admin-button-container">
        <button 
          className="btn btn-primary admin-button" 
          onClick={handleAdminClick}
        >
          Admin
        </button>
      </div>
    </div>
  );
};

export default Inventory;
