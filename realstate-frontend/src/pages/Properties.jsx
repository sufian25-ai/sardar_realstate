import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import Footer from '../components/Footer';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
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
    fetchStatesAndCities();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/properties', { 
        params: { featured: true, status: 'available' } 
      });
      setProperties(response.data.data.data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatesAndCities = async () => {
    try {
      const statesRes = await api.get('/states', { params: { active: true } });
      if (statesRes.data.status === 'success') {
        setStates(statesRes.data.data.data);
      }

      const citiesRes = await api.get('/cities', { params: { active: true } });
      if (citiesRes.data.status === 'success') {
        setCities(citiesRes.data.data.data);
      }
    } catch (error) {
      console.error('Error fetching states/cities:', error);
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
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                PROPERTY LISTINGS
              </span>
            </div>
            <h1 className="text-6xl font-black mb-4">
              <span className="text-gray-900">Explore</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"> Premium Properties</span>
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Find your dream property from our exclusive collection of luxury homes and commercial spaces
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-lg font-bold text-gray-900">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {properties.length}
                  </span>
                  <span className="text-gray-600"> Properties Found</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Filter className="w-5 h-5" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Filter Properties
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Property Type</label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                  >
                    <option value="">All Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Sale Type</label>
                  <select
                    name="stype"
                    value={filters.stype}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all bg-white"
                  >
                    <option value="">All</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">State</label>
                  <select
                    name="state_id"
                    value={filters.state_id}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all bg-white"
                  >
                    <option value="">Any State</option>
                    {states.map(state => (
                      <option key={state.sid} value={state.sid}>{state.sname}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">City</label>
                  <select
                    name="city_id"
                    value={filters.city_id}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white"
                  >
                    <option value="">Any City</option>
                    {cities.map(city => (
                      <option key={city.cid} value={city.cid}>{city.cname}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Bedrooms</label>
                  <select
                    name="bedroom"
                    value={filters.bedroom}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Min Price</label>
                  <input
                    type="number"
                    name="min_price"
                    value={filters.min_price}
                    onChange={handleFilterChange}
                    placeholder="Min $"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Max Price</label>
                  <input
                    type="number"
                    name="max_price"
                    value={filters.max_price}
                    onChange={handleFilterChange}
                    placeholder="Max $"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white"
                  >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={applyFilters}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="px-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 rounded-xl transition-all duration-300"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Properties Grid */}
          {properties.length === 0 ? (
            <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl">
              <div className="text-8xl mb-6">🏠</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No Properties Found</h3>
              <p className="text-gray-500 text-xl mb-8">
                No properties match your search criteria. Try adjusting your filters.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <X className="w-5 h-5" />
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {properties.map(property => (
                <PropertyCard key={property.pid} property={property} />
              ))}
            </div>
          )}

          {/* Pagination (if needed) */}
          {properties.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-gray-700 hover:text-blue-600">
                  Previous
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold">
                  1
                </button>
                <button className="px-4 py-2 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-gray-700 hover:text-blue-600">
                  2
                </button>
                <button className="px-4 py-2 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-gray-700 hover:text-blue-600">
                  3
                </button>
                <button className="px-4 py-2 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-gray-700 hover:text-blue-600">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
      <Footer />
    </>
  );
};

export default Properties;