import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Loader from './Loader';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, token, loading, getMe } = useAuthStore();

  useEffect(() => {
    // If we have a token but no user, fetch user info (session rehydration on refresh)
    if (token && !user && !loading) {
      getMe();
    }
  }, [token, user, loading, getMe]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Show a premium full page loader while fetching user details
  if (token && !user && loading) {
    return <Loader fullPage size="lg" />;
  }

  return children;
};

export default ProtectedRoute;
