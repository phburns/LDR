import React, { useEffect } from "react";
import { Icon } from '@iconify/react';
import "./home.css";

const Home = () => {
  useEffect(() => {
    // Initialize Bootstrap carousel
    const bootstrap = require("bootstrap/dist/js/bootstrap.bundle.min.js");
    const carousel = new bootstrap.Carousel(
      document.getElementById("carouselExampleIndicators"),
      {
        interval: 6000,
      }
    );
  }, []);

  return (
    <div className="home-container">
      <div
        id="carouselExampleIndicators"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="3"
            aria-label="Slide 4"
          ></button>
        <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="4"
            aria-label="Slide 5"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <a href="https://versatile-ag.com/" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/versatiledeltatrack.jpg"
                alt="Slide showcasing a versatile deltatrack tractor"
              />
              <div className="website-hint">Click to visit website</div>
            </a>
            <div className='carousel-caption d-none d-md-block'>
                <h5>Versatile Tractor</h5>
                <p>We are proud to be a dealer of versatile tractor.</p>
            </div>
          </div>
          <div className="carousel-item">
            <a href="https://www.claas.com/" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/claaslexion.jpg"
                alt="Slide showcasing a claas lexion combine"
              />
              <div className="website-hint">Click to visit website</div>
            </a>
            <div className='carousel-caption d-none d-md-block'>
                <h5>CLAAS Lexion</h5>
                <p>Proud Dealer of CLAAS Lexion. </p>
            </div>
          </div>
          <div className="carousel-item">
            <a href="https://kioti.com/" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/kiotitractor.jpg"
                alt="Slide showcasing a kioti tractor"
              />
              <div className="website-hint">Click to visit website</div>
            </a>
            <div className='carousel-caption d-none d-md-block'>
                <h5>Kioti Tractors</h5>
                <p>Proud Dealer of Kioti Tractor.</p>
            </div>
          </div>
          <div className="carousel-item">
            <a href="https://www.grasshoppermower.com/" target="_blank" rel="noopener noreferrer">
              <img
                src="/images/grasshoppermower.jpg"
                className="carosel-caption d-block w-100"
                alt="Slide showcasing 2 grasshopper mowers"
              />
              <div className="website-hint">Click to visit website</div>
            </a>
            <div className='carousel-caption d-none d-md-block'>
                <h5>Grasshopper Mowers</h5>
                <p>Proud Dealer of Grasshopper Mowers.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="/images/ldrshop.png"
              alt="Slide showcasing an image of Larry's Diesel and Repair Shop"
            />
            <div className='carousel-caption d-none d-md-block'>
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
      
      <div className="brand-section">
        <h2 className="brand-title">Shop By Brand</h2>
        <div className="brand-container">
          <a href="https://www.grasshoppermower.com/" target="_blank" rel="noopener noreferrer" className="brand-link">
            <img src="/images/grasshopper_logo.png" alt="Grasshopper" className="brand-logo" />
          </a>
          <a href="https://www.claas.com/" target="_blank" rel="noopener noreferrer" className="brand-link">
            <img src="/images/claas-logo.png" alt="CLAAS" className="brand-logo" style={{width: '400px'}} />
          </a>
          <a href="https://kioti.com/" target="_blank" rel="noopener noreferrer" className="brand-link">
            <img src="/images/kioti_logo.png" alt="Kioti" className="brand-logo" />
          </a>
          <a href="https://versatile-ag.com/" target="_blank" rel="noopener noreferrer" className="brand-link">
            <img src="/images/versatile_logo.svg.png" alt="Versatile" className="brand-logo" />
            <Icon icon="mdi:arrow-top-right" className="brand-logo" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;