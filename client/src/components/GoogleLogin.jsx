import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRedirectResult, signInWithRedirect, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebase';

const GoogleLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleRedirectResult = async () => {
      console.log('Checking for redirect result...');
      setLoading(true);
      try {
        const result = await getRedirectResult(auth);
        console.log('Redirect result:', result);

        if (result) {
          const user = result.user;
          console.log('User signed in:', user);

          // Save user data to the database
          await saveUserToDatabase(user);
          
          // Store user info in localStorage
          localStorage.setItem('userId', user.uid);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userRole', 'user'); // Default role for Google users
          
          console.log('User saved successfully. Redirecting to /user...');
          navigate('/user');
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    handleRedirectResult();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Using popup instead of redirect to avoid the init.json issue
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User signed in with popup:', result.user);
      
      // Save user data to the database
      await saveUserToDatabase(result.user);
      
      // Store user info in localStorage
      localStorage.setItem('userId', result.user.uid);
      localStorage.setItem('userEmail', result.user.email);
      localStorage.setItem('userRole', 'user'); // Default role for Google users
      
      navigate('/user');
    } catch (error) {
      console.error('Error during sign in:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveUserToDatabase = async (user) => {
    console.log('Saving user to database:', user);
    try {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      
      const response = await fetch('http://localhost:5000/api/googleusers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save user');
      }

      const data = await response.json();
      console.log('User saved to database:', data);
      return data;
    } catch (error) {
      console.error('Error saving user to database:', error);
      throw error;
    }
  };

  return (
    <div className="login-container">
      <button 
        onClick={handleGoogleSignIn} 
        className="google-sign-in-btn"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default GoogleLogin;