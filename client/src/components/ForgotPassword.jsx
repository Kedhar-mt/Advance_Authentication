import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CryptoJS from 'crypto-js';

const SECRET_KEY = "Kedhareswarmatha"; // Use the same key as in other components

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
  };

  const sendResetOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      setMessage(response.data.msg);
      setShowOtpInput(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const encryptedPassword = encryptPassword(newPassword);
      
      const response = await api.post('/api/auth/reset-password', {
        email,
        otp,
        newPassword: encryptedPassword
      });

      setMessage(response.data.msg);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to reset password');
      if (err.response?.data?.msg?.includes('expired')) {
        setShowOtpInput(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {!showOtpInput ? (
        <form onSubmit={sendResetOTP}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>}
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={resetPassword}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>}
          <div>
            <label>Enter 6-digit Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
            />
          </div>
          <div>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
      <div>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;