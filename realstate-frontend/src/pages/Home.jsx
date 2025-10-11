// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Search, MapPin, Bed, Bath, Square, ArrowRight, Star, TrendingUp, Shield, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api'; // Import centralized API instance

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    type: '',
    city_id: '',
    state_id: '',
    min_price: '',
    max_price: ''
  });

  // Hero slider images
  const heroSlides = [
    {
      image: '/assets/hero-1.jpg',
      title: 'Welcome to Sardar Estate',
      subtitle: 'Discover the perfect property that matches your lifestyle and budget',
      buttonText: 'Explore Properties'
    },
    {
      image: '/assets/hero-4.jpg',
      title: 'Luxury Apartments',
      subtitle: 'Experience premium living in the heart of the city',
      buttonText: 'View Luxury Collection'
    },
    {
      image: '/assets/hero-3.jpg',
      title: 'Commercial Properties',
      subtitle: 'Prime locations for your business expansion',
      buttonText: 'Commercial Spaces'
    }
  ];

  const services = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Residential Sales',
      description: 'Find your perfect home from our extensive collection of residential properties.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Commercial Leasing',
      description: 'Premium commercial spaces for offices, retail, and business establishments.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Property Investment',
      description: 'Smart investment opportunities with high returns in prime locations.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Legal Support',
      description: 'Complete legal assistance and documentation for property transactions.',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  const [stats, setStats] = useState([
    { number: '0', label: 'Properties Listed', gradient: 'from-blue-600 to-cyan-600' },
    { number: '0', label: 'Happy Clients', gradient: 'from-purple-600 to-pink-600' },
    { number: '0', label: 'Expert Agents', gradient: 'from-orange-600 to-red-600' },
    { number: '0', label: 'Awards Won', gradient: 'from-green-600 to-emerald-600' }
  ]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured properties (public endpoint - no auth needed for homepage)
        const propertiesRes = await api.get('/properties', {
          params: { featured: true, status: 'available' }
        });
        
        if (propertiesRes.data.status === 'success') {
          setFeaturedProperties(propertiesRes.data.data.data.slice(0, 4));
        }

        // Fetch states (public endpoint)
        const statesRes = await api.get('/states', {
          params: { active: true }
        });
        
        if (statesRes.data.status === 'success') {
          setStates(statesRes.data.data.data);
        }

        // Fetch cities (public endpoint)
        const citiesRes = await api.get('/cities', {
          params: { active: true }
        });
        
        if (citiesRes.data.status === 'success') {
          setCities(citiesRes.data.data.data);
        }

        // Fetch stats (total properties count)
        const allPropertiesRes = await api.get('/properties');
        if (allPropertiesRes.data.status === 'success') {
          const totalProperties = allPropertiesRes.data.data.total || 0;
          setStats(prev => [
            { ...prev[0], number: `${totalProperties}+` },
            { ...prev[1], number: '2000+' },
            { ...prev[2], number: '150+' },
            { ...prev[3], number: '50+' }
          ]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        // Set default/empty data on error
        setFeaturedProperties([]);
      } finally {
        setTimeout(() => setIsLoading(false), 2000);
      }
    };

    fetchData();
  }, []);

  // Auto slide change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.keys(searchFilters).forEach(key => {
      if (searchFilters[key]) {
        params.append(key, searchFilters[key]);
      }
    });
    window.location.href = `/properties?${params.toString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-300"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-white to-blue-200 rounded-full animate-ping opacity-20"></div>
              <img 
                src="/assets/logo1.png" 
                alt="Loading..." 
                className="w-32 h-32 animate-spin-slow relative z-10"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Loading Your Dream Properties</h2>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10"></div>
            <img 
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        <div className="relative z-20 container mx-auto h-full flex items-center px-6">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center space-x-2">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <span className="text-white/90 font-medium">Premium Real Estate</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-white">{heroSlides[currentSlide].title.split(' ').slice(0, -2).join(' ')}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                {heroSlides[currentSlide].title.split(' ').slice(-2).join(' ')}
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
              {heroSlides[currentSlide].subtitle}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/properties" 
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl font-semibold text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {heroSlides[currentSlide].buttonText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl font-semibold text-white hover:bg-white/20 transition-all duration-300">
                Watch Video
              </button>
            </div>
          </div>
        </div>

        <button 
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white rounded-full transition-all duration-300 hover:scale-110 group"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button 
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white rounded-full transition-all duration-300 hover:scale-110 group"
          onClick={nextSlide}
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? 'w-12 h-3 bg-gradient-to-r from-blue-500 to-purple-500' 
                  : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-20 z-30 pb-20">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`text-5xl font-black mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/40 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black mb-4">
                <span className="text-gray-900">Find Your</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"> Perfect Property</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover properties that match your dreams with our advanced search tools
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Property Type</label>
                  <select 
                    name="type"
                    value={searchFilters.type}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white text-gray-700 font-medium"
                  >
                    <option value="">Any Type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">State</label>
                  <select 
                    name="state_id"
                    value={searchFilters.state_id}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white text-gray-700 font-medium"
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
                    value={searchFilters.city_id}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300 bg-white text-gray-700 font-medium"
                  >
                    <option value="">Any City</option>
                    {cities.map(city => (
                      <option key={city.cid} value={city.cid}>{city.cname}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button 
                    onClick={handleSearch}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Search Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* Featured Properties */}
<section className="py-20 bg-white relative overflow-hidden">
  <div className="absolute top-20 right-0 w-72 h-72 bg-gradient-to-bl from-blue-100 to-transparent rounded-full blur-3xl"></div>
  <div className="absolute bottom-20 left-0 w-72 h-72 bg-gradient-to-tr from-purple-100 to-transparent rounded-full blur-3xl"></div>
  
  <div className="container mx-auto px-6 relative z-10">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
        <Star className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          FEATURED LISTINGS
        </span>
      </div>
      <h2 className="text-5xl font-black mb-6">
        <span className="text-gray-900">Handpicked</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Premium Properties</span>
      </h2>
      <p className="text-gray-600 text-xl">
        Discover our carefully curated selection of luxury properties
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {featuredProperties.length > 0 ? featuredProperties.map(property => (
        <div key={property.pid} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-transparent">
          <div className="relative overflow-hidden">
            <img 
              src={property.pimage ? `http://localhost:8000/${property.pimage}` : '/assets/placeholder.jpg'}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" 
              alt={property.title}
              onError={(e) => {
                e.target.src = '/assets/placeholder.jpg';
              }}
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
                {property.type}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 line-clamp-2">
              {property.title}
            </h3>
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
              ${property.price?.toLocaleString()}
            </div>
            <p className="text-gray-600 mb-4 flex items-center">
              <MapPin className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{property.location}</span>
            </p>
            
            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
              <div className="flex items-center gap-1 text-gray-700">
                <Bed className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold">{property.bedroom || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <Bath className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-bold">{property.bathroom || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <Square className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-bold">{property.size || 'N/A'}</span>
              </div>
            </div>

            {/* View Details Button */}
            <Link 
              to={`/properties/${property.pid}`}
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center block"
            >
              View Details
            </Link>
          </div>
        </div>
      )) : (
        <div className="col-span-4 text-center py-12">
          <div className="text-6xl mb-4">🏠</div>
          <p className="text-gray-500 text-lg mb-4">No featured properties available at the moment.</p>
          <Link 
            to="/properties" 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            <span>Browse All Properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>

    <div className="text-center mt-12">
      <Link 
        to="/properties" 
        className="group inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
      >
        <span>View All Properties</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </div>
</section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-5xl font-black text-white mb-6">
              Our Premium Services
            </h2>
            <p className="text-blue-100 text-xl">
              Comprehensive real estate solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
                
                <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="text-white">
                    {service.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                  {service.title}
                </h3>
                <p className="text-blue-100 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
        
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-black text-white">S</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Sardar Estate</h3>
                  <p className="text-xs text-gray-400">Premium Properties</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Your trusted partner in real estate with premium property solutions.
              </p>
              <div className="flex space-x-3">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social, i) => (
                  <a 
                    key={social}
                    href="#" 
                    className={`w-10 h-10 bg-gradient-to-br ${
                      i === 0 ? 'from-blue-600 to-blue-700' :
                      i === 1 ? 'from-cyan-600 to-cyan-700' :
                      i === 2 ? 'from-pink-600 to-pink-700' :
                      'from-purple-600 to-purple-700'
                    } hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg`}
                  >
                    <span className="sr-only">{social}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h5 className="text-lg font-bold text-white mb-4">Quick Links</h5>
              <ul className="space-y-3">
                {['Properties', 'Services', 'About Us', 'Contact'].map((link) => (
                  <li key={link}>
                    <a 
                      href={`/${link.toLowerCase().replace(' ', '-')}`} 
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <ArrowRight className="w-4 h-4 text-blue-400 mr-2 group-hover:translate-x-1 transition-transform" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h5 className="text-lg font-bold text-white mb-4">Contact Info</h5>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-400">📞</span>
                  </div>
                  <span>+880 1234-567890</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-400">✉️</span>
                  </div>
                  <span>info@sardarestate.com</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-pink-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-pink-400">📍</span>
                  </div>
                  <span>Gulshan Avenue, Dhaka</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h5 className="text-lg font-bold text-white mb-4">Newsletter</h5>
              <p className="text-gray-400 mb-4">Subscribe for exclusive property updates</p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white placeholder-gray-500 transition-all duration-300"
                />
                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-center md:text-left">
                &copy; 2024 Sardar Real Estate. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style>
        {`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out;
          }
          .delay-100 {
            animation-delay: 0.1s;
          }
          .delay-200 {
            animation-delay: 0.2s;
          }
          .delay-300 {
            animation-delay: 0.3s;
          }
          .animate-spin-slow {
            animation: spin 3s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
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
        `}
      </style>
    </>
  );
};

export default HomePage;