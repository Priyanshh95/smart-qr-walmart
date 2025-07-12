import React, { useState } from 'react';
import './Dashboard.css';

const AdjustPricing = () => {
  const [productId, setProductId] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleAdjust = () => {
    if (!productId || !newPrice) return alert("Fill all fields");
    alert(`Price for product ID ${productId} updated to ₹${newPrice} (stubbed)`);
    setProductId('');
    setNewPrice('');
  };

  return (
    <div className="dashboard-container">
      <h2>Adjust Product Pricing</h2>
      <input placeholder="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)} />
      <input placeholder="New Price" type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
      <button onClick={handleAdjust}>Update Price</button>
    </div>
  );
};

export default AdjustPricing;