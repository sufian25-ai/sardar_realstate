import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';

// Admin Pages
import AdminPanel from './components/AdminPanel';
import DashboardContent from './pages/admin/DashboardContent';
import StateManagement from './pages/admin/StateManagement';
import CityManagement from './pages/admin/CityManagement';
import CreatePropertyWithUpload from './pages/admin/CreatePropertyWithUpload';
import PropertyList from './pages/admin/PropertyList';
import UserList from './pages/admin/UserList';
// import AgentList from './pages/admin/AgentList';
// import BookingManagement from './pages/admin/BookingManagement';
// import Reports from './pages/admin/Reports';
// import Amenities from './pages/admin/Amenities';
// import Settings from './pages/admin/Settings';

// Agent/User Pages
import AgentAdmin from './components/AgentAdmin';
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentUsers from './pages/agent/AgentUsers';
//User Pages
import UserProfile from './pages/user/UserProfile';


import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return !user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Admin Panel Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>}>
            <Route index element={<DashboardContent />} /> {/* default /admin */}
            <Route path="dashboard" element={<DashboardContent />} />
            <Route path="users" element={<UserList />} />
            {/* <Route path="agents" element={<AgentList />} /> */}
            <Route path="properties" element={<CreatePropertyWithUpload />} />
            <Route path="properties/list" element={<PropertyList />} />
            <Route path="states" element={<StateManagement />} />
            <Route path="cities" element={<CityManagement />} />
            {/* <Route path="bookings" element={<BookingManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="aminities" element={<Amenities />} />
            <Route path="settings" element={<Settings />} /> */}
          </Route>

          {/* Agent Panel */}
          <Route path="/agent" element={<ProtectedRoute><AgentAdmin /></ProtectedRoute>} >
           <Route index element={<AgentDashboard />} /> {/* default /admin */}
            <Route path="dashboard" element={<AgentDashboard />} />
            <Route path="users" element={<AgentUsers />} />
          
          

          </Route>


          {/* User Pages */}
          <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

          {/* Properties */}
          <Route path="/properties" element={<Properties />} />
          {/* <Route path="/properties/new" element={<ProtectedRoute><PropertyForm /></ProtectedRoute>} />
          <Route path="/properties/:id" element={<ProtectedRoute><PropertyForm /></ProtectedRoute>} /> */}
          <Route path="/properties/:id" element={<PropertyDetails />} />


          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
