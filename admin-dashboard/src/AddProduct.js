import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [trackingId, setTrackingId] = useState('');

  const handleAdd = async () => {
    if (!name || !price || !ingredients || !trackingId) {
      return alert("Please fill all fields");
    }

    const userEmail = localStorage.getItem("userEmail");

    try {
      const res = await axios.post('http://localhost:5000/api/add-product', {
        userEmail,
        product: {
          name,
          ingredients,
          price,
          trackingId
        }
      });

      alert("✅ Product added: " + res.data.product.name);
      setName('');
      setPrice('');
      setIngredients('');
      setTrackingId('');
    } catch (err) {
      alert("❌ Failed to add: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Add Product</h2>
      <input placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
      <input placeholder="Tracking ID" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} />
      <input placeholder="Price (₹)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <button onClick={handleAdd}>Add Product</button>
    </div>
  );
};

export default AddProduct;
