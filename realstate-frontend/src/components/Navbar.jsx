import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'white',
      padding: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/assets/logo.png" 
            alt="Sardar Estate" 
            style={{ width: '150px', height: 'auto', border: '2px solid red' }}
          />
        </div>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Home</Link>
        <Link to="/properties" style={{ textDecoration: 'none', color: 'black' }}>Properties</Link>

        {user ? (
          <div style={{ position: 'relative' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Welcome, {user.name} ▼
            </button>
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              minWidth: '150px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {user.role === "user" && <Link to="/profile" style={{ padding: '0.5rem 1rem', textDecoration: 'none', color: 'black' }}>My Profile</Link>}
              {user.role === "agent" && (
                <>
                  <Link to="/profiledashboard" style={{ padding: '0.5rem 1rem', textDecoration: 'none', color: 'black' }}>Agent Profile</Link>
                  <Link to="/agent/dashboard" style={{ padding: '0.5rem 1rem', textDecoration: 'none', color: 'black' }}>Dashboard</Link>
                  <Link to="/applications" style={{ padding: '0.5rem 1rem', textDecoration: 'none', color: 'black' }}>User Applications</Link>
                </>
              )}
              {user.role === "admin" && <Link to="/admin/dashboard" style={{ padding: '0.5rem 1rem', textDecoration: 'none', color: 'black' }}>Admin Dashboard</Link>}
              <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Logout</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: 'blue' }}>Login</Link>
            <Link to="/register" style={{ 
              textDecoration: 'none', 
              background: 'blue', 
              color: 'white', 
              padding: '0.5rem 1rem',
              borderRadius: '4px'
            }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
