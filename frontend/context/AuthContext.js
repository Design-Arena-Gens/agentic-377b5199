"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import jwt from 'jsonwebtoken';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (storedToken && storedUser) {
      const isExpired = (() => {
        try {
          const decoded = jwt.decode(storedToken);
          if (!decoded?.exp) return false;
          return decoded.exp * 1000 < Date.now();
        } catch (error) {
          return true;
        }
      })();

      if (!isExpired) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = (loginToken, loginUser) => {
    setToken(loginToken);
    setUser(loginUser);
    localStorage.setItem('token', loginToken);
    localStorage.setItem('user', JSON.stringify(loginUser));
    toast.success('Logged in successfully');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out');
  };

  const value = useMemo(() => ({ token, user, login, logout, loading }), [token, user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
};
