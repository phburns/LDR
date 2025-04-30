import React from 'react';
import NavbarHook from '../NavbarHook/NavbarHook';
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