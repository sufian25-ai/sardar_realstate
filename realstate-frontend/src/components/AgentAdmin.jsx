import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Users,
  Building2,
  Settings,
  LogOut,
  ChevronDown,
  MapPin,
  Calendar,
  BookOpen,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AgentAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/agent/dashboard" },
    { name: "Users", icon: <Users size={18} />, path: "/agent/users" },
    { 
      name: "Location", 
      icon: <MapPin size={18} />, 
      isDropdown: true,
      submenu: [
        { name: "Add States", path: "/agent/states" },
        { name: "Add Cities", path: "/agent/cities" }
      ]
    },
    


    { name: "Add Properties", icon: <Building2 size={18} />, path: "/agent/properties" },
    { name: "My Property", icon: <Building2 size={18} />, path: "/agent/properties/list" },
    { name: "Inquiries", icon: <MessageSquare size={18} />, path: "/agent/inquiries" },
    { name: "Appointment", icon: <Calendar size={18} />, path: "/agent/appointment" },
    { name: "Bookings", icon: <BookOpen size={18} />, path: "/agent/bookings" },
    { name: "Report", icon: <FileText size={18} />, path: "/agent/report" },
    { name: "Settings", icon: <Settings size={18} />, path: "/admin/settings" },
  ];

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white/80 backdrop-blur-xl shadow-2xl transition-all duration-300 border-r border-gray-200/50 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200/50 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600">
          <img
            src="/assets/logo-white.png"
            alt="Agent Logo"
            className={`transition-all duration-300 ${
              isSidebarOpen ? "w-32" : "w-10 mx-auto"
            }`}
          />
          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-white md:hidden hover:bg-white/20 rounded-lg p-1 transition-all"
            >
              <X size={22} />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="mt-6 space-y-1 px-3">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.isDropdown ? (
                // Dropdown Menu Item
                <div>
                  <button
                    onClick={() => setIsLocationOpen(!isLocationOpen)}
                    className={`flex items-center justify-between w-full gap-4 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      item.submenu.some(sub => location.pathname === sub.path)
                        ? "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${item.submenu.some(sub => location.pathname === sub.path) ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'} transition-colors`}>
                        {item.icon}
                      </div>
                      {isSidebarOpen && <span>{item.name}</span>}
                    </div>
                    {isSidebarOpen && (
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {isLocationOpen && isSidebarOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                            location.pathname === subItem.path
                              ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                              : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                          <span>{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Regular Menu Item
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                  }`}
                >
                  <div className={`${location.pathname === item.path ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'} transition-colors`}>
                    {item.icon}
                  </div>
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Navbar */}
        <header className="fixed top-0 right-0 left-0 bg-white/80 backdrop-blur-xl shadow-lg h-16 flex items-center justify-between px-6 z-30 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-gray-700 hover:text-purple-600 transition-all duration-200 shadow-sm"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent hidden md:block">
              Agent Dashboard
            </h1>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 hover:from-purple-100 hover:via-pink-100 hover:to-rose-100 px-4 py-2 rounded-2xl border border-gray-200/50 transition-all duration-300 group shadow-sm hover:shadow-md"
            >
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-gray-700 font-semibold hidden sm:block">
                {user?.name || 'Agent'}
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-20">
                  {/* User Info Header */}
                  <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white text-lg font-bold border border-white/30">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <div>
                        <p className="font-bold text-white">{user?.name || 'Agent'}</p>
                        <p className="text-xs text-pink-100 capitalize font-medium">
                          {user?.role || 'Agent'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2 px-2">
                    <Link
                      to="/admin/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-200 group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Settings size={18} className="text-purple-600" />
                      </div>
                      <span className="font-medium">Settings</span>
                    </Link>
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
        </header>

        {/* Main Area */}
        <main className="flex-1 mt-16 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgentAdmin;