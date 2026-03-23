import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ROLES } from './constants';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import EFSPortal from './components/EFSPortal';
import IACPPortal from './components/IACPPortal';
import Walkthrough from './components/Walkthrough';
import PublicFilingWizard from './components/PublicFilingWizard';

function ProtectedRoute({ children, portal }: { children: React.ReactNode; portal: 'external' | 'internal' }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Basic RBAC: Internal users can't access EFS and vice versa
  const isInternal = ROLES.OALJ.includes(user.role) ||
                     ROLES.BOARDS.includes(user.role) ||
                     ROLES.IT_ADMIN.includes(user.role);

  if (portal === 'internal' && !isInternal) {
    return <Navigate to="/efs" replace />;
  }

  if (portal === 'external' && isInternal) {
    return <Navigate to="/internal" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/public-filing" element={<PublicFilingWizard />} />
          <Route path="/walkthrough" element={<Walkthrough />} />
          <Route
            path="/efs"
            element={
              <ProtectedRoute portal="external">
                <EFSPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internal"
            element={
              <ProtectedRoute portal="internal">
                <IACPPortal />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
