// src/pages/PropertyDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Star, ArrowLeft, Phone, Mail, Calendar, User, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I am interested in ${property?.title || 'this property'}. Please contact me with more details.`
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  useEffect(() => {
    if (property) {
      setInquiryForm(prev => ({
        ...prev,
        message: `I am interested in ${property.title}. Please contact me with more details.`
      }));
    }
  }, [property]);

  const fetchPropertyDetails = async () => {
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

  const getPropertyImages = (property) => {
    const images = [];
    if (property.pimage) images.push(property.pimage);
    if (property.pimage1) images.push(property.pimage1);
    if (property.pimage2) images.push(property.pimage2);
    if (property.pimage3) images.push(property.pimage3);
    if (property.pimage4) images.push(property.pimage4);
    return images.length > 0 ? images : ['/assets/placeholder.jpg'];
  };

  const handleInputChange = (e) => {
    setInquiryForm({
      ...inquiryForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    
    if (!inquiryForm.name.trim()) {
      setSubmitStatus({ type: 'error', message: 'Name is required!' });
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: inquiryForm.name,
          email: inquiryForm.email || null,
          phone: inquiryForm.phone || null,
          message: inquiryForm.message || null,
          property_id: property.pid,
          status: 'new'
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setSubmitStatus({ type: 'success', message: 'Inquiry sent successfully! We will contact you soon.' });
        setTimeout(() => {
          setInquiryForm({
            name: '',
            email: '',
            phone: '',
            message: `I am interested in ${property.title}. Please contact me with more details.`
          });
          setShowContactForm(false);
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: data.message || 'Failed to send inquiry. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-xl">Loading Property Details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <p className="text-gray-600 text-xl">Property not found.</p>
            <button 
              onClick={() => navigate('/properties')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Properties
            </button>
          </div>
        </div>
      </>
    );
  }

  const images = getPropertyImages(property);

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-6 py-8">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Image Gallery */}
            <div className="relative h-96">
              <img
                src={`http://localhost:8000/${images[currentImageIndex]}`}
                alt={property.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    →
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
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

            {/* Property Details */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-4 mb-4">
                    {property.featured && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        Featured
                      </div>
                    )}
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {property.type}
                    </span>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {property.status}
                    </span>
                  </div>

                  <h1 className="text-4xl font-black text-gray-900 mb-4">
                    {property.title}
                  </h1>

                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                    ${property.price?.toLocaleString()}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-6">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="text-lg">{property.location}</span>
                  </div>

                  {/* Property Features */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                      <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{property.bedroom || 0}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl text-center">
                      <Bath className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{property.bathroom || 0}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-xl text-center">
                      <Square className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{property.size || 'N/A'}</div>
                      <div className="text-sm text-gray-600">Sq Ft</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{property.pcontent}</p>
                  </div>

                  {/* Additional Features */}
                  {property.feature && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Additional Features</h3>
                      <p className="text-gray-600">{property.feature}</p>
                    </div>
                  )}
                </div>

                {/* Sidebar - Contact & Actions */}
                <div className="space-y-6">
                  {/* Contact Agent */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Agent</h3>
                    {property.user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {property.user.name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{property.user.name}</div>
                            <div className="text-sm text-gray-600">Real Estate Agent</div>
                          </div>
                        </div>

                        {/* Contact Agent Buttons */}
                        <div className="space-y-2">
                          <button
                            onClick={() => setShowContactForm(!showContactForm)}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            {showContactForm ? 'Hide Contact Form' : 'Contact Agent'}
                          </button>
                          <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors">
                            <Mail className="w-4 h-4" />
                            Email Agent
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600">Agent information not available.</p>
                    )}
                  </div>

                  {/* Dynamic Contact Form */}
                  {showContactForm && (
                    <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        <h4 className="text-lg font-bold text-gray-900">Send Inquiry</h4>
                      </div>
                      
                      <form onSubmit={handleSubmitInquiry} className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Your Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              name="name"
                              value={inquiryForm.name}
                              onChange={handleInputChange}
                              required
                              placeholder="Enter your full name"
                              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              value={inquiryForm.email}
                              onChange={handleInputChange}
                              placeholder="your.email@example.com"
                              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={inquiryForm.phone}
                              onChange={handleInputChange}
                              placeholder="+880 1XXX-XXXXXX"
                              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Message
                          </label>
                          <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <textarea
                              name="message"
                              value={inquiryForm.message}
                              onChange={handleInputChange}
                              rows="3"
                              placeholder="Tell us about your requirements..."
                              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none text-sm"
                            />
                          </div>
                        </div>

                        {submitStatus && (
                          <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                            submitStatus.type === 'success' 
                              ? 'bg-green-50 text-green-800 border border-green-200' 
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}>
                            {submitStatus.type === 'success' ? (
                              <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            )}
                            <p className="font-medium">{submitStatus.message}</p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowContactForm(false)}
                            disabled={submitting}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                          >
                            {submitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                Send Inquiry
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {property.stype === 'rent' && property.status === 'available' && (
                      <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all">
                        <Calendar className="w-5 h-5" />
                        Book Property
                      </button>
                    )}
                    
                    <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition-colors">
                      Schedule Tour
                    </button>
                  </div>

                  {/* Property Info */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Property Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property ID:</span>
                        <span className="font-bold">{property.pid}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-bold">{property.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-bold capitalize">{property.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Listed For:</span>
                        <span className="font-bold">{property.stype === 'sale' ? 'Sale' : 'Rent'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
      