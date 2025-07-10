import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const ProductQR = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [trackingId, setTrackingId] = useState('');

  const handleAddProduct = () => {
    if (!name || !ingredients || !trackingId) return alert('Fill all fields');
    
    const newProduct = {
      id: Date.now(),
      name,
      ingredients,
      trackingId,
    };
    setProducts([...products, newProduct]);
    setName('');
    setIngredients('');
    setTrackingId('');
  };

  return (
    <div style={{ padding: 20 }}>
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
            <QRCodeSVG
              value={JSON.stringify(product)}
              size={128}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductQR;