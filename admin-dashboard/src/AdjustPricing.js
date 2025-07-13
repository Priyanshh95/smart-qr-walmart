import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import BackButton from './BackButton';

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
    <div className="dashboard-container">
      <BackButton />
      <h2>Adjust Product Pricing</h2>
      <input placeholder="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)} />
      <input placeholder="New Price (₹)" type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
      <button onClick={handleAdjust}>Update Price</button>
    </div>
  );
};

export default AdjustPricing;
