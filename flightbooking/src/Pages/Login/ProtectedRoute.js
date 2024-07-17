import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './Auth';

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/user/login" />;
};

export default ProtectedRoute;
