import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('blog_auth_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        console.error('Session expired or invalid token:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (emailOrUsername, password) => {
    const response = await api.post('/auth/login', { emailOrUsername, password });
    const { token: receivedToken, user: receivedUser } = response.data;
    localStorage.setItem('blog_auth_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    const { token: receivedToken, user: receivedUser } = response.data;
    localStorage.setItem('blog_auth_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('blog_auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
