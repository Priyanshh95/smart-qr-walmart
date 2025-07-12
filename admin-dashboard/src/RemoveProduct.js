import React, { useState } from 'react';
import './Dashboard.css';

const RemoveProduct = () => {
  const [productId, setProductId] = useState('');

  const handleRemove = () => {
    if (!productId) return alert("Enter Product ID to remove");
    alert(`Product with ID ${productId} removed (stubbed)`);
    setProductId('');
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