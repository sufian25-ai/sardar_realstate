import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, MapPin, Calendar, Filter, Download } from 'lucide-react';
import axios from 'axios';

const AgentUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://127.0.0.1:8000/api/get-user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Filter only users with 'user' role (not admin or agent)
      const regularUsers = response.data.data_user_list.data.filter(
        user => user.role === 'user'
      );
      
      setUsers(regularUsers);
      setFilteredUsers(regularUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      
      // Demo data for testing
      const demoUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+880 1712-345678',
          role: 'user',
          location: 'Dhaka, Bangladesh',
          created_at: '2024-01-15'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+880 1812-345678',
          role: 'user',
          location: 'Chittagong, Bangladesh',
          created_at: '2024-02-20'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+880 1912-345678',
          role: 'user',
          location: 'Sylhet, Bangladesh',
          created_at: '2024-03-10'
        }
      ];
      
      setUsers(demoUsers);
      setFilteredUsers(demoUsers);
    }
  };

  // Search functionality
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Location', 'Joined Date'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.phone || 'N/A',
        user.location || 'N/A',
        new Date(user.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-white">All Users</h1>
            </div>
            <p className="text-purple-100">Manage and view all registered users</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
            <p className="text-sm text-purple-100 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-white">{filteredUsers.length}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h3>
            <p className="text-gray-500">No users match your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail size={14} />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone size={16} className="text-purple-600" />
                        <span className="text-sm">{user.phone || 'Not provided'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin size={16} className="text-pink-600" />
                        <span className="text-sm">{user.location || 'Not provided'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-rose-600" />
                        <span className="text-sm">
                          {new Date(user.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <span className="text-3xl font-bold">{filteredUsers.length}</span>
          </div>
          <h3 className="font-semibold text-purple-100">Total Users</h3>
          <p className="text-sm text-purple-200 mt-1">Registered users</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <span className="text-3xl font-bold">
              {filteredUsers.filter(u => {
                const joinDate = new Date(u.created_at);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return joinDate > thirtyDaysAgo;
              }).length}
            </span>
          </div>
          <h3 className="font-semibold text-pink-100">New This Month</h3>
          <p className="text-sm text-pink-200 mt-1">Last 30 days</p>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Mail size={24} />
            </div>
            <span className="text-3xl font-bold">
              {filteredUsers.filter(u => u.email).length}
            </span>
          </div>
          <h3 className="font-semibold text-rose-100">Verified Emails</h3>
          <p className="text-sm text-rose-200 mt-1">With email address</p>
        </div>
      </div>
    </div>
  );
};

export default AgentUsers;