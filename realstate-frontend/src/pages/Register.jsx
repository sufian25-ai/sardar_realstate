// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield, TrendingUp, Headphones, Search, Building } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
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
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Registration failed. Please try again.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (role) => {
    setFormData({ ...formData, role });
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/40 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/40 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Register Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            {/* Header with Logo */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-8 py-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="mb-6 flex justify-center">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center p-4">
                    <img 
                      src="/assets/logo1.png" 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <h2 className="text-4xl font-black text-white mb-2">Join Us Today!</h2>
                <p className="text-purple-100 text-lg">Create your account and get started</p>
              </div>
            </div>

            {/* Form Body */}
            <div className="px-8 py-8">
              {message && (
                <div className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'} border-l-4 rounded-xl p-4 flex items-start gap-3`}>
                  <div className="flex-shrink-0">
                    <div className={`w-6 h-6 ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-sm font-bold">{message.type === 'success' ? '✓' : '!'}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className={`${message.type === 'success' ? 'text-green-800' : 'text-red-800'} font-medium`}>{message.text}</p>
                  </div>
                  <button 
                    onClick={() => setMessage(null)}
                    className={`${message.type === 'success' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'} transition-colors`}
                  >
                    ×
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder-gray-400"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all duration-300 text-gray-900 placeholder-gray-400"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">i</span>
                    Use 8+ characters with mix of letters, numbers & symbols
                  </p>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    I want to...
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => selectRole("user")}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                        formData.role === "user"
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                        formData.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600"
                          : "bg-gray-100"
                      }`}>
                        <Search className={`w-6 h-6 ${formData.role === "user" ? "text-white" : "text-gray-500"}`} />
                      </div>
                      <h6 className={`font-bold mb-1 ${formData.role === "user" ? "text-blue-700" : "text-gray-700"}`}>
                        Find Properties
                      </h6>
                      <p className="text-xs text-gray-600">Buy/Rent Homes</p>
                      {formData.role === "user" && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => selectRole("agent")}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                        formData.role === "agent"
                          ? "border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-lg"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                        formData.role === "agent"
                          ? "bg-gradient-to-br from-green-500 to-green-600"
                          : "bg-gray-100"
                      }`}>
                        <Building className={`w-6 h-6 ${formData.role === "agent" ? "text-white" : "text-gray-500"}`} />
                      </div>
                      <h6 className={`font-bold mb-1 ${formData.role === "agent" ? "text-green-700" : "text-gray-700"}`}>
                        List Properties
                      </h6>
                      <p className="text-xs text-gray-600">Real Estate Agent</p>
                      {formData.role === "agent" && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-semibold text-gray-700">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 font-semibold text-gray-700">
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-700">Secure & Trusted</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-700">Best Properties</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-700">24/7 Support</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;