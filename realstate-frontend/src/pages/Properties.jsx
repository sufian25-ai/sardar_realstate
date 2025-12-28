import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, MapPin, Bed, Bath, Square, Star, Filter, X, ChevronLeft, ChevronRight, Home, Building2, Phone, Mail, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    monthly_rent: '',
    security_deposit: '',
    lease_duration: 12,
    start_date: '',
    end_date: '',
    additional_terms: ''
  });
  
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    type: '',
    stype: '',
    city_id: '',
    state_id: '',
    min_price: '',
    max_price: '',
    bedroom: '',
    status: 'available'
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/properties', { params: {featured: true, status: 'available'} });
      setProperties(response.data.data.data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchProperties();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      stype: '',
      city_id: '',
      state_id: '',
      min_price: '',
      max_price: '',
      bedroom: '',
      status: 'available'
    });
    fetchProperties();
  };

  const openDetailsModal = (property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProperty(null);
    setCurrentImageIndex(0);
  };

  const getPropertyImages = (property) => {
    const images = [];
    if (property.pimage) images.push(property.pimage);
    if (property.pimage1) images.push(property.pimage1);
    if (property.pimage2) images.push(property.pimage2);
    if (property.pimage3) images.push(property.pimage3);
    if (property.pimage4) images.push(property.pimage4);
    if (property.mapimage) images.push(property.mapimage);
    if (property.groundmapimage) images.push(property.groundmapimage);
    return images;
  };

  const nextImage = () => {
    if (selectedProperty) {
      const images = getPropertyImages(selectedProperty);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedProperty) {
      const images = getPropertyImages(selectedProperty);
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const openBookingModal = () => {
    setShowDetailsModal(false);
    setShowBookingModal(true);
    setBookingData({
      ...bookingData,
      monthly_rent: selectedProperty.price || '',
      security_deposit: selectedProperty.price * 2 || ''
    });
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const submitBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to book a property');
        navigate('/login');
        return;
      }

      const response = await api.post('/rents', {
        property_id: selectedProperty.pid,
        ...bookingData
      });

      if (response.data.status === 'success') {
        alert('Booking request submitted successfully!');
        setShowBookingModal(false);
        setBookingData({
          monthly_rent: '',
          security_deposit: '',
          lease_duration: 12,
          start_date: '',
          end_date: '',
          additional_terms: ''
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Failed to submit booking');
    }
  };

  const contactAgent = () => {
    alert(`Contact Agent: ${selectedProperty.user?.name}\nEmail: ${selectedProperty.user?.email}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl font-bold">Loading Properties...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-black mb-4">
              <span className="text-gray-900">Explore</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"> Premium Properties</span>
            </h1>
            <p className="text-gray-600 text-xl">Find your dream property from our exclusive collection</p>
          </div>

          {/* Filter Button */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-lg font-semibold text-gray-700">
              {properties.length} Properties Found
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Property Type</label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  >
                    <option value="">All Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Sale Type</label>
                  <select
                    name="stype"
                    value={filters.stype}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                  >
                    <option value="">All</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bedrooms</label>
                  <select
                    name="bedroom"
                    value={filters.bedroom}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                  >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={applyFilters}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-xl transition-all"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="px-6 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Properties Grid */}
          {properties.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏠</div>
              <p className="text-gray-500 text-xl">No properties found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map(property => (
                <div key={property.pid} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-transparent">
                  <div className="relative overflow-hidden">
                    <img
                      src={property.pimage ? `http://localhost:8000/${property.pimage}` : '/assets/placeholder.jpg'}
                      alt={property.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                    />
                    
                    {property.featured && (
                      <div className="absolute top-4 left-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {property.stype === 'sale' ? 'For Sale' : 'For Rent'}
                      </span>
                    </div>

                    {property.verified && (
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          ✓ Verified
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {property.type}
                      </span>
                      <span className="text-sm text-gray-500">ID: {property.pid}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {property.title}
                    </h3>

                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
                      ${property.price?.toLocaleString()}
                    </div>

                    <p className="text-gray-600 mb-4 flex items-center">
                      <MapPin className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{property.location}</span>
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100 mb-4">
                      <div className="flex items-center gap-1 text-gray-700">
                        <Bed className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-bold">{property.bedroom || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <Bath className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-bold">{property.bathroom || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <Square className="w-4 h-4 text-pink-500" />
                        <span className="text-sm font-bold">{property.size || 'N/A'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => openDetailsModal(property)}
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <div className="sticky top-0 bg-white z-10 p-6 border-b flex justify-between items-center">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Property Details
              </h2>
              <button
                onClick={closeDetailsModal}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Image Carousel */}
              <div className="relative mb-8">
                <div className="relative h-96 rounded-2xl overflow-hidden">
                  {getPropertyImages(selectedProperty).length > 0 ? (
                    <img
                      src={`http://localhost:8000/${getPropertyImages(selectedProperty)[currentImageIndex]}`}
                      alt="Property"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                    />
                  ) : (
                    <img src="/assets/placeholder.jpg" alt="No images" className="w-full h-full object-cover" />
                  )}
                </div>

                {getPropertyImages(selectedProperty).length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {getPropertyImages(selectedProperty).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? 'w-8 bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Property Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{selectedProperty.title}</h3>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                    ${selectedProperty.price?.toLocaleString()}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">{selectedProperty.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Home className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-700">{selectedProperty.city?.cname}, {selectedProperty.state?.sname}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                      <Bed className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{selectedProperty.bedroom || 0}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                      <Bath className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{selectedProperty.bathroom || 0}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl text-center">
                      <Square className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{selectedProperty.size || 'N/A'}</div>
                      <div className="text-sm text-gray-600">Sq Ft</div>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Description</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedProperty.pcontent}</p>
                  </div>
                </div>

                <div>
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Property Features</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 font-semibold">{selectedProperty.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className="ml-2 font-semibold capitalize">{selectedProperty.status}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Balcony:</span>
                        <span className="ml-2 font-semibold">{selectedProperty.balcony || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Kitchen:</span>
                        <span className="ml-2 font-semibold">{selectedProperty.kitchen || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Floor:</span>
                        <span className="ml-2 font-semibold">{selectedProperty.floor || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Floors:</span>
                        <span className="ml-2 font-semibold">{selectedProperty.totalfloor || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {selectedProperty.feature && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Additional Features</h4>
                      <p className="text-gray-700">{selectedProperty.feature}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={contactAgent}
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Phone className="w-5 h-5" />
                      Contact Agent
                    </button>

                    {selectedProperty.stype === 'rent' && selectedProperty.status === 'available' && (
                      <button
                        onClick={openBookingModal}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Calendar className="w-5 h-5" />
                        Book Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 z-10 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-white">
                  Book Property
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedProperty.title}</h3>
                <p className="text-gray-600">{selectedProperty.location}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      value={bookingData.end_date}
                      onChange={handleBookingChange}
                      min={bookingData.start_date}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Additional Terms (Optional)</label>
                  <textarea
                    name="additional_terms"
                    value={bookingData.additional_terms}
                    onChange={handleBookingChange}
                    rows="4"
                    placeholder="Any special requirements or terms..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                  ></textarea>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Rent:</span>
                      <span className="font-bold">${parseFloat(bookingData.monthly_rent || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security Deposit:</span>
                      <span className="font-bold">${parseFloat(bookingData.security_deposit || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-bold">{bookingData.lease_duration} months</span>
                    </div>
                    <div className="border-t-2 border-purple-200 pt-2 mt-2 flex justify-between">
                      <span className="text-gray-900 font-bold">Total First Payment:</span>
                      <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        ${(parseFloat(bookingData.monthly_rent || 0) + parseFloat(bookingData.security_deposit || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitBooking}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Submit Booking
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  By submitting, you agree to our terms and conditions. Your booking request will be sent to the property owner for approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>
        {`
          .line-clamp-1 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
          .line-clamp-2 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #3b82f6, #8b5cf6);
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #2563eb, #7c3aed);
          }
        `}
      </style>
    </>
  );
};

export default Properties;