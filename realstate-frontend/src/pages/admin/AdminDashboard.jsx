// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Access Denied</h4>
          <p>You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h3>🏠 Sardar Estate</h3>
          <small>Admin Panel</small>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="bi bi-speedometer2"></i>
            Dashboard
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            <i className="bi bi-house"></i>
            Properties
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'agents' ? 'active' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            <i className="bi bi-people"></i>
            Agents
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-person"></i>
            Users
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <i className="bi bi-tags"></i>
            Categories
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'locations' ? 'active' : ''}`}
            onClick={() => setActiveTab('locations')}
          >
            <i className="bi bi-geo-alt"></i>
            Locations
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'amenities' ? 'active' : ''}`}
            onClick={() => setActiveTab('amenities')}
          >
            <i className="bi bi-star"></i>
            Amenities
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <i className="bi bi-currency-dollar"></i>
            Transactions
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <i className="bi bi-chat"></i>
            Reviews
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="bi bi-gear"></i>
            Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user.name}!</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span>{user.name}</span>
              <small>{user.role}</small>
            </div>
          </div>
        </header>

        <main className="admin-content">
          {activeTab === 'dashboard' && <DashboardOverview stats={stats} />}
          {activeTab === 'properties' && <PropertiesManagement />}
          {activeTab === 'agents' && <AgentsManagement />}
          {activeTab === 'users' && <UsersManagement />}
          {activeTab === 'categories' && <CategoriesManagement />}
          {activeTab === 'locations' && <LocationsManagement />}
          {activeTab === 'amenities' && <AmenitiesManagement />}
          {activeTab === 'transactions' && <TransactionsManagement />}
          {activeTab === 'reviews' && <ReviewsManagement />}
          {activeTab === 'settings' && <SettingsManagement />}
        </main>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ stats }) => (
  <div className="dashboard-overview">
    <div className="row g-4">
      <div className="col-xl-3 col-md-6">
        <div className="stat-card">
          <div className="stat-icon bg-primary">
            <i className="bi bi-house"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalProperties || 0}</h3>
            <p>Total Properties</p>
          </div>
        </div>
      </div>
      
      <div className="col-xl-3 col-md-6">
        <div className="stat-card">
          <div className="stat-icon bg-success">
            <i className="bi bi-people"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
      </div>
      
      <div className="col-xl-3 col-md-6">
        <div className="stat-card">
          <div className="stat-icon bg-warning">
            <i className="bi bi-currency-dollar"></i>
          </div>
          <div className="stat-info">
            <h3>${stats.totalRevenue || 0}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>
      
      <div className="col-xl-3 col-md-6">
        <div className="stat-card">
          <div className="stat-icon bg-info">
            <i className="bi bi-chat"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.pendingReviews || 0}</h3>
            <p>Pending Reviews</p>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="row mt-4">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5>Recent Activity</h5>
          </div>
          <div className="card-body">
            <div className="activity-list">
              {/* Activity items will be populated here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Properties Management Component
const PropertiesManagement = () => {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/admin/properties');
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  return (
    <div className="properties-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Properties Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Property
        </button>
      </div>

      {showForm && (
        <PropertyForm 
          property={editingProperty}
          onClose={() => {
            setShowForm(false);
            setEditingProperty(null);
          }}
          onSave={fetchProperties}
        />
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property.id}>
                    <td>{property.id}</td>
                    <td>
                      <img 
                        src={property.images?.[0] || '/assets/default-property.jpg'} 
                        alt={property.title}
                        className="property-thumb"
                      />
                    </td>
                    <td>{property.title}</td>
                    <td>
                      <span className={`badge bg-${property.type === 'sale' ? 'primary' : 'success'}`}>
                        {property.type}
                      </span>
                    </td>
                    <td>${property.price}</td>
                    <td>{property.location}</td>
                    <td>
                      <span className={`badge bg-${property.status === 'active' ? 'success' : 'secondary'}`}>
                        {property.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setEditingProperty(property);
                            setShowForm(true);
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Property Form Component with all real estate fields
const PropertyForm = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'sale',
    price: '',
    location: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    areaUnit: 'sqft',
    yearBuilt: '',
    propertyType: 'apartment',
    status: 'active',
    featured: false,
    images: [],
    amenities: [],
    // Additional fields
    latitude: '',
    longitude: '',
    floorPlan: '',
    videoTour: '',
    virtualTour: '',
    parking: '',
    garage: '',
    basement: '',
    pool: false,
    garden: false,
    balcony: false,
    furnished: false,
    petFriendly: false,
    security: false,
    maintenanceFee: '',
    propertyTax: '',
    hoaFee: '',
    // Agent fields
    agentId: '',
    // Transaction fields
    listingDate: '',
    expiryDate: '',
    // SEO fields
    metaTitle: '',
    metaDescription: '',
    slug: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData(property);
    }
  }, [property]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (property) {
        await api.put(`/admin/properties/${property.id}`, formData);
      } else {
        await api.post('/admin/properties', formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    // Implement image upload logic
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{property ? 'Edit Property' : 'Add New Property'}</h3>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="row g-3">
              {/* Basic Information */}
              <div className="col-12">
                <h5>Basic Information</h5>
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Property Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Property Type *</label>
                <select
                  className="form-select"
                  value={formData.propertyType}
                  onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                  required
                >
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="house">House</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                  <option value="office">Office</option>
                  <option value="shop">Shop</option>
                </select>
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Transaction Type *</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="lease">For Lease</option>
                </select>
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Price *</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>

              {/* Location Information */}
              <div className="col-12">
                <h5>Location Information</h5>
              </div>
              
              <div className="col-12">
                <label className="form-label">Full Address *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
              
              <div className="col-md-4">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                />
              </div>
              
              <div className="col-md-4">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  required
                />
              </div>
              
              <div className="col-md-4">
                <label className="form-label">ZIP Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                />
              </div>

              {/* Property Details */}
              <div className="col-12">
                <h5>Property Details</h5>
              </div>
              
              <div className="col-md-3">
                <label className="form-label">Bedrooms</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                />
              </div>
              
              <div className="col-md-3">
                <label className="form-label">Bathrooms</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                />
              </div>
              
              <div className="col-md-3">
                <label className="form-label">Area</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                />
              </div>
              
              <div className="col-md-3">
                <label className="form-label">Area Unit</label>
                <select
                  className="form-select"
                  value={formData.areaUnit}
                  onChange={(e) => setFormData({...formData, areaUnit: e.target.value})}
                >
                  <option value="sqft">Square Feet</option>
                  <option value="sqm">Square Meters</option>
                  <option value="acre">Acres</option>
                  <option value="hectare">Hectares</option>
                </select>
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Year Built</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData({...formData, yearBuilt: e.target.value})}
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Parking Spaces</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.parking}
                  onChange={(e) => setFormData({...formData, parking: e.target.value})}
                />
              </div>

              {/* Features & Amenities */}
              <div className="col-12">
                <h5>Features & Amenities</h5>
              </div>
              
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.pool}
                    onChange={(e) => setFormData({...formData, pool: e.target.checked})}
                  />
                  <label className="form-check-label">Swimming Pool</label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.garden}
                    onChange={(e) => setFormData({...formData, garden: e.target.checked})}
                  />
                  <label className="form-check-label">Garden</label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.balcony}
                    onChange={(e) => setFormData({...formData, balcony: e.target.checked})}
                  />
                  <label className="form-check-label">Balcony</label>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.furnished}
                    onChange={(e) => setFormData({...formData, furnished: e.target.checked})}
                  />
                  <label className="form-check-label">Furnished</label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.petFriendly}
                    onChange={(e) => setFormData({...formData, petFriendly: e.target.checked})}
                  />
                  <label className="form-check-label">Pet Friendly</label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.security}
                    onChange={(e) => setFormData({...formData, security: e.target.checked})}
                  />
                  <label className="form-check-label">Security System</label>
                </div>
              </div>

              {/* Additional Information */}
              <div className="col-12">
                <h5>Additional Information</h5>
              </div>
              
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Maintenance Fee</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.maintenanceFee}
                  onChange={(e) => setFormData({...formData, maintenanceFee: e.target.value})}
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Property Tax</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.propertyTax}
                  onChange={(e) => setFormData({...formData, propertyTax: e.target.value})}
                />
              </div>

              {/* Image Upload */}
              <div className="col-12">
                <label className="form-label">Property Images</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (property ? 'Update Property' : 'Add Property')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Other management components (Agents, Users, Categories, etc.)
const AgentsManagement = () => {
  return (
    <div>
      <h2>Agents Management</h2>
      {/* Implement agents management */}
    </div>
  );
};

const UsersManagement = () => {
  return (
    <div>
      <h2>Users Management</h2>
      {/* Implement users management */}
    </div>
  );
};

const CategoriesManagement = () => {
  return (
    <div>
      <h2>Categories Management</h2>
      {/* Implement categories management */}
    </div>
  );
};

const LocationsManagement = () => {
  return (
    <div>
      <h2>Locations Management</h2>
      {/* Implement locations management */}
    </div>
  );
};

const AmenitiesManagement = () => {
  return (
    <div>
      <h2>Amenities Management</h2>
      {/* Implement amenities management */}
    </div>
  );
};

const TransactionsManagement = () => {
  return (
    <div>
      <h2>Transactions Management</h2>
      {/* Implement transactions management */}
    </div>
  );
};

const ReviewsManagement = () => {
  return (
    <div>
      <h2>Reviews Management</h2>
      {/* Implement reviews management */}
    </div>
  );
};

const SettingsManagement = () => {
  return (
    <div>
      <h2>Settings Management</h2>
      {/* Implement settings management */}
    </div>
  );
};

export default AdminDashboard;