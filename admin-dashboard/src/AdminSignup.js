import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    if (!email) return alert('Enter Email');
    // For demo, just store in localStorage
    localStorage.setItem('userEmail', email);
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Admin Signup</h2>
        <input
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSignup}>Sign Up</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default AdminSignup;