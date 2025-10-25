import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import UnauthorizedPage from './pages/UnauthorizedPage';

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
import { ScrollToHash } from './hooks/scrollTo';
import AccountPage from './pages/AccountPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToHash />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

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
    </AuthProvider>
  );
};

export default App;
