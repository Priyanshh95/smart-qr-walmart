import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from './supabaseClient';
import BackButton from './BackButton';
import { NavigationBar } from './Dashboard';
import './Dashboard.css';

const ProductQR = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [packedOnDate, setPackedOnDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [price, setPrice] = useState('');

  const userEmail = localStorage.getItem("userEmail");

  const formatDate = (dateStr) => {
    // If already yyyy-mm-dd (likely), just return
    if (dateStr.includes('-')) return dateStr;

    // Convert dd/mm/yyyy -> yyyy-mm-dd
    const [dd, mm, yyyy] = dateStr.split('/');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userEmail) return;
      const { data, error } = await supabase
        .from('smart-qr')
        .select('*')
        .eq('user_email', userEmail);
      if (error) {
        console.error("Fetch Error:", error.message);
      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, [userEmail]);

  const handleAddProduct = async () => {
    if (!productId || !name || !ingredients || !trackingId || !packedOnDate || !expiryDate || !price || !userEmail) {
      return alert('Please fill all fields and make sure you are logged in.');
    }

    const newProduct = {
      product_id: productId,
      name,
      ingredients,
      trackingId: parseInt(trackingId),
      packedOnDate: formatDate(packedOnDate),
      expiryDate: formatDate(expiryDate),
      price: parseFloat(price),
      user_email: userEmail,
    };

    console.log("📦 Inserting Product:", newProduct);

    const { data, error } = await supabase
      .from('smart-qr')
      .insert([newProduct])
      .select();

    if (error) {
      console.error("❌ Supabase Insert Error:", error.message);
      return alert("Error saving product to Supabase.");
    }

    setProducts([...products, ...data]);
    setProductId('');
    setName('');
    setIngredients('');
    setTrackingId('');
    setPackedOnDate('');
    setExpiryDate('');
    setPrice('');
  };

  return (
    <div>
      <NavigationBar />
      <BackButton />
      <div className="form-container">
        <h2><strong>Generate</strong> QR for Products</h2>

        <div className="form-group">
          <label>Product ID</label>
          <input className="form-input" value={productId} onChange={(e) => setProductId(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Product Name</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Ingredients</label>
          <input className="form-input" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Tracking ID</label>
          <input className="form-input" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Packed On Date</label>
          <input type="date" className="form-input" value={packedOnDate} onChange={(e) => setPackedOnDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Expiry Date</label>
          <input type="date" className="form-input" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Price (₹)</label>
          <input className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} />
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
              <p><strong>ID:</strong> {product.product_id}</p>
              <p><strong>Ingredients:</strong> {product.ingredients}</p>
              <p><strong>Tracking ID:</strong> {product.trackingId}</p>
              <p><strong>Packed On:</strong> {product.packedOnDate}</p>
              <p><strong>Expiry:</strong> {product.expiryDate}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>
              <QRCodeSVG
                value={JSON.stringify({
                  id: product.id,
                  productId: product.product_id,
                  name: product.name,
                  ingredients: product.ingredients,
                  trackingId: product.trackingId,
                  packedOnDate: product.packedOnDate,
                  expiryDate: product.expiryDate,
                  price: product.price
                })}
                size={128}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductQR;
