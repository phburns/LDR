import React from 'react';
import NavbarHook from '../NavbarHook/NavbarHook';
import Footer from '../Footer/Footer';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <>
      <NavbarHook />
      <div className="content-wrapper">
        {children}
      </div>
    </>
  );
};

export default Layout;