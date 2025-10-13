import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Search, Edit, Trash2, X, Check } from 'lucide-react';
import axios from 'axios';

const StateManagement = () => {
  const [states, setStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentState, setCurrentState] = useState(null);
  
  const [formData, setFormData] = useState({
    sname: '',
    slug: '',
    is_active: true
  });

  const API_URL = 'http://127.0.0.1:8000/api/states';

  // Fetch states
  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const statesData = response.data.data.data || [];
      setStates(statesData);
      setFilteredStates(statesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching states:', error);
      setLoading(false);
      
      // Demo data
      const demoStates = [
        { sid: 1, sname: 'Dhaka', slug: 'dhaka', is_active: true, created_at: '2024-01-15' },
        { sid: 2, sname: 'Chittagong', slug: 'chittagong', is_active: true, created_at: '2024-01-20' },
        { sid: 3, sname: 'Sylhet', slug: 'sylhet', is_active: true, created_at: '2024-02-10' },
      ];
      
      setStates(demoStates);
      setFilteredStates(demoStates);
    }
  };

  // Search functionality
  useEffect(() => {
    const filtered = states.filter(state =>
      state.sname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStates(filtered);
  }, [searchTerm, states]);

  // Auto-generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'sname') {
      setFormData({
        ...formData,
        sname: value,
        slug: generateSlug(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Create new state
  const handleCreate = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.response_code === 201) {
        alert('State created successfully!');
        fetchStates();
        closeModal();
      }
    } catch (error) {
      console.error('Error creating state:', error);
      alert(error.response?.data?.message || 'Failed to create state');
    }
  };

  // Update state
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(`${API_URL}/${currentState.sid}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.response_code === 200) {
        alert('State updated successfully!');
        fetchStates();
        closeModal();
      }
    } catch (error) {
      console.error('Error updating state:', error);
      alert(error.response?.data?.message || 'Failed to update state');
    }
  };

  // Delete state
  const handleDelete = async (sid) => {
    if (!confirm('Are you sure you want to delete this state?')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`${API_URL}/${sid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.response_code === 200) {
        alert('State deleted successfully!');
        fetchStates();
      }
    } catch (error) {
      console.error('Error deleting state:', error);
      alert(error.response?.data?.message || 'Failed to delete state');
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setCurrentState(null);
    setFormData({ sname: '', slug: '', is_active: true });
    setShowModal(true);
  };

  const openEditModal = (state) => {
    setEditMode(true);
    setCurrentState(state);
    setFormData({
      sname: state.sname,
      slug: state.slug,
      is_active: state.is_active
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentState(null);
    setFormData({ sname: '', slug: '', is_active: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading states...</p>
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
                <MapPin className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-white">States Management</h1>
            </div>
            <p className="text-blue-100">Manage all states in the system</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
            <p className="text-sm text-blue-100 mb-1">Total States</p>
            <p className="text-3xl font-bold text-white">{filteredStates.length}</p>
          </div>
        </div>
      </div>

      {/* Search and Add Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus size={20} />
            Add New State
          </button>
        </div>
      </div>

      {/* States Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {filteredStates.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No States Found</h3>
            <p className="text-gray-500">Add your first state to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">State Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Slug</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStates.map((state) => (
                  <tr key={state.sid} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">#{state.sid}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                          {state.sname.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">{state.sname}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 font-mono text-sm">{state.slug}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        state.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {state.is_active ? <Check size={12} /> : <X size={12} />}
                        {state.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(state.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(state)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit State"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(state.sid)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete State"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editMode ? 'Edit State' : 'Add New State'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={editMode ? handleUpdate : handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State Name *
                </label>
                <input
                  type="text"
                  name="sname"
                  value={formData.sname}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter state name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  placeholder="state-slug"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-generated from state name</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active State
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  {editMode ? 'Update State' : 'Create State'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateManagement;