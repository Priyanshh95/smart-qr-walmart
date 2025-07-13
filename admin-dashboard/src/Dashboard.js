import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import BackButton from './BackButton';

const Dashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <BackButton />
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <div className="dashboard-options">
        <button onClick={() => navigate('/add-product')}>Add Product</button>
        <button onClick={() => navigate('/remove-product')}>Remove Product</button>
        <button onClick={() => navigate('/adjust-pricing')}>Adjust Pricing</button>
        <button onClick={() => navigate('/generate-qr')}>Generate QR</button>
      </div>
    </div>
  );
};

export default Dashboard;
