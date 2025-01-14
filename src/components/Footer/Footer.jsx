import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Larry's Diesel and Repair, LLC. All rights reserved.</p>
        <p>Got questions or concerns? <a href='/contactus'>Send us an email</a> or give us a call at (620)-231-5420.</p>
      </div>
    </footer>
  );
};

export default Footer;