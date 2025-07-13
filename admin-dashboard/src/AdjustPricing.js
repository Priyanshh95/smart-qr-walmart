import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import BackButton from './BackButton';
import { NavigationBar } from './Dashboard';

const AdjustPricing = () => {
  const [productId, setProductId] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleAdjust = async () => {
    if (!productId || !newPrice) return alert("Fill all fields");

    const userEmail = localStorage.getItem("userEmail");

    try {
      const res = await axios.put(`http://localhost:5000/api/update-price/${userEmail}/${productId}`, {
        newPrice
      });
      alert("✅ " + res.data.message);
      setProductId('');
      setNewPrice('');
    } catch (err) {
      alert("❌ Failed to update: " + (err.response?.data || err.message));
    }
  };

  return (
    <div>
      <NavigationBar />
      <BackButton />
      <div className="form-container">
        <h2>Adjust Product Pricing</h2>
        
        <div className="form-group">
          <label>Product ID</label>
          <input 
            className="form-input"
            placeholder="Enter product ID" 
            value={productId} 
            onChange={(e) => setProductId(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label>New Price (₹)</label>
          <input 
            className="form-input"
            placeholder="Enter new price" 
            type="number" 
            value={newPrice} 
            onChange={(e) => setNewPrice(e.target.value)} 
          />
        </div>

        <button className="form-btn" onClick={handleAdjust}>
          Update Price
        </button>
      </div>
    </div>
  );
};

export default AdjustPricing;
