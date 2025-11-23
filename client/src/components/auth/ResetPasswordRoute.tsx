import React from 'react';
import { Navigate, Outlet, useSearchParams } from 'react-router-dom';

const ResetPasswordRoute: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ResetPasswordRoute;
