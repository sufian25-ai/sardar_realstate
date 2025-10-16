import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Home, Building2, User, LayoutDashboard, Settings, LogOut, ChevronDown, Info, Phone } from "lucide-react";

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
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-gray-900 to-black backdrop-blur-xl shadow-2xl z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left Side - Logo & Navigation Links */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group no-underline">
              <div className="relative">
                <img
                  src="/assets/logo1.png"
                  alt="Sardar Estate"
                  className="w-10 h-50 rounded-lg shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white no-underline">Sardar Realstate</h1>
                {/* <p className="text-xs text-gray-400">Premium Properties</p> */}
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                to="/" 
                className="relative text-gray-300 hover:text-white font-semibold transition-all duration-300 group px-4 py-2 no-underline"
              >
                <span className="flex items-center gap-2">
                  <Home size={18} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                  Home
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <Link 
                to="/properties" 
                className="relative text-gray-300 hover:text-white font-semibold transition-all duration-300 group px-4 py-2 no-underline"
              >
                <span className="flex items-center gap-2">
                  <Building2 size={18} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
                  Properties
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <Link 
                to="/about" 
                className="relative text-gray-300 hover:text-white font-semibold transition-all duration-300 group px-4 py-2 no-underline"
              >
                <span className="flex items-center gap-2">
                  <Info size={18} className="text-gray-400 group-hover:text-pink-400 transition-colors" />
                  About
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <Link 
                to="/contact" 
                className="relative text-gray-300 hover:text-white font-semibold transition-all duration-300 group px-4 py-2 no-underline"
              >
                <span className="flex items-center gap-2">
                  <Phone size={18} className="text-gray-400 group-hover:text-green-400 transition-colors" />
                  Contact
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Right Side - Auth Links / User Menu */}
          <div className="flex items-center space-x-3">
            {user ? (
              /* User Logged In - Dropdown Menu */
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/20 transition-all duration-300 group shadow-lg hover:shadow-xl no-underline"
                >
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                  </div>
                  <span className="text-white font-semibold hidden sm:block">
                    {user.name}
                  </span>
                  <ChevronDown 
                    size={16}
                    className={`text-gray-300 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-3 w-72 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-20">
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
                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl transition-all duration-200 group no-underline"
                          >
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <User size={18} className="text-blue-400" />
                            </div>
                            <span className="font-medium text-white">My Profile</span>
                          </Link>
                        )}

                        {user.role === "agent" && (
                          <Link 
                            to="/agent" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl transition-all duration-200 group no-underline"
                          >
                            <div className="w-9 h-9 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <LayoutDashboard size={18} className="text-purple-400" />
                            </div>
                            <span className="font-medium text-white">Dashboard</span>
                          </Link>
                        )}

                        {user.role === "admin" && (
                          <Link 
                            to="/admin" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl transition-all duration-200 group no-underline"
                          >
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Settings size={18} className="text-indigo-400" />
                            </div>
                            <span className="font-medium text-white">Admin Dashboard</span>
                          </Link>
                        )}
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-white/10 p-2">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group no-underline"
                        >
                          <div className="w-9 h-9 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 group-hover:scale-110 transition-all">
                            <LogOut size={18} className="text-red-400" />
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
                  className="text-gray-300 hover:text-white font-semibold transition-all duration-300 px-5 py-2.5 rounded-xl hover:bg-white/10 no-underline"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group no-underline"
                >
                  <span className="relative z-10">Register</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
            >
              {isMobileMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 pt-4 animate-fade-in">
            <div className="space-y-1">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all no-underline"
              >
                <Home size={18} className="text-gray-400" />
                <span className="font-medium">Home</span>
              </Link>
              <Link 
                to="/properties" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all no-underline"
              >
                <Building2 size={18} className="text-gray-400" />
                <span className="font-medium">Properties</span>
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all no-underline"
              >
                <Info size={18} className="text-gray-400" />
                <span className="font-medium">About</span>
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all no-underline"
              >
                <Phone size={18} className="text-gray-400" />
                <span className="font-medium">Contact</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .no-underline {
          text-decoration: none !important;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;