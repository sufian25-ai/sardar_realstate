// src/pages/Register.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.post("/register", formData);
      setMessage({
        type: "success",
        text: response.data.message || "🎉 Registration successful! Welcome to Elite Estates!",
      });
      setFormData({ name: "", email: "", password: "", role: "user" });
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Registration failed. Please try again.";
      setMessage({ type: "danger", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (role) => {
    setFormData({ ...formData, role });
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Use the separate Navbar component */}
      <Navbar />

      <div className="container py-5" style={{ marginTop: '76px' }}>
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Registration Card */}
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
              {/* Card Header */}
              <div className="card-header bg-primary text-white py-4">
                <div className="text-center">
                  <i className="bi bi-person-plus-fill display-4 d-block mb-3"></i>
                  <h2 className="h1 fw-bold mb-2">Create Your Account</h2>
                  <p className="mb-0 opacity-75">Join thousands of property seekers and agents</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body p-4 p-md-5">
                {message && (
                  <div 
                    className={`alert alert-${message.type} alert-dismissible fade show d-flex align-items-center`} 
                    role="alert"
                  >
                    <i className={`bi bi-${message.type === 'success' ? 'check-circle' : 'exclamation-triangle'}-fill me-2`}></i>
                    <div>{message.text}</div>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setMessage(null)}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label fw-semibold">
                      <i className="bi bi-person me-2"></i>
                      Full Name
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

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
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
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
                        name="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
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
                    <div className="form-text">
                      <i className="bi bi-info-circle me-1"></i>
                      Use 8+ characters with mix of letters, numbers & symbols
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-briefcase me-2"></i>
                      I want to...
                    </label>
                    <div className="row g-3">
                      <div className="col-6">
                        <div
                          className={`card h-100 cursor-pointer border-2 ${
                            formData.role === "user" 
                              ? "border-primary bg-primary text-white" 
                              : "border-light"
                          }`}
                          onClick={() => selectRole("user")}
                          style={{ cursor: "pointer", transition: "all 0.3s" }}
                        >
                          <div className="card-body text-center p-3">
                            <i className="bi bi-search-heart display-6 d-block mb-2"></i>
                            <h6 className="card-title mb-1">Find Properties</h6>
                            <small className="opacity-75">Buy/Rent Homes</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div
                          className={`card h-100 cursor-pointer border-2 ${
                            formData.role === "agent" 
                              ? "border-success bg-success text-white" 
                              : "border-light"
                          }`}
                          onClick={() => selectRole("agent")}
                          style={{ cursor: "pointer", transition: "all 0.3s" }}
                        >
                          <div className="card-body text-center p-3">
                            <i className="bi bi-house-gear display-6 d-block mb-2"></i>
                            <h6 className="card-title mb-1">List Properties</h6>
                            <small className="opacity-75">Real Estate Agent</small>
                          </div>
                        </div>
                      </div>
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="text-center my-4">
                  <span className="bg-light px-3 text-muted">or</span>
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

                {/* Login Link */}
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="text-decoration-none fw-semibold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="row mt-4 text-center">
              <div className="col-md-4 mb-3">
                <div className="d-flex align-items-center justify-content-center">
                  <i className="bi bi-shield-check text-success fs-4 me-2"></i>
                  <span className="small">Secure & Trusted</span>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="d-flex align-items-center justify-content-center">
                  <i className="bi bi-graph-up-arrow text-primary fs-4 me-2"></i>
                  <span className="small">Best Properties</span>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="d-flex align-items-center justify-content-center">
                  <i className="bi bi-headset text-info fs-4 me-2"></i>
                  <span className="small">24/7 Support</span>
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
        .card:hover { transform: translateY(-2px); }
        .btn { transition: all 0.3s ease; }
        .input-group-text { border-right: none; }
        .form-control { border-left: none; }
        .form-control:focus { box-shadow: none; border-color: #dee2e6; }
      `}</style>
    </div>
  );
};

export default Register;