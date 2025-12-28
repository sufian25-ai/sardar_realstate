// src/pages/HomeEnhanced.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, MapPin, Bed, Bath, Square, ArrowRight, Star, TrendingUp, Shield, Award, ChevronLeft, ChevronRight, Phone, Mail, Building2, Users, Trophy, CheckCircle } from 'lucide-react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import EMICalculator from '../components/EMICalculator';
import AnimatedSection from '../components/AnimatedSection';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const HomeEnhanced = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const statsRef = useRef(null);
  
  const [searchFilters, setSearchFilters] = useState({
    type: '',
    city_id: '',
    state_id: '',
    min_price: '',
    max_price: ''
  });

  const [statsInView, setStatsInView] = useState(false);
  const { ref: statsObserverRef, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) setStatsInView(true);
  }, [inView]);

  const heroSlides = [
    {
      image: '/assets/hero-1.jpg',
      title: 'Discover Your Dream Home',
      subtitle: 'Premium properties in prime locations across the country',
      buttonText: 'Explore Properties'
    },
    {
      image: '/assets/hero-4.jpg',
      title: 'Luxury Living Awaits',
      subtitle: 'Experience world-class amenities and modern architecture',
      buttonText: 'View Luxury Collection'
    },
    {
      image: '/assets/hero-3.jpg',
      title: 'Smart Investment Opportunities',
      subtitle: 'High-return commercial and residential properties',
      buttonText: 'Investment Properties'
    }
  ];

  const services = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Residential Sales',
      description: 'Find your perfect home from our extensive collection of residential properties.',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Apartments', 'Villas', 'Townhouses']
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Commercial Leasing',
      description: 'Premium commercial spaces for offices, retail, and business establishments.',
      gradient: 'from-purple-500 to-pink-500',
      features: ['Office Spaces', 'Retail Shops', 'Warehouses']
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Property Investment',
      description: 'Smart investment opportunities with high returns in prime locations.',
      gradient: 'from-orange-500 to-red-500',
      features: ['ROI Analysis', 'Market Insights', 'Portfolio']
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Legal Support',
      description: 'Complete legal assistance and documentation for property transactions.',
      gradient: 'from-green-500 to-emerald-500',
      features: ['Documentation', 'Registration', 'Consultation']
    }
  ];

  const [stats, setStats] = useState([
    { number: 0, target: 500, label: 'Properties Listed', icon: <Building2 />, gradient: 'from-blue-600 to-cyan-600', suffix: '+' },
    { number: 0, target: 2000, label: 'Happy Clients', icon: <Users />, gradient: 'from-purple-600 to-pink-600', suffix: '+' },
    { number: 0, target: 150, label: 'Expert Agents', icon: <Star />, gradient: 'from-orange-600 to-red-600', suffix: '+' },
    { number: 0, target: 50, label: 'Awards Won', icon: <Trophy />, gradient: 'from-green-600 to-emerald-600', suffix: '+' }
  ]);

  const whyChooseUs = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Verified Properties',
      description: 'All properties are verified and authenticated'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Transactions',
      description: 'Safe and transparent payment process'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Expert Guidance',
      description: 'Professional support throughout your journey'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Best Prices',
      description: 'Competitive pricing and great deals'
    }
  ];

  // GSAP Animations
  useEffect(() => {
    // Hero title animation
    const tl = gsap.timeline({ delay: 0.5 });
    tl.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })
    .from('.hero-subtitle', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5')
    .from('.hero-buttons', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.4');

    // Floating animation for search bar
    gsap.to('.search-card', {
      y: -5,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }, [isLoading]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertiesRes = await api.get('/properties', {
          params: { featured: true, status: 'available' }
        });
        
        if (propertiesRes.data.status === 'success') {
          setFeaturedProperties(propertiesRes.data.data.data.slice(0, 6));
        }

        const statesRes = await api.get('/states', {
          params: { active: true }
        });
        
        if (statesRes.data.status === 'success') {
          setStates(statesRes.data.data.data);
        }

        const citiesRes = await api.get('/cities', {
          params: { active: true }
        });
        
        if (citiesRes.data.status === 'success') {
          setCities(citiesRes.data.data.data);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setFeaturedProperties([]);
      } finally {
        setTimeout(() => setIsLoading(false), 1500);
      }
    };

    fetchData();
  }, []);

  // Auto slide change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.keys(searchFilters).forEach(key => {
      if (searchFilters[key]) params.append(key, searchFilters[key]);
    });
    window.location.href = `/properties?${params.toString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white to-blue-200 rounded-full animate-ping opacity-20"></div>
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center animate-bounce">
              <Building2 className="w-16 h-16 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Loading Sardar Estate</h2>
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <WhatsAppButton />
      <EMICalculator />

      {/* Hero Section with GSAP */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
            <img 
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              onError={(e) => e.target.src = '/assets/placeholder.jpg'}
            />
            {/* Animated overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-purple-900/30 z-10 animate-pulse"></div>
          </div>
        ))}

        <div className="relative z-20 container mx-auto h-full flex items-center px-6">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center space-x-3 hero-subtitle">
              <div className="h-1 w-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              <span className="text-white/90 font-bold text-lg tracking-wide">PREMIUM REAL ESTATE</span>
            </div>
            
            <h1 ref={titleRef} className="hero-title text-7xl md:text-8xl font-black mb-6 leading-tight">
              <span className="text-white drop-shadow-2xl">
                {heroSlides[currentSlide].title.split(' ').slice(0, -2).join(' ')}
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">
                {heroSlides[currentSlide].title.split(' ').slice(-2).join(' ')}
              </span>
            </h1>
            
            <p className="hero-subtitle text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl font-medium">
              {heroSlides[currentSlide].subtitle}
            </p>
            
            <div className="hero-buttons flex flex-wrap gap-4">
              <Link 
                to="/properties" 
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl font-bold text-white text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {heroSlides[currentSlide].buttonText}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              <button className="px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl font-bold text-white text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1">
                <Phone className="w-5 h-5" />
                Contact Us
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap gap-8 hero-subtitle">
              {whyChooseUs.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white/90">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-semibold">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button 
          className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 flex items-center justify-center bg-white/10 backdrop-blur-xl hover:bg-white/20 border-2 border-white/20 text-white rounded-2xl transition-all duration-300 hover:scale-110 group"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 flex items-center justify-center bg-white/10 backdrop-blur-xl hover:bg-white/20 border-2 border-white/20 text-white rounded-2xl transition-all duration-300 hover:scale-110 group"
          onClick={nextSlide}
        >
          <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex space-x-4">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`transition-all duration-500 rounded-full ${
                index === currentSlide 
                  ? 'w-16 h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg' 
                  : 'w-4 h-4 bg-white/40 hover:bg-white/60'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section with Counter */}
      <section ref={combineRefs(statsRef, statsObserverRef)} className="relative -mt-24 z-30 pb-24">
        <div className="container mx-auto px-6">
          <AnimatedSection animation="scale">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 md:p-16 border-2 border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group cursor-pointer">
                    <div className={`inline-flex w-16 h-16 mb-4 bg-gradient-to-br ${stat.gradient} rounded-2xl items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                    <div className={`text-6xl font-black mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {statsInView && (
                        <CountUp end={stat.target} duration={2.5} suffix={stat.suffix} />
                      )}
                    </div>
                    <div className="text-gray-700 font-bold text-lg">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Search Section */}
      <AnimatedSection animation="fadeUp">
        <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-200/40 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-200/40 to-transparent rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 rounded-full mb-6">
                  <Search className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white tracking-wide">FIND YOUR PROPERTY</span>
                </div>
                <h2 className="text-6xl font-black mb-6">
                  <span className="text-gray-900">Search Your</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"> Perfect Home</span>
                </h2>
                <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                  Explore thousands of verified properties with our advanced search filters
                </p>
              </div>
              
              <div className="search-card bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-white/50 p-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      Property Type
                    </label>
                    <select 
                      name="type"
                      value={searchFilters.type}
                      onChange={handleSearchChange}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white text-gray-700 font-medium hover:border-gray-300"
                    >
                      <option value="">All Types</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="House">House</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Land">Land</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      State
                    </label>
                    <select 
                      name="state_id"
                      value={searchFilters.state_id}
                      onChange={handleSearchChange}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white text-gray-700 font-medium hover:border-gray-300"
                    >
                      <option value="">All States</option>
                      {states.map(state => (
                        <option key={state.sid} value={state.sid}>{state.sname}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-pink-600" />
                      City
                    </label>
                    <select 
                      name="city_id"
                      value={searchFilters.city_id}
                      onChange={handleSearchChange}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300 bg-white text-gray-700 font-medium hover:border-gray-300"
                    >
                      <option value="">All Cities</option>
                      {cities.map(city => (
                        <option key={city.cid} value={city.cid}>{city.cname}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button 
                      onClick={handleSearch}
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3 group"
                    >
                      <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-lg">Search Now</span>
                    </button>
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="pt-6 border-t-2 border-gray-100">
                  <div className="text-sm font-bold text-gray-600 mb-3">Quick Search:</div>
                  <div className="flex flex-wrap gap-3">
                    {['Apartment', 'Villa', 'Commercial', 'Land'].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSearchFilters(prev => ({ ...prev, type }));
                          handleSearch();
                        }}
                        className="px-5 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 text-gray-700 hover:text-blue-700 font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Featured Properties */}
      <AnimatedSection animation="fadeUp">
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100 to-transparent rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-20">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-5 py-2 rounded-full mb-6">
                <Star className="w-4 h-4 text-white fill-current" />
                <span className="text-sm font-bold text-white tracking-wide">FEATURED LISTINGS</span>
              </div>
              <h2 className="text-6xl font-black mb-6">
                <span className="text-gray-900">Handpicked</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Premium Properties</span>
              </h2>
              <p className="text-gray-600 text-xl leading-relaxed">
                Discover our carefully curated collection of luxury properties that redefine modern living
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProperties.length > 0 ? featuredProperties.map((property, idx) => (
                <div 
                  key={property.pid} 
                  className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-transparent hover:-translate-y-2"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="relative overflow-hidden h-72">
                    <img 
                      src={property.pimage ? `http://localhost:8000/${property.pimage}` : '/assets/placeholder.jpg'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={property.title}
                      onError={(e) => e.target.src = '/assets/placeholder.jpg'}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {property.featured && (
                      <div className="absolute top-5 left-5">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl">
                          <Star className="w-4 h-4 fill-current" />
                          Featured
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute top-5 right-5">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm">
                        {property.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 line-clamp-2">
                      {property.title}
                    </h3>
                    
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                      ${property.price?.toLocaleString()}
                    </div>
                    
                    <p className="text-gray-600 mb-6 flex items-center font-medium">
                      <MapPin className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{property.location}</span>
                    </p>
                    
                    <div className="flex justify-between items-center pt-6 border-t-2 border-gray-100 mb-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Bed className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-bold">{property.bedroom || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Bath className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="font-bold">{property.bathroom || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                          <Square className="w-5 h-5 text-pink-600" />
                        </div>
                        <span className="font-bold">{property.size || 'N/A'}</span>
                      </div>
                    </div>

                    <Link 
                      to={`/properties/${property.pid}`}
                      className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center transform hover:-translate-y-1"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="col-span-3 text-center py-20">
                  <div className="text-8xl mb-6">🏠</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Properties Available</h3>
                  <p className="text-gray-600 text-lg mb-8">Check back soon for new listings</p>
                  <Link 
                    to="/properties" 
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    <span>Browse All Properties</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </div>

            {featuredProperties.length > 0 && (
              <div className="text-center mt-16">
                <Link 
                  to="/properties" 
                  className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
                >
                  <span>View All Properties</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* Services Section */}
      <AnimatedSection animation="fadeUp">
        <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-20">
              <h2 className="text-6xl font-black text-white mb-6">
                Our Premium Services
              </h2>
              <p className="text-blue-100 text-xl leading-relaxed">
                Comprehensive real estate solutions designed to exceed your expectations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
                  
                  <div className={`w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl`}>
                    <div className="text-white">
                      {service.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-blue-100 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-blue-200 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Why Choose Us */}
      <AnimatedSection animation="fadeUp">
        <section className="py-24 bg-gradient-to-br from-white via-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-5xl font-black mb-6">
                <span className="text-gray-900">Why Choose</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Sardar Estate</span>
              </h2>
              <p className="text-gray-600 text-xl">Your trusted partner in finding the perfect property</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseUs.map((item, idx) => (
                <div key={idx} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Sardar Estate</h3>
                  <p className="text-sm text-gray-400">Premium Properties</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Your trusted partner in real estate with over 15 years of experience in providing premium property solutions.
              </p>
              <div className="flex space-x-4">
                {[
                  { name: 'Facebook', color: 'from-blue-600 to-blue-700' },
                  { name: 'Twitter', color: 'from-cyan-600 to-cyan-700' },
                  { name: 'Instagram', color: 'from-pink-600 to-pink-700' },
                  { name: 'LinkedIn', color: 'from-purple-600 to-purple-700' }
                ].map((social, i) => (
                  <a 
                    key={social.name}
                    href="#" 
                    className={`w-12 h-12 bg-gradient-to-br ${social.color} hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl`}
                    aria-label={social.name}
                  >
                    <span className="text-xl">{i === 0 ? 'f' : i === 1 ? 't' : i === 2 ? 'i' : 'in'}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-4">
              <h5 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                Quick Links
              </h5>
              <ul className="space-y-3">
                {['Properties', 'Services', 'About Us', 'Contact', 'Blog', 'Careers'].map((link) => (
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
            
            {/* Contact Info */}
            <div className="space-y-4">
              <h5 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                Contact Info
              </h5>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start space-x-3 group hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-600/30 transition-colors">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Phone</div>
                    <div>+880 1234-567890</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3 group hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-purple-600/30 transition-colors">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Email</div>
                    <div>info@sardarestate.com</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3 group hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-pink-600/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-pink-600/30 transition-colors">
                    <MapPin className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Address</div>
                    <div>Gulshan Avenue, Dhaka</div>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Newsletter */}
            <div className="space-y-4">
              <h5 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                Newsletter
              </h5>
              <p className="text-gray-400 mb-4">Subscribe for exclusive property updates and offers</p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white placeholder-gray-500 transition-all duration-300"
                />
                <button className="w-full px-5 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-center md:text-left">
                &copy; 2024 Sardar Real Estate. All rights reserved.
              </p>
              <div className="flex space-x-8 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper function to combine refs
function combineRefs(...refs) {
  return (element) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(element);
      } else {
        ref.current = element;
      }
    });
  };
}

export default HomeEnhanced;
