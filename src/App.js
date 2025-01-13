import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import NavbarHook from './components/NavbarHook/NavbarHook';

function App() {
  return (
  <Router>
    <div className="App">
      <header className="App-header">
        <NavbarHook/>
        <Footer/>
      </header>
    </div>
  </Router>
  );
}

export default App;
