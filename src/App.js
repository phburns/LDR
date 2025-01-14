import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import NavbarHook from './components/NavbarHook/NavbarHook';
import ContactUs from './pages/contactus/contactus.js';
import Home from './pages/home/home.js';
import Inventory from './pages/inventory/inventory.js';
import Partners from './pages/partners/partners.js';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <NavbarHook />
        </header>
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/inventory' element={<Inventory />} />
            <Route path='/partners' element={<Partners />} />
            <Route path='/contactus' element={<ContactUs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;