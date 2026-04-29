import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth state on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('ehs_token');
    const savedUser = localStorage.getItem('ehs_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        clearAuth();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('ehs_user', JSON.stringify(userData));
    localStorage.setItem('ehs_token', authToken);

    // Set auth header for future requests
    if (window.axios) {
      window.axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }
  };

  const logout = () => {
    clearAuth();
    // Clear all cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ehs_user');
    localStorage.removeItem('ehs_token');
    if (window.axios) {
      delete window.axios.defaults.headers.common['Authorization'];
    }
  };

  const isAdmin = user?.role === 'admin';
  const isLoggedIn = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAdmin,
        isLoggedIn,
        API_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
