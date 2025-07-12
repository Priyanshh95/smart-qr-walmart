import React, { useState } from 'react';
import './Dashboard.css';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleAdd = () => {
    if (!name || !price) return alert("Please fill all fields");
    alert(`Product "${name}" with price ₹${price} added! (stubbed)`);
    setName('');
    setPrice('');
  };

  return (
    <div className="dashboard-container">
      <h2>Add Product</h2>
      <input placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <button onClick={handleAdd}>Add Product</button>
    </div>
  );
};

export default AddProduct;