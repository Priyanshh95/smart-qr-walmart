import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ProductQR from './ProductQR';

function DashboardHome() {
  return (
    <div className="card">
      <h2>Admin Dashboard</h2>
      <ul className="admin-list">
        <li><Link className="link" to="remove-product">Remove Product</Link></li>
        <li><Link className="link" to="generate">Generate Product QR</Link></li>
        <li><Link className="link" to="/login">Logout</Link></li>
      </ul>
      <div className="note">
        <strong>Note:</strong> This dashboard will connect to the mobile app database for product management.
      </div>
    </div>
  );
}

function RemoveProduct() {
  return (
    <div className="card">
      <h3>Remove Product</h3>
      <form>
        <input type="text" placeholder="Product ID or Name" />
        <button type="submit" className="danger">Remove</button>
      </form>
    </div>
  );
}

function GenerateQRPage() {
  return (
    <div className="card">
      <h3>Generate Product QR</h3>
      <ProductQR />
    </div>
  );
}


function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />
      <Route path="remove-product" element={<RemoveProduct />} />
      <Route path="generate" element={<GenerateQRPage />} />

    </Routes>
  );
}

export default AdminDashboard;