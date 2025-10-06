// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (user?.role === 'user') {
        navigate('/Home');
      } else if (user?.role === 'agent') {
        navigate('/agent-admin');
      } else if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      {/* <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">
            <i className="bi bi-house-heart me-2"></i>
            Elite Estates
          </a>
        </div>
      </nav> */}
      <Navbar />

      {/* Main Container */}

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Login Card */}
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
              {/* Card Header */}
              <div className="card-header bg-primary text-white py-4">
                <div className="text-center">
                  <i className="bi bi-person-check-fill display-4 d-block mb-3"></i>
                  <h2 className="h1 fw-bold mb-2">Welcome Back</h2>
                  <p className="mb-0 opacity-75">Sign in to your Elite Estates account</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div 
                    className="alert alert-danger alert-dismissible fade show d-flex align-items-center" 
                    role="alert"
                  >
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{error}</div>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError('')}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold">
                      <i className="bi bi-envelope me-2"></i>
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <i className="bi bi-lock me-2"></i>
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-key text-muted"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                      </button>
                    </div>
                    <div className="d-flex justify-content-end mt-2">
                      <a href="/forgot-password" className="text-decoration-none small text-muted">
                        <i className="bi bi-question-circle me-1"></i>
                        Forgot Password?
                      </a>
                    </div>
                  </div>

                  {/* Remember Me & Submit Button */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label className="form-check-label text-muted" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 py-3 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="text-center my-4">
                  <span className="bg-light px-3 text-muted">or continue with</span>
                </div>

                {/* Social Login */}
                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <button className="btn btn-outline-dark w-100">
                      <i className="bi bi-google me-2"></i>
                      Google
                    </button>
                  </div>
                  <div className="col-6">
                    <button className="btn btn-outline-primary w-100">
                      <i className="bi bi-facebook me-2"></i>
                      Facebook
                    </button>
                  </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <a href="/register" className="text-decoration-none fw-semibold">
                      Create one here
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="row mt-4 text-center">
              <div className="col-md-4 mb-3">
                <div className="d-flex align-items-center justify-content-center">
                  <i className="bi bi-shield-check text-success fs-4 me-2"></i>
                  <span className="small">Secure Login</span>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="d-flex align-items-center justify-content-center">
                  <i className="bi bi-lightning-charge text-warning fs-4 me-2"></i>
                  <span className="small">Instant Access</span>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="d-flex align-items-center justify-content-center">
                  <i className="bi bi-graph-up-arrow text-primary fs-4 me-2"></i>
                  <span className="small">Track Properties</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Icons CSS */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
      />

      {/* Custom Styles */}
      <style jsx>{`
        .cursor-pointer { cursor: pointer; }
        .card:hover { transform: translateY(-2px); transition: transform 0.3s ease; }
        .btn { transition: all 0.3s ease; }
        .input-group-text { border-right: none; }
        .form-control { border-left: none; }
        .form-control:focus { box-shadow: none; border-color: #dee2e6; }
        .alert { border: none; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Login;