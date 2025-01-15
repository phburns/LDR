import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AdminLogin from './components/AdminLogin/AdminLogin';
import Footer from './components/Footer/Footer';
import NavbarHook from './components/NavbarHook/NavbarHook';
import NotFound from './components/NotFound/NotFound';
import AdminPage from './pages/admin/admin';
import ContactUs from './pages/contactus/contactus';
import Home from './pages/home/home';
import Inventory from './pages/inventory/inventory';
import Repair from './pages/repair/repair';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <NavbarHook />
        </header>
        <main className='main-content'>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/inventory' element={<Inventory />} />
            <Route path='/inventory/:brand' element={<Inventory />} />
            <Route path='/repair' element={<Repair />} />
            <Route path='/contactus' element={<ContactUs />} />
            <Route path='/admin' element={
              localStorage.getItem('adminAuthenticated') === 'true' 
                ? <AdminPage /> 
                : <AdminLogin />
            } />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Layout>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;