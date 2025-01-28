// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUser({ token });
  }, []);

  const signin = async (email, password) => {
    const response = await api.post('http://localhost:5002/auth/signin', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    setUser({ token });
  };

  const signup = async (email, password) => {
    const response = await api.post('http://localhost:5002/auth/signup', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    setUser({ token });
  };

  const signout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
