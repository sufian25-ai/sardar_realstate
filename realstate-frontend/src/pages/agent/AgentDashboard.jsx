// src/pages/agent/AgentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './AgentDashboard.css';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentStats();
  }, []);

  const fetchAgentStats = async () => {
    try {
      const response = await api.get('/agent/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching agent stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'agent' && user.role !== 'admin')) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Access Denied</h4>
          <p>You don't have permission to access the agent panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-dashboard">
      {/* Sidebar */}
      <div className="agent-sidebar">
        <div className="sidebar-header">
          <div className="agent-profile">
            <img 
              src={user.avatar || '/assets/default-avatar.jpg'} 
              alt={user.name}
              className="agent-avatar"
            />
            <h4>{user.name}</h4>
            <small>Real Estate Agent</small>
            <div className="agent-rating">
              <span className="stars">★★★★★</span>
              <small>4.8 (124 reviews)</small>
            </div>
          </div>
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
            className={`nav-item ${activeTab === 'my-properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-properties')}
          >
            <i className="bi bi-house"></i>
            My Properties
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'add-property' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-property')}
          >
            <i className="bi bi-plus-circle"></i>
            Add Property
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <i className="bi bi-person-lines-fill"></i>
            Leads & Inquiries
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <i className="bi bi-calendar-check"></i>
            Appointments
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <i className="bi bi-currency-dollar"></i>
            Transactions
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <i className="bi bi-graph-up"></i>
            Reports & Analytics
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="bi bi-person"></i>
            My Profile
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
      <div className="agent-main">
        <header className="agent-header">
          <div className="header-left">
            <h1>Agent Dashboard</h1>
            <p>Manage your properties and grow your business</p>
          </div>
          <div className="header-right">
            <div className="quick-actions">
              <button className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>
                Add Property
              </button>
              <button className="btn btn-outline-primary">
                <i className="bi bi-bell"></i>
              </button>
            </div>
          </div>
        </header>

        <main className="agent-content">
          {activeTab === 'dashboard' && <AgentOverview stats={stats} />}
          {activeTab === 'my-properties' && <MyProperties />}
          {activeTab === 'add-property' && <AddProperty />}
          {activeTab === 'leads' && <LeadsManagement />}
          {activeTab === 'appointments' && <AppointmentsManagement />}
          {activeTab === 'transactions' && <TransactionsManagement />}
          {activeTab === 'reports' && <ReportsAnalytics />}
          {activeTab === 'profile' && <AgentProfile />}
          {activeTab === 'settings' && <AgentSettings />}
        </main>
      </div>
    </div>
  );
};

// Agent Overview Component
const AgentOverview = ({ stats }) => (
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
            <small className="text-success">
              <i className="bi bi-arrow-up"></i> 12% from last month
            </small>
          </div>
        </div>
      </div>
      
      <div className="col-xl-3 col-md-6">
        <div className="stat-card">
          <div className="stat-icon bg-success">
            <i className="bi bi-eye"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalViews || 0}</h3>
            <p>Property Views</p>
            <small className="text-success">
              <i className="bi bi-arrow-up"></i> 8% from last week
            </small>
          </div>
        </div>
      </div>
      
      <div className="col-xl-3 col-md-6">
        <div className="stat-card">
          <div className="stat-icon bg-warning">
            <i className="bi bi-telephone"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalLeads || 0}</h3>
            <p>New Leads</p>
            <small className="text-success">
              <i className="bi bi-arrow-up"></i> 15% from last month
            </small>
          </div>
        </div>
      </div>
      
      <div className="col-xl-3 col-md-6">
        <div className="stat-card">
          <div className="stat-icon bg-info">
            <i className="bi bi-currency-dollar"></i>
          </div>
          <div className="stat-info">
            <h3>${stats.totalCommission || 0}</h3>
            <p>Total Commission</p>
            <small className="text-success">
              <i className="bi bi-arrow-up"></i> 20% from last quarter
            </small>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Activity & Quick Stats */}
    <div className="row mt-4">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5>Recent Properties</h5>
          </div>
          <div className="card-body">
            <RecentPropertiesTable />
          </div>
        </div>
      </div>
      
      <div className="col-lg-4">
        <div className="card">
          <div className="card-header">
            <h5>Quick Actions</h5>
          </div>
          <div className="card-body">
            <div className="quick-action-buttons">
              <button className="action-btn">
                <i className="bi bi-house-add"></i>
                Add New Property
              </button>
              <button className="action-btn">
                <i className="bi bi-calendar-plus"></i>
                Schedule Tour
              </button>
              <button className="action-btn">
                <i className="bi bi-graph-up"></i>
                View Reports
              </button>
              <button className="action-btn">
                <i className="bi bi-person-plus"></i>
                Add Client
              </button>
            </div>
          </div>
        </div>
        
        <div className="card mt-4">
          <div className="card-header">
            <h5>Performance</h5>
          </div>
          <div className="card-body">
            <div className="performance-stats">
              <div className="performance-item">
                <span>Conversion Rate</span>
                <strong>12.5%</strong>
              </div>
              <div className="performance-item">
                <span>Average Response Time</span>
                <strong>2.3 hours</strong>
              </div>
              <div className="performance-item">
                <span>Client Satisfaction</span>
                <strong>4.8/5</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// My Properties Component
const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      const response = await api.get('/agent/properties');
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    return property.status === filter;
  });

  return (
    <div className="properties-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Properties</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Properties</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="draft">Draft</option>
          </select>
          <button className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Add Property
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Leads</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map(property => (
                  <PropertyRow key={property.id} property={property} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Property Row Component
const PropertyRow = ({ property }) => (
  <tr>
    <td>
      <div className="d-flex align-items-center">
        <img 
          src={property.images?.[0] || '/assets/default-property.jpg'} 
          alt={property.title}
          className="property-thumb"
        />
        <div className="ms-3">
          <strong>{property.title}</strong>
          <br />
          <small className="text-muted">{property.location}</small>
        </div>
      </div>
    </td>
    <td>
      <span className={`badge bg-${property.type === 'sale' ? 'primary' : 'success'}`}>
        {property.type}
      </span>
    </td>
    <td>${property.price?.toLocaleString()}</td>
    <td>
      <span className={`badge bg-${getStatusColor(property.status)}`}>
        {property.status}
      </span>
    </td>
    <td>{property.views || 0}</td>
    <td>{property.leads || 0}</td>
    <td>{new Date(property.createdAt).toLocaleDateString()}</td>
    <td>
      <div className="btn-group">
        <button className="btn btn-sm btn-outline-primary">
          <i className="bi bi-eye"></i>
        </button>
        <button className="btn btn-sm btn-outline-secondary">
          <i className="bi bi-pencil"></i>
        </button>
        <button className="btn btn-sm btn-outline-info">
          <i className="bi bi-graph-up"></i>
        </button>
        <button className="btn btn-sm btn-outline-danger">
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </td>
  </tr>
);

// Add Property Component
const AddProperty = () => {
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    type: 'sale',
    price: '',
    propertyType: 'apartment',
    
    // Location
    address: '',
    city: '',
    state: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    
    // Property Details
    bedrooms: '',
    bathrooms: '',
    area: '',
    areaUnit: 'sqft',
    yearBuilt: '',
    lotSize: '',
    
    // Features
    amenities: [],
    parking: '',
    garage: '',
    basement: false,
    pool: false,
    garden: false,
    balcony: false,
    furnished: false,
    petFriendly: false,
    security: false,
    
    // Additional Information
    maintenanceFee: '',
    propertyTax: '',
    hoaFee: '',
    
    // Media
    images: [],
    videoTour: '',
    virtualTour: '',
    floorPlan: '',
    
    // SEO
    metaTitle: '',
    metaDescription: '',
    slug: '',
    
    // Marketing
    featured: false,
    urgent: false,
    openHouse: false,
    
    // Contact Information
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    showContactInfo: true
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/agent/properties', formData);
      // Show success message and redirect
    } catch (error) {
      console.error('Error adding property:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <div className="add-property">
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Add New Property</h2>
          <p className="text-muted mb-0">Fill in the details to list your property</p>
        </div>
        
        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <span>1</span>
            Basic Info
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <span>2</span>
            Location
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <span>3</span>
            Details
          </div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <span>4</span>
            Media
          </div>
          <div className={`step ${currentStep >= 5 ? 'active' : ''}`}>
            <span>5</span>
            Review
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            {currentStep === 1 && (
              <BasicInfoStep 
                formData={formData} 
                setFormData={setFormData} 
              />
            )}
            
            {currentStep === 2 && (
              <LocationStep 
                formData={formData} 
                setFormData={setFormData} 
              />
            )}
            
            {currentStep === 3 && (
              <DetailsStep 
                formData={formData} 
                setFormData={setFormData} 
              />
            )}
            
            {currentStep === 4 && (
              <MediaStep 
                formData={formData} 
                setFormData={setFormData} 
              />
            )}
            
            {currentStep === 5 && (
              <ReviewStep 
                formData={formData} 
                setFormData={setFormData} 
              />
            )}
          </div>
          
          <div className="card-footer">
            <div className="d-flex justify-content-between">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </button>
              
              {currentStep < 5 ? (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={nextStep}
                >
                  Next
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? 'Publishing...' : 'Publish Property'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Step Components
const BasicInfoStep = ({ formData, setFormData }) => (
  <div className="step-content">
    <h4>Basic Information</h4>
    <div className="row g-3">
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
      
      <div className="col-12">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows="4"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        ></textarea>
      </div>
    </div>
  </div>
);

const LocationStep = ({ formData, setFormData }) => (
  <div className="step-content">
    <h4>Location Information</h4>
    <div className="row g-3">
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
      
      <div className="col-md-6">
        <label className="form-label">Latitude</label>
        <input
          type="text"
          className="form-control"
          value={formData.latitude}
          onChange={(e) => setFormData({...formData, latitude: e.target.value})}
        />
      </div>
      
      <div className="col-md-6">
        <label className="form-label">Longitude</label>
        <input
          type="text"
          className="form-control"
          value={formData.longitude}
          onChange={(e) => setFormData({...formData, longitude: e.target.value})}
        />
      </div>
    </div>
  </div>
);

// Other Step Components (Details, Media, Review) would be similar

// Leads Management Component
const LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('all');

  return (
    <div className="leads-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Leads & Inquiries</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Leads</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      <div className="row">
        {leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
};

// Other Management Components
const AppointmentsManagement = () => {
  return (
    <div className="appointments-management">
      <h2>Appointments & Tours</h2>
      {/* Implement appointments management */}
    </div>
  );
};

const TransactionsManagement = () => {
  return (
    <div className="transactions-management">
      <h2>Transactions</h2>
      {/* Implement transactions management */}
    </div>
  );
};

const ReportsAnalytics = () => {
  return (
    <div className="reports-analytics">
      <h2>Reports & Analytics</h2>
      {/* Implement reports and analytics */}
    </div>
  );
};

const AgentProfile = () => {
  return (
    <div className="agent-profile">
      <h2>My Profile</h2>
      {/* Implement agent profile */}
    </div>
  );
};

const AgentSettings = () => {
  return (
    <div className="agent-settings">
      <h2>Settings</h2>
      {/* Implement agent settings */}
    </div>
  );
};

// Recent Properties Table Component
const RecentPropertiesTable = () => {
  return (
    <div className="recent-properties">
      {/* Implement recent properties table */}
    </div>
  );
};

// Lead Card Component
const LeadCard = ({ lead }) => {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card lead-card">
        <div className="card-body">
          <h5 className="card-title">{lead.name}</h5>
          <p className="card-text">{lead.message}</p>
          <div className="lead-meta">
            <small>Interested in: {lead.propertyInterest}</small>
            <br />
            <small>Budget: ${lead.budget}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function
const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    pending: 'warning',
    sold: 'info',
    rented: 'primary',
    draft: 'secondary'
  };
  return colors[status] || 'secondary';
};

export default AgentDashboard;