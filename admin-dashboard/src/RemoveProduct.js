import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

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
    <div className="dashboard-container">
      <h2>Remove Product</h2>
      <input placeholder="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)} />
      <button onClick={handleRemove}>Remove</button>
    </div>
  );
};

export default RemoveProduct;
