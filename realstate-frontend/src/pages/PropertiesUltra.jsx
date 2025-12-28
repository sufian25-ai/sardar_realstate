import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { 
  Search, MapPin, Bed, Bath, Square, Star, Filter, X, ChevronLeft, ChevronRight, 
  Home, Building2, Phone, Mail, Calendar, Grid3X3, List, SlidersHorizontal,
  Heart, ArrowUpRight, Sparkles, Map, Check, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PropertiesUltra = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    stype: '',
    city_id: '',
    min_price: '',
    max_price: '',
    bedroom: '',
    status: 'available',
    search: ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const propertyTypes = [
    { id: '', label: 'All Types', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'residential', label: 'Residential', icon: <Home className="w-5 h-5" /> },
    { id: 'commercial', label: 'Commercial', icon: <Building2 className="w-5 h-5" /> },
    { id: 'land', label: 'Land', icon: <Map className="w-5 h-5" /> }
  ];

  const priceRanges = [
    { label: 'Any Price', min: '', max: '' },
    { label: 'Under ৳50 Lac', min: '', max: '5000000' },
    { label: '৳50 Lac - ৳1 Cr', min: '5000000', max: '10000000' },
    { label: '৳1 Cr - ৳2 Cr', min: '10000000', max: '20000000' },
    { label: 'Above ৳2 Cr', min: '20000000', max: '' }
  ];

  const bedroomOptions = [
    { value: '', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' }
  ];

  useEffect(() => {
    fetchProperties();
  }, [filters, pagination.currentPage]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = { ...filters, page: pagination.currentPage };
      // Clean empty params
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      
      const response = await api.get('/properties', { params });
      const data = response.data?.data?.data || response.data?.data || [];
      setProperties(Array.isArray(data) ? data : []);
      
      // Update pagination if available
      if (response.data?.data?.last_page) {
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.data.last_page,
          total: response.data.data.total
        }));
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      stype: '',
      city_id: '',
      min_price: '',
      max_price: '',
      bedroom: '',
      status: 'available',
      search: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <h1 className="font-bold text-lg">SARDAR</h1>
                <p className="text-xs text-indigo-400">REAL ESTATE</p>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-white/70 hover:text-white transition-colors">Home</Link>
              <Link to="/about" className="text-white/70 hover:text-white transition-colors">About</Link>
              <Link to="/properties" className="text-indigo-400 font-medium">Properties</Link>
              <Link to="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <a href="tel:+8801730150390" className="hidden sm:flex items-center gap-2 text-white/70 hover:text-white">
                <Phone className="w-4 h-4" />
                <span>01730-150390</span>
              </a>
              <Link to="/login" className="btn-primary py-2 px-5 text-sm">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 rounded-full glass text-sm text-indigo-400 mb-4">
              <Building2 className="w-4 h-4 inline mr-2" />
              {pagination.total || properties.length} Properties Available
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Find Your <span className="text-gradient">Perfect</span> Property
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Discover premium properties across Dhaka's most sought-after locations
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative flex items-center gap-4 p-3 rounded-2xl glass">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search by location, property name..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white placeholder-white/40"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all ${
                  showFilters ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              
              <button
                onClick={fetchProperties}
                className="btn-primary py-3 px-8"
              >
                Search
              </button>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-6 rounded-2xl glass overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Property Type */}
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Property Type</label>
                      <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 outline-none"
                      >
                        {propertyTypes.map(type => (
                          <option key={type.id} value={type.id} className="bg-[#0f172a]">
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Price Range</label>
                      <select
                        value={`${filters.min_price}-${filters.max_price}`}
                        onChange={(e) => {
                          const [min, max] = e.target.value.split('-');
                          handleFilterChange('min_price', min);
                          handleFilterChange('max_price', max);
                        }}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 outline-none"
                      >
                        {priceRanges.map((range, i) => (
                          <option key={i} value={`${range.min}-${range.max}`} className="bg-[#0f172a]">
                            {range.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Bedrooms</label>
                      <select
                        value={filters.bedroom}
                        onChange={(e) => handleFilterChange('bedroom', e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 outline-none"
                      >
                        {bedroomOptions.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-[#0f172a]">
                            {opt.label} {opt.value && 'Bedrooms'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ===== PROPERTY TYPE TABS ===== */}
      <section className="py-8 border-y border-white/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Type Tabs */}
            <div className="flex gap-3 flex-wrap">
              {propertyTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => handleFilterChange('type', type.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    filters.type === type.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {type.icon}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>

            {/* View Toggle & Count */}
            <div className="flex items-center gap-4">
              <span className="text-white/50 text-sm">
                Showing {properties.length} of {pagination.total || properties.length} properties
              </span>
              <div className="flex rounded-xl overflow-hidden glass">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-all ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-white/50 hover:text-white'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-all ${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-white/50 hover:text-white'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROPERTIES GRID/LIST ===== */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          {loading ? (
            // Loading Skeleton
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-3xl overflow-hidden">
                  <div className="skeleton h-64" />
                  <div className="p-6 space-y-4 bg-[#0f172a]">
                    <div className="skeleton h-6 w-3/4" />
                    <div className="skeleton h-4 w-1/2" />
                    <div className="flex gap-4">
                      <div className="skeleton h-4 w-16" />
                      <div className="skeleton h-4 w-16" />
                      <div className="skeleton h-4 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  {viewMode === 'grid' ? (
                    // Grid Card
                    <Link to={`/properties/${property.id}`} className="block group">
                      <div className="card-premium h-full">
                        {/* Image */}
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={property.pimage 
                              ? `http://localhost:8000/${property.pimage}` 
                              : `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800`}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
                          
                          {/* Tags */}
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-3 py-1.5 rounded-lg bg-indigo-500/90 text-white text-xs font-semibold uppercase backdrop-blur-sm">
                              {property.type || 'Property'}
                            </span>
                            {property.stype && (
                              <span className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-medium backdrop-blur-sm capitalize">
                                For {property.stype}
                              </span>
                            )}
                          </div>

                          {/* Favorite */}
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(property.id);
                            }}
                            className={`absolute top-4 right-4 w-10 h-10 rounded-xl glass flex items-center justify-center transition-colors ${
                              favorites.includes(property.id) ? 'text-red-500' : 'text-white/70 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${favorites.includes(property.id) ? 'fill-current' : ''}`} />
                          </button>

                          {/* Price */}
                          <div className="absolute bottom-4 left-4">
                            <div className="text-2xl font-bold text-white">
                              ৳{Number(property.price || 0).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {property.title}
                          </h3>
                          
                          <p className="text-white/50 text-sm flex items-center gap-1 mb-4">
                            <MapPin className="w-4 h-4 text-indigo-400" />
                            {property.address || property.city?.cname || 'Dhaka'}
                          </p>

                          {/* Features */}
                          <div className="flex items-center gap-4 text-white/60 text-sm mb-4">
                            <span className="flex items-center gap-1.5">
                              <Bed className="w-4 h-4 text-indigo-400" />
                              {property.bedrooms || 0}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Bath className="w-4 h-4 text-indigo-400" />
                              {property.bathrooms || 0}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Square className="w-4 h-4 text-indigo-400" />
                              {property.area || 0} sqft
                            </span>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <span className="text-indigo-400 font-medium text-sm group-hover:text-indigo-300">
                              View Details
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                              <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    // List Card
                    <Link to={`/properties/${property.id}`} className="block group">
                      <div className="card-premium flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="relative w-full md:w-80 h-56 md:h-auto flex-shrink-0 overflow-hidden">
                          <img
                            src={property.pimage 
                              ? `http://localhost:8000/${property.pimage}` 
                              : `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800`}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          
                          {/* Tags */}
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-3 py-1.5 rounded-lg bg-indigo-500/90 text-white text-xs font-semibold uppercase backdrop-blur-sm">
                              {property.type || 'Property'}
                            </span>
                          </div>

                          {/* Favorite */}
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(property.id);
                            }}
                            className={`absolute top-4 right-4 w-10 h-10 rounded-xl glass flex items-center justify-center transition-colors ${
                              favorites.includes(property.id) ? 'text-red-500' : 'text-white/70 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${favorites.includes(property.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                {property.title}
                              </h3>
                              <div className="text-2xl font-bold text-gradient-gold">
                                ৳{Number(property.price || 0).toLocaleString()}
                              </div>
                            </div>
                            
                            <p className="text-white/50 text-sm flex items-center gap-1 mb-4">
                              <MapPin className="w-4 h-4 text-indigo-400" />
                              {property.address || property.city?.cname || 'Dhaka'}
                            </p>

                            <p className="text-white/60 text-sm mb-4 line-clamp-2">
                              {property.description || 'Premium property available in prime location with modern amenities and excellent connectivity.'}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Features */}
                            <div className="flex items-center gap-6 text-white/60 text-sm">
                              <span className="flex items-center gap-1.5">
                                <Bed className="w-4 h-4 text-indigo-400" />
                                {property.bedrooms || 0} Beds
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Bath className="w-4 h-4 text-indigo-400" />
                                {property.bathrooms || 0} Baths
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Square className="w-4 h-4 text-indigo-400" />
                                {property.area || 0} sqft
                              </span>
                            </div>

                            <button className="btn-primary py-2 px-5 text-sm flex items-center gap-2">
                              View Details
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            // No Results
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-white/20" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Properties Found</h3>
              <p className="text-white/50 mb-6">Try adjusting your filters or search criteria</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-16">
              <button
                onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))}
                disabled={pagination.currentPage === 1}
                className="w-12 h-12 rounded-xl glass flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination(p => ({ ...p, currentPage: pageNum }))}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-medium transition-all ${
                        pagination.currentPage === pageNum
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                          : 'glass text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(p.totalPages, p.currentPage + 1) }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="w-12 h-12 rounded-xl glass flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="relative p-12 rounded-3xl glass overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  Can't Find What You're Looking For?
                </h2>
                <p className="text-white/60 text-lg">
                  Let our experts help you find your perfect property
                </p>
              </div>
              
              <div className="flex gap-4">
                <Link to="/contact" className="btn-primary">
                  <Phone className="w-5 h-5 mr-2 inline" />
                  Contact Us
                </Link>
                <a href="tel:+8801730150390" className="btn-outline">
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2025 Sardar Real Estate. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-white/40">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/properties" className="hover:text-white transition-colors">Properties</Link>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PropertiesUltra;
