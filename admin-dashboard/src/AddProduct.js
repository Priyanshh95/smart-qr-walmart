import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import BackButton from './BackButton';
import { NavigationBar } from './Dashboard';

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
    <div>
      <NavigationBar />
      <BackButton />
      <div className="form-container">
        <h2>Add Product</h2>
        
        <div className="form-group">
          <label>Product Name</label>
          <input 
            className="form-input"
            placeholder="Enter product name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label>Ingredients</label>
          <input 
            className="form-input"
            placeholder="Enter ingredients" 
            value={ingredients} 
            onChange={(e) => setIngredients(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label>Tracking ID</label>
          <input 
            className="form-input"
            placeholder="Enter tracking ID" 
            value={trackingId} 
            onChange={(e) => setTrackingId(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label>Price (₹)</label>
          <input 
            className="form-input"
            placeholder="Enter price" 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
          />
        </div>

        <button className="form-btn" onClick={handleAdd}>
          Add Product
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
