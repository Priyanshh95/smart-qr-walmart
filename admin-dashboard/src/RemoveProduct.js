import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import BackButton from './BackButton';
import { NavigationBar } from './Dashboard';

const RemoveProduct = () => {
  const [productId, setProductId] = useState('');

  const handleRemove = async () => {
    if (!productId) return alert("Enter Product ID");

    const userEmail = localStorage.getItem("userEmail");

    try {
      const res = await axios.delete(`http://localhost:5000/api/delete-product/${userEmail}/${productId}`);
      alert("✅ " + res.data.message);
      setProductId('');
    } catch (err) {
      alert("❌ Failed to delete: " + (err.response?.data || err.message));
    }
  };

  return (
    <div>
      <NavigationBar />
      <BackButton />
      <div className="form-container">
        <h2>Remove Product</h2>
        
        <div className="form-group">
          <label>Product ID</label>
          <input 
            className="form-input"
            placeholder="Enter product ID to remove" 
            value={productId} 
            onChange={(e) => setProductId(e.target.value)} 
          />
        </div>

        <button className="form-btn" onClick={handleRemove}>
          Remove Product
        </button>
      </div>
    </div>
  );
};

export default RemoveProduct;
