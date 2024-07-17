// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // This function could be used in login component to handle authentication
  const login = () => {
    setIsAuthenticated(true);
    // Example: store token in localStorage
    // localStorage.setItem('token', 'your_token_here');
  };

  // This function could be used in logout component to handle logout
  const logout = () => {
    setIsAuthenticated(false);
    // Example: clear token from localStorage
    // localStorage.removeItem('token');
  };

  // Value object to be provided by AuthContext.Provider
  const authContextValue = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
