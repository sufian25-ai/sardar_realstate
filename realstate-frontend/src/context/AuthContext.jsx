import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/me')
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login user
  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    const { token, user_info } = response.data;

    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user_info);
    }

    return user_info;
  };

  // Register user
  const register = async (name, email, password, role = 'user') => {
    const response = await api.post('/register', { name, email, password, role });
    return response.data;
  };

  // Update user
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Refresh user data
  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/me');
        setUser(response.data.user);
        return response.data.user;
      } catch (error) {
        console.error('Failed to refresh user:', error);
        localStorage.removeItem('token');
        setUser(null);
        return null;
      }
    }
    return null;
  };

  // Logout user
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, refreshUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
