import React, { useEffect } from "react";
import "./home.css"; // Create this file

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
            <img
              src="/images/versatiledeltatrack.jpg"
              className="d-block w-100"
              alt="Slide showcasing a versatile deltatrack tractor"
            />
          </div>
          <div className="carousel-item">
            <img
              src="/images/claaslexion.jpg"
              className="d-block w-100"
              alt="Slide showcasing a claas lexion combine"
            />
          </div>
          <div className="carousel-item">
            <img
              src="/images/kiotitractor.jpg"
              className="d-block w-100"
              alt="Slide showcasing a kioti tractor"
            />
          </div>
          <div className="carousel-item">
            <img
              src="/images/grasshoppermower.jpg"
              className="d-block w-100"
              alt="Slide showcasing a kioti tractor"
            />
          </div>
          <div className="carousel-item">
            <img
              src="/images/ldrshop.png"
              className="d-block w-100"
              alt="Slide showcasing a kioti tractor"
            />
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
  );
};

export default Home;
