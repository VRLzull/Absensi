import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Feedback from './pages/Feedback';
import FaceRegistration from './pages/FaceRegistration';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Main App Component
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute roles={['super_admin', 'admin']}>
              <Layout>
                <Employees />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute roles={['super_admin', 'admin', 'student']}>
              <Layout>
                <Attendance />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute roles={['super_admin', 'admin', 'student']}>
              <Layout>
                <Feedback />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/face-registration"
          element={
            <ProtectedRoute roles={['super_admin', 'admin']}>
              <Layout>
                <FaceRegistration />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={['super_admin', 'admin']}>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={['super_admin', 'admin']}>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

// Root App Component
const App = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
