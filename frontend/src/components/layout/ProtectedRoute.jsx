import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ requireAdmin = false }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect unauthenticated users to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    // Redirect non-admin users trying to access admin routes to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // User is authorized
  return <Outlet />;
}
