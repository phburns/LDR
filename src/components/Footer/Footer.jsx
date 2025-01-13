import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Larry's Diesel and Repair, LLC. All rights reserved.</p>
    </footer>
  );
};

export default Footer;