import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoClose, IoMenu, IoChevronDown } from "react-icons/io5";
import {useMediaQuery} from "react-responsive";
import "./NavbarHook.css";

const NavbarHook = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: "1150px" });

const toggleDropdown = (dropdownName) => {
  if (activeDropdown === dropdownName) {
    setActiveDropdown(null);
  } else {
    setActiveDropdown(dropdownName);
  }
};

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
          <div 
            className={linkClassName} 
            onClick={() => isMobile && toggleDropdown('inventory')}
            style={{cursor: 'pointer'}}
          >
            Inventory <IoChevronDown className='dropdown-icon' />
          </div>
          <ul className={`dropdown-menu ${activeDropdown === 'inventory' ? 'show' : ''}`}>
            <li><NavLink to="/inventory/new" className="dropdown-item" onClick={closeMobileMenu}>New Equipment</NavLink></li>
            <li><NavLink to="/inventory/pre-owned" className="dropdown-item" onClick={closeMobileMenu}>Pre-Owned</NavLink></li>
            <li><NavLink to="/inventory/versatile" className="dropdown-item" onClick={closeMobileMenu}>Versatile</NavLink></li>
            <li><NavLink to="/inventory/kioti" className="dropdown-item" onClick={closeMobileMenu}>Kioti</NavLink></li>
            <li><NavLink to="/inventory/grasshopper" className="dropdown-item" onClick={closeMobileMenu}>Grasshopper</NavLink></li>
            <li><NavLink to="/inventory/claas" className="dropdown-item" onClick={closeMobileMenu}>CLAAS</NavLink></li>
            <li><NavLink to="/inventory/ironcraft" className="dropdown-item" onClick={closeMobileMenu}>IronCraft</NavLink></li>
          </ul>
        </li>
        <li className="nav__item dropdown">
          <div 
            className={linkClassName}
            onClick={() => isMobile && toggleDropdown('repairs')}
            style={{cursor: 'pointer'}}
          >
            Repairs <IoChevronDown className='dropdown-icon' />
          </div>
          <ul className={`dropdown-menu ${activeDropdown === 'repairs' ? 'show' : ''}`}>
            <li><NavLink to="/repair" className="dropdown-item" onClick={closeMobileMenu}>About Our Repairs</NavLink></li>
            <li><NavLink to="/contactus" className="dropdown-item" onClick={closeMobileMenu}>Schedule Repair</NavLink></li>
          </ul>
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
            Larry's Diesel Repair
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