import React from 'react';
import './footer.css';
import { Icon } from '@iconify/react';
import facebookIcon from '@iconify-icons/mdi/facebook';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Larry's Diesel and Repair, LLC. All rights reserved.</p>
        <p>Got questions or concerns? <a href='/contactus'>Send us an email</a> or give us a call. Also check out our facebook to stay up to date with us!
         <a href="https://www.facebook.com/larrysdieselrepair/" target="_blank" rel="noopener noreferrer">
           <Icon icon={facebookIcon} className="facebook-icon" />
         </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;