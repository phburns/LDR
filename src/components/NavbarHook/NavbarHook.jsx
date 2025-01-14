import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import {useMediaQuery} from "react-responsive";
import "./NavbarHook.css";

const NavbarHook = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: "1150px" });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const renderNavLinks = () => {
    const listClassName = isMobile ? "nav__list" : "nav__list__web";
    const linkClassName = "nav__link";

    return (
      <ul className={listClassName}>
        <li className="nav__item">
          <NavLink to="/" className={linkClassName} onClick={closeMobileMenu}>
            Home
          </NavLink>
        </li>
        <li className="nav__item dropdown">
          <NavLink to="/inventory" className={linkClassName} onClick={closeMobileMenu}>
            Inventory
          </NavLink>
          <ul className="dropdown-menu">
            <li><NavLink to="/inventory/new" className="dropdown-item" onClick={closeMobileMenu}>New Equipment</NavLink></li>
            <li><NavLink to="/inventory/pre-owned" className="dropdown-item" onClick={closeMobileMenu}>Pre-Owned</NavLink></li>
            <li><NavLink to="/inventory/versatile" className="dropdown-item" onClick={closeMobileMenu}>Versatile</NavLink></li>
            <li><NavLink to="/inventory/kioti" className="dropdown-item" onClick={closeMobileMenu}>Kioti</NavLink></li>
            <li><NavLink to="/inventory/grasshopper" className="dropdown-item" onClick={closeMobileMenu}>Grasshopper</NavLink></li>
            <li><NavLink to="/inventory/claas" className="dropdown-item" onClick={closeMobileMenu}>CLAAS Lexion</NavLink></li>
          </ul>
        </li>
        <li className="nav__item">
          <NavLink to="/partners" className={linkClassName} onClick={closeMobileMenu}>
            Partners
          </NavLink>
        </li>
        <li className="nav__item">
          <NavLink to="/contactus" className={linkClassName} onClick={closeMobileMenu}>
              Contact Us
          </NavLink>
        </li>
      </ul>
    );
  };

  return (
    <header className="header">
      <nav className="nav container">
        <div className="navbar-brand">
          <NavLink to="/" className="nav__logo">
            Larry's Diesel and Repair
          </NavLink>
        </div>

        {isMobile && (
          <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
            <IoMenu />
          </div>
        )}

        {isMobile ? (
          <div
            className={`nav__menu ${isMenuOpen ? "show-menu" : ""}`}
            id="nav-menu"
          >
            <div className="nav__close" id="nav-close" onClick={toggleMenu}>
              <IoClose />
            </div>
            {renderNavLinks()}
          </div>
        ) : (
          <div className="nav__menu">
            {renderNavLinks()}
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavbarHook;