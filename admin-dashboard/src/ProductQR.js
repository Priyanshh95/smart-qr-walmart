// src/ProductQR.js
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import BackButton from './BackButton';

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
    <div style={{ padding: 20, paddingTop: 80 }}>
      <BackButton />
      <h2>Generate QR for Products</h2>
      <input
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <input
        placeholder="Ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <input
        placeholder="Tracking ID"
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <input
        type="date"
        value={packedOnDate}
        onChange={(e) => setPackedOnDate(e.target.value)}
        style={{ marginRight: 10 }}
        title="Packed On Date"
      />
      <input
        type="date"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        style={{ marginRight: 10 }}
        title="Expiry Date"
      />
      <button onClick={handleAddProduct}>Add & Generate QR</button>

      <div style={{ marginTop: 30 }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ccc',
              padding: 15,
              marginBottom: 20,
              borderRadius: 8,
            }}
          >
            <h4>{product.name}</h4>
            <p><strong>Ingredients:</strong> {product.ingredients}</p>
            <p><strong>Tracking ID:</strong> {product.trackingId}</p>
            <p><strong>Packed On:</strong> {product.packedOnDate}</p>
            <p><strong>Expiry Date:</strong> {product.expiryDate}</p>
            <QRCodeSVG value={JSON.stringify(product)} size={128} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductQR;
