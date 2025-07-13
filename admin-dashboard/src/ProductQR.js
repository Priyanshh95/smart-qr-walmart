// src/ProductQR.js
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import BackButton from './BackButton';
import './Dashboard.css';
import { NavigationBar } from './Dashboard';

const ProductQR = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [packedOnDate, setPackedOnDate] = useState('');

  const userEmail = localStorage.getItem("userEmail");

  const handleAddProduct = async () => {
    if (!name || !ingredients || !trackingId || !expiryDate || !packedOnDate || !userEmail) {
      return alert('Fill all fields and login first');
    }

    const newProduct = {
      id: Date.now(),
      name,
      ingredients,
      trackingId,
      expiryDate,
      packedOnDate
    };

    try {
      await axios.post("http://localhost:5000/api/save-product-qr", {
        userEmail,
        product: newProduct,
      });

      setProducts([...products, newProduct]);
      setName('');
      setIngredients('');
      setTrackingId('');
      setExpiryDate('');
      setPackedOnDate('');
    } catch (err) {
      console.error("Error saving QR", err);
    }
  };

  useEffect(() => {
    const fetchSaved = async () => {
      if (!userEmail) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/get-user-products/${userEmail}`);
        if (res.data?.products) setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching QR data", err);
      }
    };

    fetchSaved();
  }, [userEmail]);

  return (
    <div>
      <NavigationBar />
      <BackButton />
      <div className="form-container">
        <h2>Generate QR for Products</h2>
        
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
          <label>Packed On Date</label>
          <input
            className="form-input"
            type="date"
            value={packedOnDate}
            onChange={(e) => setPackedOnDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Expiry Date</label>
          <input
            className="form-input"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <button className="form-btn" onClick={handleAddProduct}>
          Add & Generate QR
        </button>
      </div>

      <div className="dashboard-container">
        <div className="qr-products-grid">
          {products.map((product) => (
            <div key={product.id} className="qr-product-card">
              <h4>{product.name}</h4>
              <p><strong>Ingredients:</strong> {product.ingredients}</p>
              <p><strong>Tracking ID:</strong> {product.trackingId}</p>
              <p><strong>Packed On:</strong> {product.packedOnDate}</p>
              <p><strong>Expiry Date:</strong> {product.expiryDate}</p>
              <div className="qr-code-container">
                <QRCodeSVG value={JSON.stringify(product)} size={128} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductQR;
