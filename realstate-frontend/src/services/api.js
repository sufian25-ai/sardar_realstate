import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // 👈 তোমার Laravel backend URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 🔹 Automatically attach Bearer Token (if exists)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Handle global API errors (optional but professional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle unauthorized / expired token
      if (error.response.status === 401) {
        console.warn('Unauthorized: Token may be expired.');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Handle server errors gracefully
      if (error.response.status >= 500) {
        console.error('Server error:', error.response.data.message || 'Something went wrong.');
      }
    } else {
      console.error('Network error: Could not connect to API.');
    }

    return Promise.reject(error);
  }
);

export default api;
