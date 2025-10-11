import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, MapPin, Calendar, Download, Shield, UserCog, User as UserIcon, Edit, Trash2, Eye } from 'lucide-react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

      // Admin can see ALL users (admin, agent, user)
      const allUsers = response.data.data_user_list.data;
      
      setUsers(allUsers);
      setFilteredUsers(allUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      
      // Demo data with all roles for testing
      const demoUsers = [
        {
          id: 1,
          name: 'Super Admin',
          email: 'admin@example.com',
          phone: '+880 1712-345678',
          role: 'admin',
          location: 'Dhaka, Bangladesh',
          created_at: '2023-01-15',
          status: 'active'
        },
        {
          id: 2,
          name: 'John Agent',
          email: 'agent1@example.com',
          phone: '+880 1812-345678',
          role: 'agent',
          location: 'Chittagong, Bangladesh',
          created_at: '2023-06-20',
          status: 'active'
        },
        {
          id: 3,
          name: 'Sarah Agent',
          email: 'agent2@example.com',
          phone: '+880 1912-345678',
          role: 'agent',
          location: 'Sylhet, Bangladesh',
          created_at: '2024-01-10',
          status: 'active'
        },
        {
          id: 4,
          name: 'Mike User',
          email: 'user1@example.com',
          phone: '+880 1612-345678',
          role: 'user',
          location: 'Dhaka, Bangladesh',
          created_at: '2024-02-15',
          status: 'active'
        },
        {
          id: 5,
          name: 'Jane User',
          email: 'user2@example.com',
          phone: '+880 1512-345678',
          role: 'user',
          location: 'Rajshahi, Bangladesh',
          created_at: '2024-03-20',
          status: 'active'
        },
        {
          id: 6,
          name: 'Bob User',
          email: 'user3@example.com',
          phone: '+880 1412-345678',
          role: 'user',
          location: 'Khulna, Bangladesh',
          created_at: '2024-04-05',
          status: 'inactive'
        }
      ];
      
      setUsers(demoUsers);
      setFilteredUsers(demoUsers);
    }
  };

  // Search and Filter functionality
  useEffect(() => {
    let filtered = users;

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, filterRole, users]);

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Role', 'Location', 'Status', 'Joined Date'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.phone || 'N/A',
        user.role,
        user.location || 'N/A',
        user.status || 'active',
        new Date(user.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Get role badge color
  const getRoleBadge = (role) => {
    const badges = {
      admin: { bg: 'bg-red-100', text: 'text-red-700', icon: <Shield size={12} /> },
      agent: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <UserCog size={12} /> },
      user: { bg: 'bg-green-100', text: 'text-green-700', icon: <UserIcon size={12} /> }
    };
    return badges[role] || badges.user;
  };

  // Get role counts
  const roleStats = {
    admin: users.filter(u => u.role === 'admin').length,
    agent: users.filter(u => u.role === 'agent').length,
    user: users.filter(u => u.role === 'user').length,
    total: users.length
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-white">All Users Management</h1>
            </div>
            <p className="text-blue-100">Manage all users, agents and administrators</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
            <p className="text-sm text-blue-100 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-white">{roleStats.total}</p>
          </div>
        </div>
      </div>

      {/* Role Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer"
             onClick={() => setFilterRole('all')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center text-white">
              <Users size={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">{roleStats.total}</span>
          </div>
          <h3 className="font-semibold text-gray-700">All Users</h3>
          <p className="text-sm text-gray-500 mt-1">Total registered</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-red-500 transition-all cursor-pointer"
             onClick={() => setFilterRole('admin')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white">
              <Shield size={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">{roleStats.admin}</span>
          </div>
          <h3 className="font-semibold text-gray-700">Administrators</h3>
          <p className="text-sm text-gray-500 mt-1">Admin role</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer"
             onClick={() => setFilterRole('agent')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              <UserCog size={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">{roleStats.agent}</span>
          </div>
          <h3 className="font-semibold text-gray-700">Agents</h3>
          <p className="text-sm text-gray-500 mt-1">Agent role</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-green-500 transition-all cursor-pointer"
             onClick={() => setFilterRole('user')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white">
              <UserIcon size={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">{roleStats.user}</span>
          </div>
          <h3 className="font-semibold text-gray-700">Regular Users</h3>
          <p className="text-sm text-gray-500 mt-1">User role</p>
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
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Role Filter Dropdown */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin Only</option>
            <option value="agent">Agent Only</option>
            <option value="user">User Only</option>
          </select>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
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
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${
                            user.role === 'admin' ? 'bg-gradient-to-br from-red-600 to-red-700' :
                            user.role === 'agent' ? 'bg-gradient-to-br from-blue-600 to-blue-700' :
                            'bg-gradient-to-br from-green-600 to-green-700'
                          } rounded-xl flex items-center justify-center text-white font-bold`}>
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
                          <Phone size={16} className="text-blue-600" />
                          <span className="text-sm">{user.phone || 'Not provided'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${roleBadge.bg} ${roleBadge.text}`}>
                          {roleBadge.icon}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin size={16} className="text-purple-600" />
                          <span className="text-sm">{user.location || 'Not provided'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar size={16} className="text-indigo-600" />
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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewUserDetails(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">User Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className={`w-16 h-16 ${
                  selectedUser.role === 'admin' ? 'bg-gradient-to-br from-red-600 to-red-700' :
                  selectedUser.role === 'agent' ? 'bg-gradient-to-br from-blue-600 to-blue-700' :
                  'bg-gradient-to-br from-green-600 to-green-700'
                } rounded-xl flex items-center justify-center text-white text-2xl font-bold`}>
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <p className="font-semibold text-gray-800 capitalize">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-semibold text-gray-800">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-semibold text-gray-800">{selectedUser.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <p className="font-semibold text-gray-800 capitalize">{selectedUser.status || 'active'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Joined Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedUser.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;