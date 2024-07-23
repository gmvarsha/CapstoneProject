import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './Auth';

const ProtectedRoute = ({ element ,requiredRole}) => {
  const userRole = localStorage.getItem('userRole');

  if (userRole === requiredRole ) {
    return element;
  } else {
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
    // Redirect to login page or handle 
    return <Navigate to="/user/login" />;
  }

};

export default ProtectedRoute;
