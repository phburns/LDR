import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import NavbarHook from './components/NavbarHook/NavbarHook';
import Home from './pages/home';
import Inventory from './pages/inventory';
import Partners from './pages/partners';
import AboutUs from './pages/aboutus';

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
            <Route path='/aboutus' element={<AboutUs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;