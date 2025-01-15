import React from "react";
import "./repair.css";

const Repair = () => {
  return (
    <div className="repair-container">
      <div className="repair-hero">
        <h1>Larry's Diesel Repair Services</h1>
        <span className="subtitle">Serving Crawford County Since 1992.</span>
      </div>

      <div className="repair-content text-black">
        <div className="repair-description certification">
          <p>
            Larry's Diesel Repair, LLC. has been serving the Crawford County
            area since 1992. We are a family owned business delivering honest
            professional repair and maintenance services to the people of
            Pittsburg and surrounding areas.
          </p>
          <p>
            Our quality certified technicians employ today's latest technology
            and are equipped to handle all major and minor repairs.
          </p>
        </div>

        <div className="repair-images">
          <div className="image-container">
            <img
              src="/images/shopwideshot.jpeg"
              alt="Inside our repair facility"
              className="repair-image"
            />
            <span className="image-caption">Our Modern Repair Facility</span>
          </div>
          <div className="image-container">
            <img
              src="/images/working.jpeg"
              alt="Detailed repair work"
              className="repair-image"
            />
            <span className="image-caption">Precision Repair Work</span>
          </div>
        </div>

        <div className="repair-cta">
          <div className="certification text-black">
            <h3>Certified CAT and Cummins Service Center</h3>
            <img
                src="/images/catlogo.png"
                alt="CAT Logo"
                className="service-logo"
              />
              <img
                src="/images/cummins.png"
                alt="Cummins Logo"
                className="service-logo"
              />
            <p>We look forward to taking care of your repair needs.</p>
            <div className="logo-container">
            </div>
          </div>
          <div className="certification text-black">
            <h3>Schedule Your Repair</h3>
            <img
                src="/images/truckrepair.jpg"
                alt="Cummins Logo"
                className="repair-logo"
              />
            <p>
              Call us at: <a href="tel:620-231-5420">620-231-5420</a> or send us
              an <a href="/contactus">email</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repair;
