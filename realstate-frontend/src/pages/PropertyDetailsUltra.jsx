import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Square, Star, ArrowLeft, Phone, Mail, Calendar,
  Heart, Share2, ChevronLeft, ChevronRight, Check, Home, Building2,
  Car, Shield, Wifi, Dumbbell, Trees, Waves, Play, X, ArrowUpRight,
  Maximize2, Clock, User, MessageCircle
} from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyDetailsUltra = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Inquiry form
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
    }
    window.scrollTo(0, 0);
  }, [id]);

  const fetchPropertyDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await api.get(`/properties/${id}`);
      if (response.data.status === 'success') {
        setProperty(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPropertyImages = () => {
    if (!property) return [];
    const images = [];
    if (property.pimage) images.push(property.pimage);
    if (property.pimage1) images.push(property.pimage1);
    if (property.pimage2) images.push(property.pimage2);
    if (property.pimage3) images.push(property.pimage3);
    if (property.pimage4) images.push(property.pimage4);
    return images.length > 0 ? images : ['default-property.jpg'];
  };

  const images = getPropertyImages();

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const amenities = [
    { icon: <Car className="w-5 h-5" />, name: 'Parking', available: true },
    { icon: <Shield className="w-5 h-5" />, name: '24/7 Security', available: true },
    { icon: <Wifi className="w-5 h-5" />, name: 'High-Speed WiFi', available: true },
    { icon: <Dumbbell className="w-5 h-5" />, name: 'Gym', available: property?.amenities?.includes('gym') },
    { icon: <Waves className="w-5 h-5" />, name: 'Swimming Pool', available: property?.amenities?.includes('pool') },
    { icon: <Trees className="w-5 h-5" />, name: 'Garden', available: property?.amenities?.includes('garden') },
  ];

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/inquiries', {
        ...inquiryForm,
        property_id: id
      });
      alert('Inquiry submitted successfully! We will contact you soon.');
      setShowInquiry(false);
      setInquiryForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
            <Building2 className="w-10 h-10 text-white/30" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Property Not Found</h2>
          <p className="text-white/50 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/properties" className="btn-primary">
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-lg">SARDAR</h1>
                  <p className="text-xs text-indigo-400">REAL ESTATE</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-10 h-10 rounded-xl glass flex items-center justify-center transition-all ${
                  isFavorite ? 'text-red-500' : 'text-white/70 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/70 hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <a href="tel:+8801730150390" className="btn-primary py-2 px-4 text-sm hidden sm:flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== IMAGE GALLERY ===== */}
      <section className="pt-20">
        <div className="relative h-[60vh] md:h-[70vh]">
          {/* Main Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img
                src={images[currentImageIndex] 
                  ? `http://localhost:8000/${images[currentImageIndex]}` 
                  : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920'}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/50" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl glass flex items-center justify-center hover:bg-white/20 transition-all group"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl glass flex items-center justify-center hover:bg-white/20 transition-all group"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}

          {/* Thumbnail Strip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            {images.slice(0, 5).map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  currentImageIndex === index ? 'border-indigo-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={`http://localhost:8000/${img}`}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {images.length > 5 && (
              <button
                onClick={() => setShowGallery(true)}
                className="w-16 h-16 rounded-xl glass flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <span className="text-sm font-medium">+{images.length - 5}</span>
              </button>
            )}
          </div>

          {/* View All Button */}
          <button
            onClick={() => setShowGallery(true)}
            className="absolute bottom-6 right-6 px-4 py-2 rounded-xl glass flex items-center gap-2 hover:bg-white/20 transition-all text-sm"
          >
            <Maximize2 className="w-4 h-4" />
            View All Photos
          </button>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="relative -mt-20 z-10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card-premium p-8 mb-8"
              >
                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="px-4 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 text-sm font-medium uppercase">
                    {property.type || 'Property'}
                  </span>
                  {property.stype && (
                    <span className="px-4 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-medium capitalize">
                      For {property.stype}
                    </span>
                  )}
                  <span className="px-4 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium capitalize">
                    {property.status || 'Available'}
                  </span>
                </div>

                {/* Title & Location */}
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{property.title}</h1>
                <p className="text-white/60 flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  {property.address || property.city?.cname || 'Dhaka, Bangladesh'}
                </p>

                {/* Price & Features */}
                <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-white/50 text-sm mb-1">Price</p>
                    <div className="text-3xl md:text-4xl font-bold text-gradient-gold">
                      ৳{Number(property.price || 0).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-8">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                        <Bed className="w-6 h-6 text-indigo-400" />
                        {property.bedrooms || 0}
                      </div>
                      <p className="text-white/50 text-sm">Bedrooms</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                        <Bath className="w-6 h-6 text-indigo-400" />
                        {property.bathrooms || 0}
                      </div>
                      <p className="text-white/50 text-sm">Bathrooms</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                        <Square className="w-6 h-6 text-indigo-400" />
                        {property.area || 0}
                      </div>
                      <p className="text-white/50 text-sm">Sq. Ft.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tabs */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {['overview', 'amenities', 'location'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                        : 'glass text-white/60 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && (
                  <div className="card-premium p-8">
                    <h2 className="text-2xl font-bold mb-4">Property Description</h2>
                    <p className="text-white/70 leading-relaxed whitespace-pre-line">
                      {property.description || `
This stunning ${property.type || 'property'} offers an exceptional living experience in one of Dhaka's most sought-after locations.

Featuring ${property.bedrooms || 0} spacious bedrooms and ${property.bathrooms || 0} modern bathrooms, this property is perfect for families looking for comfort and convenience.

Key Highlights:
• Prime location with excellent connectivity
• Modern architecture and premium finishes
• Spacious ${property.area || 0} sq.ft. living space
• 24/7 security and parking facilities
• Close to schools, hospitals, and shopping centers

Don't miss this opportunity to own your dream home!
                      `.trim()}
                    </p>

                    {/* Property Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                      <div className="p-4 rounded-xl bg-white/5">
                        <p className="text-white/50 text-sm mb-1">Property ID</p>
                        <p className="font-semibold">#{property.id}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5">
                        <p className="text-white/50 text-sm mb-1">Property Type</p>
                        <p className="font-semibold capitalize">{property.type || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5">
                        <p className="text-white/50 text-sm mb-1">Status</p>
                        <p className="font-semibold capitalize">{property.status || 'Available'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5">
                        <p className="text-white/50 text-sm mb-1">Floor</p>
                        <p className="font-semibold">{property.floor || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5">
                        <p className="text-white/50 text-sm mb-1">Facing</p>
                        <p className="font-semibold capitalize">{property.facing || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5">
                        <p className="text-white/50 text-sm mb-1">Year Built</p>
                        <p className="font-semibold">{property.year_built || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div className="card-premium p-8">
                    <h2 className="text-2xl font-bold mb-6">Amenities & Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-4 rounded-xl ${
                            amenity.available ? 'bg-indigo-500/10 text-white' : 'bg-white/5 text-white/30'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            amenity.available ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10'
                          }`}>
                            {amenity.icon}
                          </div>
                          <span className="font-medium">{amenity.name}</span>
                          {amenity.available && <Check className="w-4 h-4 text-green-400 ml-auto" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div className="card-premium p-8">
                    <h2 className="text-2xl font-bold mb-6">Location</h2>
                    <div className="rounded-xl overflow-hidden h-80 bg-white/5 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                        <p className="text-white/60">{property.address || 'Dhaka, Bangladesh'}</p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address || 'Dhaka')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mt-4"
                        >
                          View on Google Maps
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                
                {/* Contact Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="card-premium p-6"
                >
                  <h3 className="text-xl font-bold mb-6">Interested in this property?</h3>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowInquiry(true)}
                      className="w-full btn-primary py-4 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Send Inquiry
                    </button>
                    
                    <a
                      href="tel:+8801730150390"
                      className="w-full btn-outline py-4 flex items-center justify-center gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      Call: 01730-150390
                    </a>
                    
                    <a
                      href={`https://wa.me/8801730150390?text=Hi, I'm interested in ${property.title} (ID: ${property.id})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </div>

                  {/* Agent Info */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                        S
                      </div>
                      <div>
                        <h4 className="font-semibold">Sardar Real Estate</h4>
                        <p className="text-white/50 text-sm">Trusted Partner Since 2007</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Schedule Visit */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="card-premium p-6"
                >
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    Schedule a Visit
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    Book a site visit and see the property in person
                  </p>
                  <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-medium">
                    Request Visit
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SIMILAR PROPERTIES ===== */}
      <section className="py-20 border-t border-white/10 mt-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">Similar Properties</h2>
            <Link to="/properties" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="card-premium group">
                <div className="h-48 bg-white/5 rounded-t-3xl overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-160059654281${i}-ffad4c1539a9?w=600`}
                    alt="Similar Property"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold mb-2 group-hover:text-indigo-400 transition-colors">Modern Apartment</h3>
                  <p className="text-white/50 text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Gulshan, Dhaka
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INQUIRY MODAL ===== */}
      <AnimatePresence>
        {showInquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowInquiry(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg card-premium p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Send Inquiry</h3>
                <button
                  onClick={() => setShowInquiry(false)}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    required
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    required
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    required
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 outline-none"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Message</label>
                  <textarea
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    rows={4}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 outline-none resize-none"
                    placeholder={`I'm interested in ${property.title}...`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary py-4 disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== FULLSCREEN GALLERY ===== */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
          >
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-6 w-14 h-14 rounded-2xl glass flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="max-w-5xl max-h-[80vh]">
              <img
                src={`http://localhost:8000/${images[currentImageIndex]}`}
                alt={`Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl"
              />
            </div>

            <button
              onClick={nextImage}
              className="absolute right-6 w-14 h-14 rounded-2xl glass flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentImageIndex === index ? 'bg-indigo-500 w-8' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 text-center text-white/40 text-sm">
          © 2025 Sardar Real Estate. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PropertyDetailsUltra;
