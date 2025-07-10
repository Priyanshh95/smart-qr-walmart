import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

function DashboardHome() {
  return (
    <div className="card">
      <h2>Admin Dashboard</h2>
      <ul className="admin-list">
        <li><Link className="link" to="add-product">Add Product</Link></li>
        <li><Link className="link" to="remove-product">Remove Product</Link></li>
        <li><Link className="link" to="/login">Logout</Link></li>
      </ul>
      <div className="note">
        <strong>Note:</strong> This dashboard will connect to the mobile app database for product management.
      </div>
    </div>
  );
}

function AddProduct() {
  return (
    <div className="card">
      <h3>Add Product</h3>
      <form>
        <input type="text" placeholder="Product Name" />
        <input type="text" placeholder="Product Details" />
        <button type="submit" className="success">Add</button>
      </form>
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

function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />
      <Route path="add-product" element={<AddProduct />} />
      <Route path="remove-product" element={<RemoveProduct />} />
    </Routes>
  );
}

export default AdminDashboard; 