// src/AdjustPricing.js
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './Dashboard.css';
import BackButton from './BackButton';
import { NavigationBar } from './Dashboard';
import { getAIBasedPrice } from './adjustPricingAI';

const AdjustPricing = () => {
  const [productId, setProductId] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const userEmail = localStorage.getItem("userEmail");

  const fetchAndSuggestPrice = async () => {
    if (!productId) return alert("Enter product ID");
    if (!userEmail) return alert("You must be logged in.");

    const { data, error } = await supabase
      .from('smart-qr')
      .select('*')
      .eq('product_id', productId)
      .eq('user_email', userEmail)
      .single();

    if (error || !data) {
      console.error("❌ Fetch Error:", error?.message || "Product not found.");
      return alert("❌ Product not found.");
    }

    try {
      setLoadingAI(true);
      const aiResponse = await getAIBasedPrice(data);
      setSuggestedPrice(aiResponse.suggestedPrice);
      setAiExplanation(aiResponse.explanation);
    } catch (err) {
      console.error("❌ AI Error:", err.message);
      alert("❌ Failed to get AI suggestion.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAdjust = async (finalPrice) => {
    if (!productId || !finalPrice) return alert("Fill all fields");

    try {
      const { error } = await supabase
        .from('smart-qr')
        .update({ price: parseFloat(finalPrice) })
        .match({ user_email: userEmail, product_id: productId });

      if (error) {
        console.error("❌ Update Error:", error.message);
        alert("❌ Failed to update price.");
      } else {
        alert("✅ Price updated successfully.");
        setProductId('');
        setNewPrice('');
        setSuggestedPrice(null);
        setAiExplanation('');
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
        <h2>Adjust Product Pricing</h2>

        <div className="form-group">
          <label>Product ID</label>
          <input
            className="form-input"
            placeholder="Enter product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="form-btn" onClick={fetchAndSuggestPrice} disabled={loadingAI}>
            {loadingAI ? "Analyzing..." : "💡 Get AI Suggested Price"}
          </button>

          {suggestedPrice && (
            <button
              className="form-btn"
              style={{ backgroundColor: "#38b000" }}
              onClick={() => handleAdjust(suggestedPrice)}
            >
              ✅ Accept ₹{suggestedPrice}
            </button>
          )}
        </div>

        {suggestedPrice && (
          <div className="ai-explanation" style={{ marginTop: "10px", backgroundColor: "#f2f2f2", padding: "10px", borderRadius: "8px" }}>
            <p><strong>AI Suggested Price:</strong> ₹{suggestedPrice}</p>
            <p><strong>Why?</strong> {aiExplanation}</p>
          </div>
        )}

        <div className="form-group" style={{ marginTop: "20px" }}>
          <label>Or Enter New Price (₹)</label>
          <input
            className="form-input"
            placeholder="Enter new price"
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
        </div>

        <button className="form-btn" onClick={() => handleAdjust(newPrice)}>
          Update Price
        </button>
      </div>
    </div>
  );
};

export default AdjustPricing;
