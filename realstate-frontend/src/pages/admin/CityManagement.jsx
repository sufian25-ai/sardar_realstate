import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit, Trash2, X, Check, MapPin } from 'lucide-react';
import axios from 'axios';

const CityManagement = () => {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);
  
  const [formData, setFormData] = useState({
    cname: '',
    slug: '',
    state_id: '',
    is_active: true
  });

  // 👉 এখানে তোমার API base URL দাও

  const CITIES_API_URL = 'http://127.0.0.1:8000/api/cities';
  const STATES_API_URL = 'http://127.0.0.1:8000/api/states';

  // Fetch states and cities
  useEffect(() => {
    fetchStates();
    fetchCities();
  }, []);

  const fetchStates = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${STATES_API_URL}?active=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStates(res.data.data.data || []);
    } catch (err) {
      console.error("Error fetching states:", err);
      setStates([
        { sid: 1, sname: 'Dhaka' },
        { sid: 2, sname: 'Chittagong' },
        { sid: 3, sname: 'Sylhet' }
      ]);
    }
  };

  const fetchCities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(CITIES_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const citiesData = res.data.data.data || [];
      setCities(citiesData);
      setFilteredCities(citiesData);
    } catch (err) {
      console.error("Error fetching cities:", err);
      // fallback demo
      const demoCities = [
        { cid: 1, cname: 'Dhaka City', slug: 'dhaka-city', state_id: 1, state: { sname: 'Dhaka' }, is_active: true, created_at: '2024-01-15' },
        { cid: 2, cname: 'Gazipur', slug: 'gazipur', state_id: 1, state: { sname: 'Dhaka' }, is_active: true, created_at: '2024-02-10' },
      ];
      setCities(demoCities);
      setFilteredCities(demoCities);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = cities;
    if (filterState !== 'all') filtered = filtered.filter(c => c.state_id === parseInt(filterState));
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.cname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.state && c.state.sname.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredCities(filtered);
  }, [searchTerm, filterState, cities]);

  const generateSlug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'cname' ? { slug: generateSlug(value) } : {})
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editMode ? `${CITIES_API_URL}/${currentCity.cid}` : CITIES_API_URL;
      const method = editMode ? 'put' : 'post';
      const res = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if ([200, 201].includes(res.data.response_code)) {
        alert(editMode ? 'City updated!' : 'City created!');
        fetchCities();
        closeModal();
      }
    } catch (err) {
      alert('Failed to save city');
    }
  };

  const handleDelete = async cid => {
    if (!confirm('Delete this city?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${CITIES_API_URL}/${cid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCities();
    } catch {
      alert('Delete failed');
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setFormData({ cname: '', slug: '', state_id: '', is_active: true });
    setShowModal(true);
  };

  const openEditModal = city => {
    setEditMode(true);
    setCurrentCity(city);
    setFormData({
      cname: city.cname,
      slug: city.slug,
      state_id: city.state_id,
      is_active: city.is_active
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setFormData({ cname: '', slug: '', state_id: '', is_active: true });
  };

  if (loading) return <div className="text-center py-20">Loading cities...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 /> City Management
          </h1>
          <button onClick={openCreateModal} className="bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold flex items-center gap-2">
            <Plus /> Add City
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search city or state..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
          />
        </div>
        <select value={filterState} onChange={e => setFilterState(e.target.value)} className="border px-4 py-2 rounded-lg">
          <option value="all">All States</option>
          {states.map(s => <option key={s.sid} value={s.sid}>{s.sname}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">City Name</th>
              <th className="px-6 py-3 text-left">State</th>
              <th className="px-6 py-3 text-left">Slug</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.map(city => (
              <tr key={city.cid} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{city.cid}</td>
                <td className="px-6 py-3 font-medium">{city.cname}</td>
                <td className="px-6 py-3 flex items-center gap-1"><MapPin size={14} /> {city.state?.sname}</td>
                <td className="px-6 py-3">{city.slug}</td>
                <td className="px-6 py-3">
                  {city.is_active ? (
                    <span className="text-green-600 flex items-center gap-1"><Check size={14} /> Active</span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1"><X size={14} /> Inactive</span>
                  )}
                </td>
                <td className="px-6 py-3 text-center flex justify-center gap-2">
                  <button onClick={() => openEditModal(city)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(city.cid)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit City' : 'Add City'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="cname"
                placeholder="City Name"
                value={formData.cname}
                onChange={handleInputChange}
                className="w-full border px-4 py-2 rounded-lg"
                required
              />
              <input
                type="text"
                name="slug"
                placeholder="Slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full border px-4 py-2 rounded-lg"
                required
              />
              <select
                name="state_id"
                value={formData.state_id}
                onChange={handleInputChange}
                className="w-full border px-4 py-2 rounded-lg"
                required
              >
                <option value="">Select State</option>
                {states.map(s => <option key={s.sid} value={s.sid}>{s.sname}</option>)}
              </select>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} />
                Active
              </label>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editMode ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityManagement;
