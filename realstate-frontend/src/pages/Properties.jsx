import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Search, MapPin, Bed, Bath, Square, Star, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
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

                    <Link
                      to={`/properties/${property.pid}`}
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </>
  );
};

export default Properties;
