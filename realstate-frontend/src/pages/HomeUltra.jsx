import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Square, Phone, Mail, ChevronLeft, ChevronRight, 
  Play, ArrowRight, Building2, Home as HomeIcon, Landmark, Map, 
  ArrowUpRight, Star, Shield, Award, Users, CheckCircle2, 
  Sparkles, TrendingUp, Clock, Heart
} from 'lucide-react';
import api from '../services/api';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';

const HomeUltra = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPropertySlide, setCurrentPropertySlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const { ref: statsRef, inView: statsInView } = useInView({ threshold: 0.3, triggerOnce: true });
  const { ref: servicesRef, inView: servicesInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: propertiesRef, inView: propertiesInView } = useInView({ threshold: 0.2, triggerOnce: true });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Hero slides - More cinematic
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920',
      video: null,
      title: 'REDEFINE',
      highlight: 'LUXURY',
      subtitle: 'Living',
      description: 'Experience the pinnacle of modern architecture',
      stats: { price: '2.5 Cr', location: 'Gulshan' }
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920',
      video: null,
      title: 'WHERE',
      highlight: 'DREAMS',
      subtitle: 'Come Home',
      description: 'Crafted for those who demand excellence',
      stats: { price: '3.2 Cr', location: 'Banani' }
    },
    {
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920',
      video: null,
      title: 'BEYOND',
      highlight: 'ORDINARY',
      subtitle: 'Spaces',
      description: 'Where innovation meets timeless design',
      stats: { price: '4.5 Cr', location: 'Dhanmondi' }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Projects', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'residential', name: 'Residential', icon: <HomeIcon className="w-5 h-5" /> },
    { id: 'commercial', name: 'Commercial', icon: <Building2 className="w-5 h-5" /> },
    { id: 'land', name: 'Land', icon: <Map className="w-5 h-5" /> }
  ];

  const stats = [
    { number: 18, suffix: '+', label: 'Years Excellence', icon: <Award className="w-8 h-8" /> },
    { number: 350, suffix: '+', label: 'Projects Delivered', icon: <Building2 className="w-8 h-8" /> },
    { number: 8500, suffix: '+', label: 'Happy Families', icon: <Users className="w-8 h-8" /> },
    { number: 15, suffix: 'M+', label: 'Sq.Ft Developed', icon: <TrendingUp className="w-8 h-8" /> }
  ];

  const services = [
    {
      icon: <HomeIcon className="w-10 h-10" />,
      title: 'Premium Residences',
      description: 'Luxury apartments and villas designed for modern families',
      features: ['Smart Home Ready', '24/7 Security', 'Premium Amenities']
    },
    {
      icon: <Building2 className="w-10 h-10" />,
      title: 'Commercial Spaces',
      description: 'State-of-the-art office and retail spaces',
      features: ['Prime Locations', 'Modern Infrastructure', 'High ROI']
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: 'Investment Advisory',
      description: 'Expert guidance for real estate investments',
      features: ['Market Analysis', 'Portfolio Planning', 'Legal Support']
    },
    {
      icon: <Landmark className="w-10 h-10" />,
      title: 'Property Management',
      description: 'Complete property management solutions',
      features: ['Tenant Management', 'Maintenance', 'Rent Collection']
    }
  ];

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/properties?status=available');
        const data = response.data?.data?.data || response.data?.data || response.data || [];
        setFeaturedProperties(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Filter properties
  const filteredProperties = activeCategory === 'all' 
    ? featuredProperties 
    : featuredProperties.filter(p => p.type?.toLowerCase() === activeCategory);
  
  const displayProperties = filteredProperties.length > 0 ? filteredProperties : featuredProperties;

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Navigation
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  
  const nextPropertySlide = () => {
    setCurrentPropertySlide((prev) => prev >= displayProperties.length - 3 ? 0 : prev + 1);
  };
  
  const prevPropertySlide = () => {
    setCurrentPropertySlide((prev) => prev <= 0 ? Math.max(0, displayProperties.length - 3) : prev - 1);
  };

  // Drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    setDragOffset(currentX - startX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -80) nextPropertySlide();
    else if (dragOffset > 80) prevPropertySlide();
    setDragOffset(0);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      
      {/* ===== HERO SECTION - Immersive Full Screen ===== */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full blob-gradient animate-blob opacity-30"
            style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
          />
          <div 
            className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full blob-gradient animate-blob opacity-20"
            style={{ animationDelay: '-4s', transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
          />
        </div>

        {/* Slides */}
        <AnimatePresence mode="wait">
          {heroSlides.map((slide, index) => index === currentSlide && (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {/* Image with Ken Burns effect */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover animate-[kenBurns_20s_ease-in-out_infinite]"
                  style={{
                    animation: 'kenBurns 20s ease-in-out infinite alternate'
                  }}
                />
                {/* Multi-layer gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/30" />
                <div className="absolute inset-0 bg-[#030712]/20" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Text Content */}
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-white/80">New Projects Available</span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-6">
                  <span className="block text-white/90">{heroSlides[currentSlide].title}</span>
                  <span className="block text-gradient">{heroSlides[currentSlide].highlight}</span>
                  <span className="block text-white/60 text-4xl md:text-5xl lg:text-6xl font-light mt-2">
                    {heroSlides[currentSlide].subtitle}
                  </span>
                </h1>

                {/* Description */}
                <p className="text-xl text-white/60 max-w-lg mb-10">
                  {heroSlides[currentSlide].description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/properties"
                    className="group inline-flex items-center gap-3 btn-primary text-lg"
                  >
                    Explore Properties
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="inline-flex items-center gap-3 btn-outline">
                    <Play className="w-5 h-5" />
                    Watch Video
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
                  <div>
                    <div className="text-3xl font-bold text-gradient-gold">
                      {heroSlides[currentSlide].stats.price}
                    </div>
                    <div className="text-sm text-white/50">Starting From</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {heroSlides[currentSlide].stats.location}
                    </div>
                    <div className="text-sm text-white/50">Prime Location</div>
                  </div>
                </div>
              </motion.div>

              {/* Right - Featured Property Card (Desktop) */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  {/* Decorative elements */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 border border-indigo-500/30 rounded-3xl animate-borderGlow" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl" />
                  
                  {/* Card */}
                  <div className="relative glass rounded-3xl p-6 hover-lift">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Featured Project</h3>
                        <p className="text-sm text-white/50">Limited Units Available</p>
                      </div>
                    </div>
                    
                    <img
                      src={heroSlides[currentSlide].image}
                      alt="Featured"
                      className="w-full h-48 object-cover rounded-2xl mb-4"
                    />
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-lg">Sardar Heights</h4>
                        <p className="text-white/50 text-sm flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> Gulshan-2, Dhaka
                        </p>
                      </div>
                      <Link to="/properties" className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
          <button 
            onClick={prevSlide}
            className="w-14 h-14 rounded-full glass hover:bg-white/10 flex items-center justify-center transition-all group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="flex gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentSlide ? 'w-12 bg-gradient-to-r from-indigo-500 to-purple-500' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          
          <button 
            onClick={nextSlide}
            className="w-14 h-14 rounded-full glass hover:bg-white/10 flex items-center justify-center transition-all group"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 right-12 hidden lg:flex flex-col items-center gap-3">
          <span className="text-xs text-white/50 uppercase tracking-widest rotate-90 origin-center translate-y-10">
            Scroll
          </span>
          <div className="w-[1px] h-20 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* ===== STATS SECTION - Floating Cards ===== */}
      <section ref={statsRef} className="relative py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        
        <div className="relative max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative p-8 rounded-3xl glass hover-lift text-center">
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    {stat.icon}
                  </div>
                  
                  {/* Number */}
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {statsInView && (
                      <CountUp
                        end={stat.number}
                        duration={2.5}
                        separator=","
                        suffix={stat.suffix}
                        className="text-gradient"
                      />
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="text-white/60">{stat.label}</div>
                  
                  {/* Decorative corner */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-500/30 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROPERTIES SECTION - Advanced Slider ===== */}
      <section ref={propertiesRef} className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={propertiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16"
          >
            <div>
              <span className="inline-block px-4 py-2 rounded-full glass text-sm text-indigo-400 mb-4">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Featured Properties
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Discover Your <span className="text-gradient">Dream</span> Home
              </h2>
              <p className="text-white/60 text-lg mt-4 max-w-xl">
                Explore our handpicked selection of premium properties across prime locations
              </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setCurrentPropertySlide(0);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'glass text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Properties Slider */}
          <div 
            className="relative cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-3xl overflow-hidden">
                    <div className="skeleton h-80" />
                    <div className="p-6 space-y-4 bg-[#0f172a]">
                      <div className="skeleton h-6 w-3/4" />
                      <div className="skeleton h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayProperties.length > 0 ? (
              <div 
                className={`flex gap-8 ${isDragging ? '' : 'transition-transform duration-500 ease-out'}`}
                style={{
                  transform: `translateX(${-currentPropertySlide * 420 + dragOffset}px)`,
                  userSelect: 'none'
                }}
              >
                {displayProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={propertiesInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-[380px] flex-shrink-0"
                  >
                    <Link
                      to={`/properties/${property.id}`}
                      className="block group"
                      onClick={(e) => Math.abs(dragOffset) > 5 && e.preventDefault()}
                      draggable={false}
                    >
                      <div className="card-premium">
                        {/* Image */}
                        <div className="relative h-72 overflow-hidden">
                          <img
                            src={property.pimage 
                              ? `http://localhost:8000/${property.pimage}` 
                              : `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800`}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            draggable={false}
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
                          
                          {/* Tags */}
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-3 py-1.5 rounded-lg bg-indigo-500/90 text-white text-xs font-semibold uppercase backdrop-blur-sm">
                              {property.type || 'Property'}
                            </span>
                            {property.featured && (
                              <span className="px-3 py-1.5 rounded-lg bg-amber-500/90 text-black text-xs font-semibold flex items-center gap-1 backdrop-blur-sm">
                                <Star className="w-3 h-3" /> Featured
                              </span>
                            )}
                          </div>

                          {/* Favorite Button */}
                          <button className="absolute top-4 right-4 w-10 h-10 rounded-xl glass flex items-center justify-center text-white/70 hover:text-red-500 transition-colors">
                            <Heart className="w-5 h-5" />
                          </button>

                          {/* Price Tag */}
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <div>
                              <div className="text-2xl font-bold text-white">
                                ৳{Number(property.price || 0).toLocaleString()}
                              </div>
                              <div className="text-white/60 text-sm flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {property.city?.cname || 'Dhaka'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {property.title}
                          </h3>

                          {/* Features */}
                          <div className="flex items-center gap-4 text-white/60 text-sm mb-4">
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

                          {/* View Details */}
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <span className="text-indigo-400 font-medium group-hover:text-indigo-300 transition-colors">
                              View Details
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                              <ArrowUpRight className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-white/30" />
                </div>
                <p className="text-white/50 text-xl">No properties found</p>
              </div>
            )}

            {/* Navigation */}
            {displayProperties.length > 3 && (
              <div className="flex justify-center gap-4 mt-12">
                <button 
                  onClick={prevPropertySlide}
                  className="w-14 h-14 rounded-2xl glass hover:bg-white/10 flex items-center justify-center transition-all group"
                >
                  <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={nextPropertySlide}
                  className="w-14 h-14 rounded-2xl glass hover:bg-white/10 flex items-center justify-center transition-all group"
                >
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="inline-flex items-center gap-3 btn-primary text-lg"
            >
              View All Properties
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section ref={servicesRef} className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent" />
        
        <div className="relative max-w-[1400px] mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full glass text-sm text-indigo-400 mb-4">
              <Shield className="w-4 h-4 inline mr-2" />
              What We Offer
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Premium <span className="text-gradient">Services</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Comprehensive real estate solutions tailored to your needs
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full p-8 rounded-3xl glass hover-lift">
                  {/* Icon */}
                  <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300">
                    {service.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  
                  {/* Description */}
                  <p className="text-white/60 mb-6">{service.description}</p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/50">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-8 right-8 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowUpRight className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-3xl overflow-hidden h-48 animate-fadeUp">
                    <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600" alt="Luxury Home" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="rounded-3xl overflow-hidden h-64 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                    <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600" alt="Modern Villa" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-3xl overflow-hidden h-64 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600" alt="Premium Property" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="rounded-3xl overflow-hidden h-48 animate-fadeUp" style={{ animationDelay: '0.6s' }}>
                    <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600" alt="Luxury Interior" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl glass animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">18+</div>
                    <div className="text-white/60 text-sm">Years Experience</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <span className="inline-block px-4 py-2 rounded-full glass text-sm text-indigo-400 mb-6">
                <Star className="w-4 h-4 inline mr-2" />
                Why Choose Us
              </span>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                We Create <span className="text-gradient">Exceptional</span> Living Experiences
              </h2>
              
              <p className="text-white/60 text-lg mb-10">
                With over 18 years of experience, we've helped thousands of families find their perfect home. Our commitment to quality and customer satisfaction sets us apart.
              </p>

              {/* Features List */}
              <div className="space-y-6">
                {[
                  { icon: <Shield className="w-6 h-6" />, title: 'Trusted & Verified', desc: 'All properties legally verified' },
                  { icon: <Clock className="w-6 h-6" />, title: 'Timely Delivery', desc: '99% on-time project completion' },
                  { icon: <Award className="w-6 h-6" />, title: 'Award Winning', desc: 'Multiple industry recognitions' },
                  { icon: <Users className="w-6 h-6" />, title: '24/7 Support', desc: 'Dedicated customer service team' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                      <p className="text-white/50">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link to="/about" className="inline-flex items-center gap-3 btn-primary">
                  Learn More About Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920"
            alt="Luxury Home"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/90 to-[#030712]" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full glass text-sm text-indigo-400 mb-6">
              <Phone className="w-4 h-4 inline mr-2" />
              Get Started Today
            </span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Ready to Find Your <span className="text-gradient">Perfect</span> Home?
            </h2>
            
            <p className="text-white/60 text-xl mb-10">
              Let our experts help you discover the property of your dreams. Schedule a consultation today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary text-lg">
                <Phone className="w-5 h-5 mr-2 inline" />
                Contact Us Now
              </Link>
              <a href="tel:+8801730150390" className="btn-gold text-lg">
                Call: +880 1730-150390
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative pt-24 pb-8 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <div>
                  <h3 className="font-bold text-xl">SARDAR</h3>
                  <p className="text-xs text-indigo-400">REAL ESTATE</p>
                </div>
              </Link>
              <p className="text-white/50 mb-6">
                Creating exceptional living spaces and delivering dreams for over 18 years.
              </p>
              <div className="flex gap-4">
                {['facebook', 'instagram', 'youtube', 'linkedin'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white hover:bg-indigo-500 transition-all">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-current rounded" style={{ mask: `url(/icons/${social}.svg)` }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'Properties', 'About Us', 'Contact'].map((link) => (
                  <li key={link}>
                    <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-white/50 hover:text-indigo-400 transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Property Types */}
            <div>
              <h4 className="font-bold text-lg mb-6">Property Types</h4>
              <ul className="space-y-3">
                {['Residential', 'Commercial', 'Land', 'Rental'].map((type) => (
                  <li key={type}>
                    <Link to="/properties" className="text-white/50 hover:text-indigo-400 transition-colors">
                      {type}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white/50">
                  <MapPin className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                  <span>House #123, Road #45, Gulshan-2, Dhaka-1212</span>
                </li>
                <li className="flex items-center gap-3 text-white/50">
                  <Phone className="w-5 h-5 text-indigo-400" />
                  <a href="tel:+8801730150390" className="hover:text-indigo-400 transition-colors">
                    +880 1730-150390
                  </a>
                </li>
                <li className="flex items-center gap-3 text-white/50">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <a href="mailto:info@sardar.com" className="hover:text-indigo-400 transition-colors">
                    info@sardar.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2025 Sardar Real Estate. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-white/40">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeUltra;
