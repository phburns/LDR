import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../repair/repair.css";
import "./home.css";

const Home = () => {

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const carousel = document.getElementById("carouselExampleIndicators");
    if (carousel) {
      const bootstrap = require("bootstrap/dist/js/bootstrap.bundle.min.js");
      new bootstrap.Carousel(carousel, {
        interval: 6000,
      });
    }
  }, []);

  return (
    <>
      <div className="banner-background"></div>
      <div className="home-container">
        <div className="content">
          <div ClassName='carousel-section'>
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <a
                  href="https://versatile-ag.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/versatiledeltatrack.jpg"
                    alt="Slide showcasing a versatile deltatrack tractor"
                  />
                  <div className="website-hint">Click to visit website</div>
                </a>
                <div className="carousel-caption">
                  <h5>Versatile Tractor</h5>
                  <p>Simply Powerful. Simply Versatile.</p>
                </div>
              </div>
              <div className="carousel-item">
                <a
                  href="https://www.claas.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/claaslexion.jpg"
                    alt="Slide showcasing a claas lexion combine"
                  />
                  <div className="website-hint">Click to visit website</div>
                </a>
                <div className="carousel-caption">
                  <h5>CLAAS</h5>
                  <p>Increase Your Productivity. </p>
                </div>
              </div>
              <div className="carousel-item">
                <a
                  href="https://kioti.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/kiotitractor.jpg"
                    alt="Slide showcasing a kioti tractor"
                  />
                  <div className="website-hint">Click to visit website</div>
                </a>
                <div className="carousel-caption">
                  <h5>Kioti Tractors</h5>
                  <p>Unleash the Possibility of the Land.</p>
                </div>
              </div>
              <div className="carousel-item">
                <a
                  href="https://www.grasshoppermower.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/grasshoppermower.jpg"
                    className="carosel-caption d-block w-100"
                    alt="Slide showcasing 2 grasshopper mowers"
                  />
                  <div className="website-hint">Click to visit website</div>
                </a>
                <div className="carousel-caption">
                  <h5>Grasshopper Mowers</h5>
                  <p>Committed to the Cut.</p>
                </div>
              </div>
              <div className="carousel-item">
                <a
                  href="https://www.ironcraftusa.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/ironcraftusa.jpg"
                    className="carosel-caption d-block w-100"
                    alt="Slide showcasing Ironcraft Equipment"
                  />
                  <div className="website-hint">Click to visit website</div>
                </a>
                <div className="carousel-caption ">
                  <h5>IronCraft</h5>
                  <p>Helping Manage Your Land one Attachment at a Time.</p>
                </div>
              </div>
              <div className="carousel-item">
                <NavLink to="/contactus">
                  <img
                    src="/images/ldrshop.jpg"
                    alt="Slide showcasing Larry's Diesel and Repair Shop"
                  />
                  <div className="website-hint">Click to Contact Us.</div>
                </NavLink>
                <div className="carousel-caption">
                  <h5>Our Shop</h5>
                  <p>Serving Crawford County Since 1992.</p>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
          </div>

          <div className="brand-section">
            <h2 className="brand-title">Shop Our Inventory By Brand</h2>
            <div className="brand-container certification">
              <NavLink to="/inventory/grasshopper" className="brand-link">
                <img
                  src="/images/grasshopper_logo.png"
                  alt="Grasshopper"
                  className="brand-logo"
                />
              </NavLink>
              <NavLink to="/inventory/claas" className="brand-link">
                <img
                  src="/images/claaslogo.png"
                  alt="CLAAS"
                  className="brand-logo"
                  style={{ height: "100px" }}
                />
              </NavLink>
              <NavLink to="/inventory/kioti" className="brand-link">
                <img
                  src="/images/kioti_logo.png"
                  alt="Kioti"
                  className="brand-logo"
                  style={{ width: "100px", height: "100px" }}
                />
              </NavLink>
              <NavLink to="/inventory/versatile" className="brand-link">
                <img
                  src="/images/versatile_logo.svg.png"
                  alt="Versatile"
                  className="brand-logo"
                />
              </NavLink>
              <NavLink to="/inventory/ironcraft" className="brand-link">
                <img
                  src="/images/ironcraftlogo.jpg"
                  alt="Ironcraft"
                  className="brand-logo"
                />
              </NavLink>
            </div>
          </div>

          <div className="repair-images repair-container">
            <div className="image-container">
              <NavLink to="/contactus">
                <img
                  src="/images/enginerepair.jpeg"
                  alt="close up of an engine in repair"
                  className="repair-image"
                />
                <div className="website-hint">Click to Contact Us</div>
                <span className="image-caption">
                  Here for All Your Repair Needs.
                </span>
              </NavLink>
            </div>

            <div className="image-container storehours-container">
                <img
                  src="/images/storehours.jpg"
                  alt="Larry's Diesel Store Hours"
                  className="repair-image"
                  onClick={() => setShowModal(true)}
                  style={{ cursor: "pointer" }}
                />
            </div>
            {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content">
            <img
              src="/images/storehours.jpg"
              alt="Larry's Diesel Store Hours"
              style={{ width: '100%', height: 'auto', maxWidth: '90vw' }}
            />
          </div>
        </div>
      )}
          </div>
        </div>

        <div className="brand-section">
          <h2 className="brand-title">Check out our Other Partners:</h2>
          <div className="other-partners-container certification">
            <NavLink to="https://www.reichardind.com/" className="brand-link">
              <img
                src="/images/reichardlogo.png"
                alt="reichard industries logo"
                className="brand-logo"
              />
            </NavLink>
            <NavLink to="https://maywes.com/" className="brand-link">
              <img
                src="/images/mayweslogo.jpg"
                alt="May Wes Manufactuing logo"
                className="brand-logo"
              />
            </NavLink>
            <div />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
