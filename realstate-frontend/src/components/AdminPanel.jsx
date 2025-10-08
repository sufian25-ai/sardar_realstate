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
} from "lucide-react";

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/admin/dashboard" },
    { name: "Users", icon: <Users size={18} />, path: "/admin/users" },
     { name: "Agents", icon: <Users size={18} />, path: "/admin/agents" },
    { name: "Properties", icon: <Building2 size={18} />, path: "/admin/properties" },
    { name: "Property List", icon: <Building2 size={18} />, path: "/admin/properties/list" },
     { name: "States", icon: <Users size={18} />, path: "/admin/states" },
      { name: "Cities", icon: <Users size={18} />, path: "/admin/cities" },
       { name: "Bookings", icon: <Users size={18} />, path: "/admin/bookings" },
        { name: "Reports", icon: <Users size={18} />, path: "/admin/reports" },
         { name: "Aminities", icon: <Users size={18} />, path: "/admin/aminities" },
    { name: "Settings", icon: <Settings size={18} />, path: "/admin/settings" },
    
  ];

  const handleLogout = () => {
    // Add your logout logic here
    alert("Logged out successfully!");
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-blue-600">
          <img
            src="/assets/logo-white.png"
            alt="Admin Logo"
            className={`transition-all duration-300 ${
              isSidebarOpen ? "w-32" : "w-10 mx-auto"
            }`}
          />
          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-white md:hidden"
            >
              <X size={22} />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="mt-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-3 text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-800 hover:text-gray-100"
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 w-full">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3 w-full text-left text-sm hover:bg-red-600 transition-all duration-200"
          >
            <LogOut size={18} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Navbar */}
        <header className="fixed top-0 right-0 left-0 bg-white shadow-md h-16 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-700 hover:text-blue-600 transition-all duration-200"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 hidden md:block">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-gray-700 font-medium hidden sm:block">
              Admin
            </span>
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

export default AdminPanel;
