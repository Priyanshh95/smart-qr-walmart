import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './Dashboard.css';
import BackButton from './BackButton';
import { NavigationBar } from './Dashboard';

const RemoveProduct = () => {
  const [productId, setProductId] = useState('');

  const handleRemove = async () => {
    if (!productId) return alert("Enter Product ID");

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return alert("You must be logged in.");

    try {
      const { error } = await supabase
        .from('smart-qr')
        .delete()
        .match({ user_email: userEmail, product_id: productId });

      if (error) {
        console.error("❌ Delete Error:", error.message);
        alert("❌ Failed to delete product.");
      } else {
        alert("✅ Product removed successfully.");
        setProductId('');
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
