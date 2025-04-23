import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('testRunnerUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('testRunnerUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // In a real application, you'd call an API endpoint
      // For this demo, we'll simulate authentication
      const credentials = btoa(`${username}:${password}`);
      
      // Test the credentials by making an authenticated request
      await axios.get('/api/tests', {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });
      
      // If the request was successful, store the user
      const userData = { username, credentials };
      localStorage.setItem('testRunnerUser', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('testRunnerUser');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 