import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const auth = localStorage.getItem("adminAuthenticated") === "true";
        console.log("Auth state:", auth);
        setIsAuthenticated(auth);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
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
  );
}

export default App;