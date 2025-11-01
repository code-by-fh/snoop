import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingPlaceholder from '../common/LoadingPlaceholder';
import { AppMeta } from '@/types/common';

interface AccountRouteProps {
  restricted?: boolean; // true: user is logged in, redirect to "/dashboard"
  redirectTo?: string;  // default: "/dashboard"
}

const AccountRout: React.FC<AccountRouteProps> = ({ restricted = true, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  if (isAuthenticated && restricted) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AccountRout;
