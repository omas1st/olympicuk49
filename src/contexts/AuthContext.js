// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [status, setStatus] = useState(localStorage.getItem('status') || 'step1');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const s = decoded?.status || 'step1';
        setStatus(s);
        localStorage.setItem('status', s);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }
  }, [token]);

  const loginUser = (t, s) => {
    localStorage.setItem('token', t);
    localStorage.setItem('status', s);
    setToken(t);
    setStatus(s);
  };

  const loginAdmin = (t) => {
    localStorage.setItem('adminToken', t);
    setAdminToken(t);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setAdminToken(null);
    setStatus('step1');
  };

  return (
    <AuthContext.Provider value={{
      token,
      status,
      adminToken,
      loginUser,
      loginAdmin,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}
