import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import Footer from "./components/Footer/Footer";
import Layout from "./components/Layout/Layout";
import NavbarHook from "./components/NavbarHook/NavbarHook";
import NotFound from "./components/NotFound/NotFound";
import AdminPage from "./pages/admin/admin";
import ContactUs from "./pages/contactus/contactus";
import Home from "./pages/home/home";
import Inventory from "./pages/inventory/inventory";
import Repair from "./pages/repair/repair";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("adminAuthenticated") === "true");
  }, []);
  
  return (
    <Router>
      <div className="App">
        <header>
          <NavbarHook />
        </header>
        <main className="main-content">
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/:brand" element={<Inventory />} />
              <Route path="/repair" element={<Repair />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route
                path="/admin"
                element={isAuthenticated ? <AdminPage /> : <AdminLogin />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
