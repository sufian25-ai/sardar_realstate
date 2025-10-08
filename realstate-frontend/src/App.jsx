import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyForm from './pages/PropertyForm';
import AdminPanel from './components/AdminPanel';
import AgentDashboard from './pages/agent/AgentDashboard';
import UserProfile from './pages/user/UserProfile';
import StateManagement from './pages/admin/StateManagement';
import CityManagement from './pages/admin/CityManagement';
import CreatePropertyWithUpload from './pages/admin/CreatePropertyWithUpload';
import PropertyList from './pages/admin/PropertyList';
import UserList from './pages/admin/UserList';
import DashboardContent from './pages/admin/DashboardContent';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return !user ? children : <Navigate to="/Home" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes - Anyone can access */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            
            {/* Protected Routes - Only logged in users can access */}
             {/* Admin Panel */}
             <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/admin/states" element={
              <ProtectedRoute>
                <StateManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/cities" element={
              <ProtectedRoute>
                <CityManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/properties" element={
              <ProtectedRoute>
                <CreatePropertyWithUpload />
              </ProtectedRoute>
            } />
            <Route path="/admin/properties/list" element={
              <ProtectedRoute>
                <PropertyList />
              </ProtectedRoute>
            } />

            <Route path="/admin/users" element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <DashboardContent />
              </ProtectedRoute>
            } />
          
 {/* Agent Panel*/}
            <Route path="/agent/dashboard" element={
              <ProtectedRoute>
                <AgentDashboard />
              </ProtectedRoute>
            } />

            <Route path="/user/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />


            <Route path="/properties" element={
              <ProtectedRoute>
                <Properties />
              </ProtectedRoute>
            } />
            <Route path="/properties/new" element={
              <ProtectedRoute>
                <PropertyForm />
              </ProtectedRoute>
            } />
            <Route path="/properties/:id" element={
              <ProtectedRoute>
                <PropertyForm />
              </ProtectedRoute>
            } />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;