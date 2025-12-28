import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Bed, Bath, Square, Home as HomeIcon, Users, TrendingUp, Award, Mail, Phone, Heart, ChevronDown } from 'lucide-react';
import api from '../services/api';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import Navbar from '../components/Navbar';

const HomeProfessional = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    type: 'Buy or Rent',
    propertyType: 'All Types',
    bedrooms: 'Any Bedrooms',
    bathrooms: 'Any Bathrooms',
    minPrice: '',
    maxPrice: ''
  });

  // Stats animation
  const { ref: statsRef, inView: statsInView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  // Fetch properties
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties', {
        params: { status: 'available' }
      });
      
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      // Handle paginated response - response.data.data.data contains the array
      let propertiesData = [];
      
      if (response.data.data && response.data.data.data) {
        // Paginated response
        propertiesData = response.data.data.data;
      } else if (Array.isArray(response.data.data)) {
        // Direct array in data
        propertiesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Direct array
        propertiesData = response.data;
      }
      
      console.log('Loaded properties:', propertiesData);
      
      // Take first 6 properties for display
      setFeaturedProperties(propertiesData.slice(0, 6));
    } catch (error) {
      console.error('Error fetching properties:', error);
      console.error('Error response:', error.response);
      // Set empty array on error
      setFeaturedProperties([]);
    }
  };

  const stats = [
    { icon: <HomeIcon className="w-8 h-8" />, number: 10000, label: 'Properties Listed', suffix: '+', description: 'Verified listings across the city' },
    { icon: <Users className="w-8 h-8" />, number: 25000, label: 'Happy Customers', suffix: '+', description: 'Satisfied buyers and renters' },
    { icon: <TrendingUp className="w-8 h-8" />, number: 95, label: 'Success Rate', suffix: '%', description: 'Properties sold within 30 days' },
    { icon: <Award className="w-8 h-8" />, number: 15, label: 'Years Experience', suffix: '+', description: 'In the real estate market' }
  ];

  const testimonials = [
    {
      name: 'Emily Rodriguez',
      role: 'First-time Buyer',
      rating: 5,
      text: 'The team helped me find my dream home within my budget. The process was smooth and stress-free. I couldn\'t be happier with my new place!',
      avatar: 'ER'
    },
    {
      name: 'David Thompson',
      role: 'Property Investor',
      rating: 5,
      text: 'Excellent service and market knowledge. They helped me identify great investment opportunities and guided me through multiple purchases.',
      avatar: 'DT'
    },
    {
      name: 'Maria Chen',
      role: 'Commercial Client',
      rating: 5,
      text: 'Professional, knowledgeable, and responsive. They found the perfect office space for our growing business in record time.',
      avatar: 'MC'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[600px] bg-cover bg-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920')"
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream Home
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Discover the perfect property from our extensive collection of luxury apartments and commercial spaces
            </p>

            {/* Search Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-4">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location (City, Area)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    value={searchFilters.location}
                    onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                  />
                </div>
                
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 appearance-none bg-white"
                    value={searchFilters.type}
                    onChange={(e) => setSearchFilters({...searchFilters, type: e.target.value})}
                  >
                    <option>Buy or Rent</option>
                    <option>For Sale</option>
                    <option>For Rent</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 appearance-none bg-white"
                    value={searchFilters.propertyType}
                    onChange={(e) => setSearchFilters({...searchFilters, propertyType: e.target.value})}
                  >
                    <option>All Types</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Apartment</option>
                    <option>House</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Min Price"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  value={searchFilters.minPrice}
                  onChange={(e) => setSearchFilters({...searchFilters, minPrice: e.target.value})}
                />
                
                <input
                  type="text"
                  placeholder="Max Price"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  value={searchFilters.maxPrice}
                  onChange={(e) => setSearchFilters({...searchFilters, maxPrice: e.target.value})}
                />

                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 appearance-none bg-white"
                    value={searchFilters.bedrooms}
                    onChange={(e) => setSearchFilters({...searchFilters, bedrooms: e.target.value})}
                  >
                    <option>Any Bedrooms</option>
                    <option>1+</option>
                    <option>2+</option>
                    <option>3+</option>
                    <option>4+</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 appearance-none bg-white"
                    value={searchFilters.bathrooms}
                    onChange={(e) => setSearchFilters({...searchFilters, bathrooms: e.target.value})}
                  >
                    <option>Any Bathrooms</option>
                    <option>1+</option>
                    <option>2+</option>
                    <option>3+</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Search Button Row */}
              <div className="flex justify-between items-center">
                <button className="text-blue-600 hover:underline font-medium">
                  Advanced Search
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-gray-600">Our track record speaks for itself</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                  <div className="text-blue-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {statsInView && (
                    <CountUp end={stat.number} duration={2.5} separator="," />
                  )}
                  {stat.suffix}
                </div>
                <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                <p className="text-gray-500 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600">Discover our handpicked selection of premium properties</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <div key={property.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group transform hover:-translate-y-2">
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={property.images?.[0] 
                        ? `http://localhost:8000/storage/${property.images[0]}` 
                        : `https://images.unsplash.com/photo-${
                          property.type === 'apartment' ? '1545324418-cc1a3fa10b86' :
                          property.type === 'house' ? '1600596542815-ffad4c1539a9' :
                          property.type === 'commercial' ? '1486406146926-c627a92ad1ab' :
                          '1600585154340-be19' + property.id
                        }?w=800&h=600&fit=crop`}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                        {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                      </span>
                      <span className="bg-gray-900/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg capitalize">
                        {property.type || 'Property'}
                      </span>
                    </div>
                    
                    <button className="absolute top-4 right-4 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all duration-300 shadow-lg group/heart">
                      <Heart className="w-5 h-5 text-gray-600 group-hover/heart:text-red-500 group-hover/heart:fill-red-500 transition-colors" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start gap-2 text-gray-600 mb-3">
                      <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
                      <span className="text-sm line-clamp-1">
                        {property.address || property.city?.name || 'Location not specified'}, {property.state?.name || ''}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </h3>

                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-5">
                      ${Number(property.price || 0).toLocaleString()}
                      {property.listing_type === 'rent' && <span className="text-sm text-gray-500 font-normal">/month</span>}
                    </div>

                    <div className="flex items-center gap-6 text-gray-600 mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Bed className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold">{property.bedrooms || 0} Bed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                          <Bath className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-sm font-semibold">{property.bathrooms || 0} Bath</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                          <Square className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold">{property.area || 0} sqft</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <div className="font-semibold text-gray-800">{property.owner?.name || 'Agent Name'}</div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          +880 1234-567890
                        </div>
                      </div>
                      <Link
                        to={`/properties/${property.id}`}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Loading skeleton cards
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-72 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              View All Properties
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Real stories from satisfied customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Stay Updated with Market Trends</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest property listings, market insights, and investment opportunities delivered to your inbox.
          </p>

          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>

          <p className="text-sm text-blue-100 mt-4">No spam, unsubscribe at any time.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">RealEstate Pro</h3>
              <p className="text-gray-400">Your trusted partner in finding the perfect property.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/properties" className="hover:text-white">Properties</Link></li>
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Buy Property</li>
                <li>Rent Property</li>
                <li>Commercial</li>
                <li>Investment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +880 1234-567890
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@realestate.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 RealEstate Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeProfessional;
