import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Home, Building2, User, LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl shadow-lg z-50 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left Side - Logo & Navigation Links */}
          <div className="flex items-center space-x-12">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <img
                  src="/assets/logo1.png"
                  alt="Sardar Estate"
                  className="w-15 h-50 rounded-lg shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                /><span className="sr-only">Sardar Estate</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-blue-600/10 rounded-lg transition-all duration-300"></div>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="relative text-gray-700 hover:text-transparent bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 font-semibold transition-all duration-300 group py-2"
              >
                <span className="flex items-center gap-2">
                  <Home size={18} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
                  Home
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/properties" 
                className="relative text-gray-700 hover:text-transparent bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 font-semibold transition-all duration-300 group py-2"
              >
                <span className="flex items-center gap-2">
                  <Building2 size={18} className="text-gray-500 group-hover:text-purple-600 transition-colors" />
                  Properties
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Right Side - Auth Links / User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              /* User Logged In - Dropdown Menu */
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 hover:from-blue-100 hover:via-purple-100 hover:to-indigo-100 px-5 py-2.5 rounded-2xl border border-gray-200/50 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-gray-700 font-semibold hidden sm:block">
                    {user.name}
                  </span>
                  <ChevronDown 
                    size={16}
                    className={`text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-20">
                      {/* User Info Header */}
                      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white text-lg font-bold border border-white/30">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white">{user.name}</p>
                            <p className="text-xs text-blue-100 capitalize font-medium">{user.role}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2 px-2">
                        {user.role === "user" && (
                          <Link 
                            to="/user/profile" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-200 group"
                          >
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <User size={18} className="text-blue-600" />
                            </div>
                            <span className="font-medium">My Profile</span>
                          </Link>
                        )}

                        {user.role === "agent" && (
                          <>
                            <Link 
                              to="/profiledashboard" 
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-200 group"
                            >
                              <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <User size={18} className="text-blue-600" />
                              </div>
                              <span className="font-medium">Agent Profile</span>
                            </Link>
                            <Link 
                              to="/agent/dashboard" 
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 rounded-xl transition-all duration-200 group"
                            >
                              <div className="w-9 h-9 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <LayoutDashboard size={18} className="text-purple-600" />
                              </div>
                              <span className="font-medium">Dashboard</span>
                            </Link>
                          </>
                        )}

                        {user.role === "admin" && (
                          <Link 
                            to="/admin" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-200 group"
                          >
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Settings size={18} className="text-indigo-600" />
                            </div>
                            <span className="font-medium">Admin Dashboard</span>
                          </Link>
                        )}
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-gray-200/50 p-2">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 group-hover:scale-110 transition-all">
                            <LogOut size={18} className="text-red-600" />
                          </div>
                          <span className="font-semibold">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* User Not Logged In - Auth Buttons */
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 px-5 py-2.5 rounded-xl hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
                >
                  <span className="relative z-10">Register</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="space-y-2">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all"
              >
                <Home size={18} />
                <span className="font-medium">Home</span>
              </Link>
              <Link 
                to="/properties" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all"
              >
                <Building2 size={18} />
                <span className="font-medium">Properties</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;