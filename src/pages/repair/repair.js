import React from "react";
import "./repair.css";

const Repair = () => {
  return (
    <div className="repair-container">
      <div className="repair-hero">
        <h1>Larry's Diesel Repair Services</h1>
        <span className="subtitle">Serving Crawford County Since 1992.</span>
      </div>
      
      <div className="repair-content">
        <div className="repair-description">
          <p>
            Larry's Diesel Repair, LLC. has been serving the Crawford County area since 1992. 
            We are a family owned business delivering honest professional repair and maintenance 
            services to the people of Pittsburg and surrounding areas.
          </p>
          <p>
            Our quality certified technicians employ today's latest technology and are equipped 
            to handle all major and minor repairs.
          </p>
        </div>

        <div className="repair-images">
          <div className="image-container">
            <img 
              src="/images/insideshop.jpg" 
              alt="Inside our repair facility" 
              className="repair-image"
            />
            <span className="image-caption">Our Modern Repair Facility</span>
          </div>
          <div className="image-container">
            <img 
              src="/images/placeholder.jpg" 
              alt="Detailed repair work" 
              className="repair-image"
            />
            <span className="image-caption">Precision Repair Work</span>
          </div>
        </div>

        <div className="repair-cta">
          <div className="certification">
            <h3>Authorized CAT Service Center</h3>
            <p>We look forward to taking care of your repair needs.</p>
          </div>
          <div className="certification">
            <h3>Schedule Your Repair</h3>
            <p>Call us at: <a href="tel:620-231-5420">620-231-5420</a> or send us an <a href='/contactus'>email</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repair;