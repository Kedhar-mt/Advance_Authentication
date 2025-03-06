// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import User from './components/User';
import Admin from './components/Admin';


const App = () => {
  return (
    <Router> 
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/user" element={<User />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>

    </Router>
  );
};

export default App;