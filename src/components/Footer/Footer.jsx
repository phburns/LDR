import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Larry's Diesel and Repair, LLC. All rights reserved. </p>
      <br/>
      <p> Got questions or concerns? Feel free to <a href='/contactus'>send us an email</a> or give us a call.</p>
      <br/>
      <p>While you're down here why not check out our socials too? </p>
     

    </footer>
  );
};

export default Footer;