import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminSignup from './AdminSignup';
import Dashboard from './Dashboard';
import AddProduct from './AddProduct';
import RemoveProduct from './RemoveProduct';
import AdjustPricing from './AdjustPricing';
import ProductQR from './ProductQR';

function App() {
  const isLoggedIn = localStorage.getItem("userEmail");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<AdminSignup />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/add-product" element={isLoggedIn ? <AddProduct /> : <Navigate to="/login" />} />
        <Route path="/remove-product" element={isLoggedIn ? <RemoveProduct /> : <Navigate to="/login" />} />
        <Route path="/adjust-pricing" element={isLoggedIn ? <AdjustPricing /> : <Navigate to="/login" />} />
        <Route path="/generate-qr" element={isLoggedIn ? <ProductQR /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
