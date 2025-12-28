import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Phone, Mail, ChevronLeft, ChevronRight, Play, ArrowRight, Building2, Home as HomeIcon, Landmark, Map, ArrowUpRight } from 'lucide-react';
import api from '../services/api';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const HomeNavana = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPropertySlide, setCurrentPropertySlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('residential');
  const [isLoading, setIsLoading] = useState(true);
  const propertySliderRef = useRef(null);
  
  // Drag/Swipe state for property slider
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Stats animation
  const { ref: statsRef, inView: statsInView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  // Hero slides
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920',
      title: 'BROADEN LIFE',
      subtitle: 'BOUNDARIES',
      project: 'Sardar Heights Gulshan'
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920',
      title: 'LUXURY',
      subtitle: 'REDEFINED',
      project: 'Sardar Tower Banani'
    },
    {
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920',
      title: 'MODERN',
      subtitle: 'LIVING',
      project: 'Sardar Residence Dhanmondi'
    }
  ];

  const categories = [
    { id: 'residential', name: 'Residential', icon: <HomeIcon className="w-5 h-5" /> },
    { id: 'commercial', name: 'Commercial', icon: <Landmark className="w-5 h-5" /> },
    { id: 'condominium', name: 'Condominium', icon: <Building2 className="w-5 h-5" /> },
    { id: 'land', name: 'Land', icon: <Map className="w-5 h-5" /> }
  ];

  const stats = [
    { number: 15, suffix: '+', label: 'Years Of Experience' },
    { number: 235, suffix: '+', label: 'Projects Completed' },
    { number: 5000, suffix: '+', label: 'Units Delivered' },
    { number: 1200, suffix: '+', label: 'Happy Families' }
  ];

  const values = [
    { num: '01', title: 'Quality', desc: 'We maintain the highest quality standards in every project' },
    { num: '02', title: 'Design', desc: 'Innovative architectural designs that stand out' },
    { num: '03', title: 'Reliability', desc: 'Trusted by thousands of families across the city' },
    { num: '04', title: 'Experience', desc: 'Decades of experience in real estate development' }
  ];

  useEffect(() => {
    fetchProperties();
    
    // Auto slide
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/properties', {
        params: { status: 'available' }
      });
      
      let propertiesData = [];
      if (response.data.data && response.data.data.data) {
        propertiesData = response.data.data.data;
      } else if (Array.isArray(response.data.data)) {
        propertiesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        propertiesData = response.data;
      }
      
      setFeaturedProperties(propertiesData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setIsLoading(false);
    }
  };

  // Filter properties - show all if no exact match or show by type
  const filteredProperties = featuredProperties.filter(p => {
    const type = p.type?.toLowerCase();
    if (activeCategory === 'residential') return type === 'residential' || type === 'apartment' || type === 'house';
    if (activeCategory === 'commercial') return type === 'commercial' || type === 'office' || type === 'shop';
    if (activeCategory === 'condominium') return type === 'condominium' || type === 'condo';
    if (activeCategory === 'land') return type === 'land' || type === 'plot';
    return true;
  });
  
  // If no properties match, show all
  const displayProperties = filteredProperties.length > 0 ? filteredProperties : featuredProperties;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Property slider navigation
  const nextPropertySlide = () => {
    setCurrentPropertySlide((prev) => 
      prev >= displayProperties.length - 3 ? 0 : prev + 1
    );
  };
  
  const prevPropertySlide = () => {
    setCurrentPropertySlide((prev) => 
      prev <= 0 ? Math.max(0, displayProperties.length - 3) : prev - 1
    );
  };

  // Drag/Swipe handlers for property slider
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
    setDragOffset(0);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // If dragged more than 80px, change slide
    if (dragOffset < -80) {
      nextPropertySlide();
    } else if (dragOffset > 80) {
      prevPropertySlide();
    }
    setDragOffset(0);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-black">S</span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-wider text-white">SARDAR</span>
                <span className="block text-[10px] tracking-[0.3em] text-amber-500 uppercase">Real Estate</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              <Link to="/" className="text-white/80 hover:text-amber-500 transition-colors font-medium tracking-wide">Home</Link>
              <Link to="/about" className="text-white/80 hover:text-amber-500 transition-colors font-medium tracking-wide">About</Link>
              <Link to="/properties" className="text-white/80 hover:text-amber-500 transition-colors font-medium tracking-wide">Projects</Link>
              <Link to="/contact" className="text-white/80 hover:text-amber-500 transition-colors font-medium tracking-wide">Contact</Link>
            </div>

            <div className="flex items-center gap-4">
              <a href="tel:+8801730150390" className="hidden md:flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="font-medium">01730-150390</span>
              </a>
              <Link to="/login" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-all">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen Slider */}
      <section className="relative h-screen">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[10s]"
              style={{
                backgroundImage: `url('${slide.image}')`,
                transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          </div>
        ))}

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-3xl">
              <h1 className="text-7xl md:text-9xl font-black leading-none tracking-tight">
                <span className="block text-white">{heroSlides[currentSlide].title}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </h1>
              <p className="mt-6 text-xl text-white/60">{heroSlides[currentSlide].project}</p>
              
              <div className="mt-10 flex gap-4">
                <Link
                  to="/properties"
                  className="group px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-all flex items-center gap-3"
                >
                  Explore Projects
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="px-8 py-4 border-2 border-white/30 hover:border-amber-500 text-white font-bold rounded-lg transition-all flex items-center gap-3">
                  <Play className="w-5 h-5" />
                  Watch Video
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button onClick={prevSlide} className="w-12 h-12 border border-white/30 hover:border-amber-500 rounded-full flex items-center justify-center transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-amber-500' : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
          <button onClick={nextSlide} className="w-12 h-12 border border-white/30 hover:border-amber-500 rounded-full flex items-center justify-center transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 right-10 flex flex-col items-center gap-2">
          <span className="text-xs tracking-widest text-white/50 rotate-90 origin-center translate-y-8">SCROLL</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-amber-500 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Explore Properties Section - Navana Style */}
      <section className="py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6">
          
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            EXPLORE YOUR <span className="text-pink-500">PROPERTY</span>
          </h2>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Side - Description & Categories */}
            <div className="lg:w-[320px] flex-shrink-0">
              <p className="text-white/60 text-lg mb-10 leading-relaxed">
                Delivering iconic residential, commercial, condominium and land properties. More than 100 projects are ongoing at the moment.
              </p>

              {/* Category Buttons - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setCurrentPropertySlide(0);
                    }}
                    className={`px-6 py-3 rounded-lg font-medium transition-all text-sm ${
                      activeCategory === cat.id
                        ? 'bg-pink-500 text-white'
                        : 'bg-transparent border border-white/30 text-white hover:border-pink-500'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="flex gap-3">
                <button 
                  onClick={prevPropertySlide}
                  className="w-12 h-12 border border-white/30 hover:border-pink-500 rounded-lg flex items-center justify-center transition-all hover:bg-white/5"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextPropertySlide}
                  className="w-12 h-12 border border-white/30 hover:border-pink-500 rounded-lg flex items-center justify-center transition-all hover:bg-white/5"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Side - Property Cards Slider */}
            <div 
              className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              {isLoading ? (
                <div className="flex gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-[280px] flex-shrink-0 animate-pulse">
                      <div className="h-[400px] bg-white/10 rounded-lg"></div>
                      <div className="h-6 bg-white/10 rounded mt-4 w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : displayProperties.length > 0 ? (
                <div 
                  className={`flex gap-6 ${isDragging ? '' : 'transition-transform duration-500 ease-out'}`}
                  style={{
                    transform: `translateX(${-currentPropertySlide * 296 + dragOffset}px)`,
                    userSelect: 'none'
                  }}
                >
                  {displayProperties.map((property, index) => (
                    <Link
                      key={property.id}
                      to={`/properties/${property.id}`}
                      className="w-[280px] flex-shrink-0 group"
                      onClick={(e) => {
                        // Prevent navigation if we were dragging
                        if (Math.abs(dragOffset) > 5) {
                          e.preventDefault();
                        }
                      }}
                      draggable={false}
                    >
                      {/* Property Image Card */}
                      <div className="relative h-[400px] rounded-lg overflow-hidden">
                        <img
                          src={property.pimage 
                            ? `http://localhost:8000/${property.pimage}` 
                            : `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800`}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                          draggable={false}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Location Badge */}
                        <div className="absolute bottom-4 left-4">
                          <span className="px-4 py-1.5 bg-pink-500 text-white text-sm font-medium rounded">
                            {property.city?.cname || property.address?.split(',')[0] || 'Dhaka'}
                          </span>
                        </div>
                      </div>

                      {/* Property Title */}
                      <h3 className="text-white text-lg font-semibold mt-4 group-hover:text-pink-500 transition-colors">
                        {property.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-white/50 text-xl">No properties found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16">
            REDEFINE <span className="text-amber-500">LIVING STANDARDS</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-8 bg-white/5 hover:bg-amber-500/10 rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all duration-500 group"
              >
                <span className="text-6xl font-black text-amber-500/30 group-hover:text-amber-500/50 transition-colors">
                  {value.num}
                </span>
                <h3 className="text-2xl font-bold mt-4 mb-3 group-hover:text-amber-500 transition-colors">
                  {value.title}
                </h3>
                <p className="text-white/60">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        ref={statsRef}
        className="py-24 relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16">
            EXPANDING THE <span className="text-amber-500">HORIZON</span>
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-7xl font-black text-amber-500">
                  {statsInView && (
                    <CountUp end={stat.number} duration={2.5} separator="," />
                  )}
                  {stat.suffix}
                </div>
                <p className="text-white/60 mt-2 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Text */}
        <div className="mt-20 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="text-8xl font-black text-white/5 mx-8">
                BROADEN LIFE BOUNDARIES
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-24 bg-gradient-to-br from-amber-500 to-amber-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-black mb-6">
                Interested To Book?
              </h2>
              <p className="text-black/70 text-xl mb-8">
                Please provide your phone number, our representative will contact you within 24 hours.
              </p>

              <form className="flex gap-4">
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="flex-1 px-6 py-4 bg-black/20 backdrop-blur-sm border border-black/20 rounded-xl text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-black/30"
                />
                <button className="px-8 py-4 bg-black text-amber-500 font-bold rounded-xl hover:bg-black/90 transition-colors">
                  Send
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <a href="tel:16254" className="flex items-center gap-4 p-4 bg-black/10 rounded-xl hover:bg-black/20 transition-colors">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-black/60 text-sm">Hotline</p>
                  <p className="text-black font-bold text-xl">16254</p>
                </div>
              </a>

              <a href="mailto:sales@sardar-estate.com" className="flex items-center gap-4 p-4 bg-black/10 rounded-xl hover:bg-black/20 transition-colors">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-black/60 text-sm">Email</p>
                  <p className="text-black font-bold">sales@sardar-estate.com</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-black">S</span>
              </div>
              <span className="text-xl font-bold">SARDAR ESTATE</span>
            </div>

            <div className="flex items-center gap-8 text-white/60">
              <Link to="/about" className="hover:text-amber-500 transition-colors">About</Link>
              <Link to="/properties" className="hover:text-amber-500 transition-colors">Projects</Link>
              <Link to="/contact" className="hover:text-amber-500 transition-colors">Contact</Link>
            </div>

            <p className="text-white/40 text-sm">
              © 2025 Sardar Estate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Add marquee animation style */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HomeNavana;
