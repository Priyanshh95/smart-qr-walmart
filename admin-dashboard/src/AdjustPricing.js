import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './Dashboard.css';
import BackButton from './BackButton';
import { NavigationBar } from './Dashboard';

const AdjustPricing = () => {
  const [productId, setProductId] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleAdjust = async () => {
    if (!productId || !newPrice) return alert("Fill all fields");

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return alert("You must be logged in.");

    try {
      const { error } = await supabase
        .from('smart-qr')
        .update({ price: parseFloat(newPrice) })
        .match({ user_email: userEmail, product_id: productId });

      if (error) {
        console.error("❌ Update Error:", error.message);
        alert("❌ Failed to update price.");
      } else {
        alert("✅ Price updated successfully.");
        setProductId('');
        setNewPrice('');
      }
    } catch (err) {
      console.error("❌ Unexpected Error:", err.message);
      alert("❌ Unexpected error occurred.");
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
