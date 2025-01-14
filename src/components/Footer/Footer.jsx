import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Larry's Diesel and Repair, LLC. All rights reserved. </p>
      <br/>
      <p> Got questions or concerns? <a href='/contactus'>Send us an email</a> or give us a call at (620)-231-5420.</p>
    </footer>
  );
};

export default Footer;