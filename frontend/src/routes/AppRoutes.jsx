import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import OceanMapPage from '../pages/OceanMapPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import AlertsPage from '../pages/AlertsPage';
import ProfilePage from '../pages/ProfilePage';
import AdminPanelPage from '../pages/AdminPanelPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Layout Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/map" element={<OceanMapPage />} />
          <Route path="/predictions" element={<Navigate to="/dashboard" replace />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Admin Protected Route */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/admin" element={<AdminPanelPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
