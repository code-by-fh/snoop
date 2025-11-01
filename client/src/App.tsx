import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import { AppMetaProvider, useAppMeta } from './context/AppMetaContext';
import Layout from './components/Layout';

import DashboardPage from './pages/DashboardPage';
import EditJobPage from './pages/JobPageEdit';
import NewJobPage from './pages/JobPageNew';
import JobsPage from './pages/JobsPage';
import JobStatisticsPage from './pages/JobStatisticsPage';
import ListingsPage from './pages/ListingsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';

import 'mapbox-gl/dist/mapbox-gl.css';
import ActivateAccountPage from './pages/ActivateAccountPage';
import PasswordForgottenPage from './pages/PasswordForgottenPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { ScrollToHash } from './hooks/scrollTo';
import AccountPage from './pages/AccountPage';
import AccountRoute from './components/auth/AccountRoute';
import ResetPasswordRoute from './components/auth/ResetPasswordRoute';

const App: React.FC = () => {

  return (
    <AuthProvider>
      <AppMetaProvider>
        <Router>
          <ScrollToHash />

          <Routes>
            {/* Public Routes */}
            <Route element={<AccountRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<PasswordForgottenPage />} />
              <Route path="/activate-account" element={<ActivateAccountPage />} />
              <Route element={<ResetPasswordRoute />}>
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<DashboardPage />} />

                {/* Job-related Routes */}
                <Route path="jobs" element={<JobsPage />} />
                <Route path="jobs/new" element={<NewJobPage />} />
                <Route path="jobs/:id" element={<EditJobPage />} />
                <Route path="jobs/:id/statistics" element={<JobStatisticsPage />} />
                <Route path="account" element={<AccountPage />} />

                {/* Admin Routes (with role-based access) */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="users" element={<UsersPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                </Route>

                {/* Other Protected Routes */}
                <Route path="listings" element={<ListingsPage />} />
              </Route>
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppMetaProvider>
    </AuthProvider>
  );
};

export default App;
