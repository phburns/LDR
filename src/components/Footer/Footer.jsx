import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Larry's Diesel and Repair, LLC. All rights reserved.</p>
        <p>Got questions or concerns? <a href='/contactus'>Send us an email</a> or give us a call. Also check out our facebook to stay up to date with us!</p> <iconify-icon icon='baseline-facebook'></iconify-icon>
        
      </div>
    </footer>
  );
};

export default Footer;