import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate
      to="/unauthorized"
      state={{ from: location }}
      replace
    />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
