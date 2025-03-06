import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the access token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request sent with Authorization header:', config.headers);
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 493) {  // Token expired
      console.log('Access token expired, attempting to refresh token...');
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // Make a request to get a new access token
          const refreshResponse = await axios.post('http://localhost:5000/api/auth/refresh-token', {
            refreshToken,
          });

          console.log('New access token received:', refreshResponse.data.accessToken);

          // Store the new access token in localStorage
          localStorage.setItem('accessToken', refreshResponse.data.accessToken);

          // Retry the original request with the new access token
          originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          // If refreshing fails, clear tokens and redirect to login
          // localStorage.removeItem('accessToken');
          // localStorage.removeItem('refreshToken');
          // window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // If no refresh token, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const handleLogout = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        // Call the backend to delete the token document
        await api.post('/api/auth/logout', { userId });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and redirect, even if the API call fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
  };

export default api;
