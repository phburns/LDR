import React, { useEffect, useState } from 'react';
import './footer.css';
import { Icon } from '@iconify/react';
import facebookIcon from '@iconify-icons/mdi/facebook';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrolledToBottom = scrollTop + windowHeight >= documentHeight - 10;

      setIsVisible(scrolledToBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial load

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className={`footer ${isVisible ? 'visible' : ''}`}>
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Larry's Diesel and Repair, LLC. All rights reserved.</p>
        <p>Got questions or concerns? <a href='/contactus'>Send us an email</a> or give us a <a href='/contactus'>call</a>. Also check out our facebook to stay up to date with us!
         <a href="https://www.facebook.com/larrysdieselrepair/" target="_blank" rel="noopener noreferrer">
           <Icon icon={facebookIcon} className="facebook-icon" />
         </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;