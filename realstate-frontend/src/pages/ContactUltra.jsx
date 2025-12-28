import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, MapPin, Clock, Send, MessageCircle, Building2,
  ArrowRight, CheckCircle2, Globe, ChevronRight, Facebook, Instagram, 
  Twitter, Linkedin, Sparkles, User, AtSign, FileText, ChevronDown
} from 'lucide-react';
import api from '../services/api';

const ContactUltra = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyType: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/feedbacks', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', propertyType: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone',
      details: ['+880 1730-150390', '+880 1700-000000'],
      action: 'tel:+8801730150390',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      details: ['info@sardarrealestate.com', 'sales@sardarrealestate.com'],
      action: 'mailto:info@sardarrealestate.com',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Office',
      details: ['House 123, Road 12', 'Gulshan 2, Dhaka 1212'],
      action: 'https://maps.google.com',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Working Hours',
      details: ['Sat - Thu: 9AM - 8PM', 'Friday: Closed'],
      action: null,
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const faqs = [
    {
      question: 'How do I schedule a property visit?',
      answer: 'You can schedule a visit by calling us, filling out the contact form, or using the "Schedule Visit" button on any property listing.'
    },
    {
      question: 'What documents do I need for renting?',
      answer: 'For renting, you typically need NID copy, passport photos, employment proof, and a reference. Our team will guide you through the process.'
    },
    {
      question: 'Do you help with property registration?',
      answer: 'Yes! We provide end-to-end support including legal documentation, registration, and all paperwork required for property transactions.'
    },
    {
      question: 'What areas do you cover?',
      answer: 'We primarily cover Dhaka including Gulshan, Banani, Dhanmondi, Uttara, Baridhara, and surrounding areas. Contact us for other locations.'
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
                S
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">SARDAR</h1>
                <p className="text-xs text-indigo-400">REAL ESTATE</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-white/70 hover:text-white transition-colors">Home</Link>
              <Link to="/properties" className="text-white/70 hover:text-white transition-colors">Properties</Link>
              <Link to="/about" className="text-white/70 hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="text-indigo-400 font-medium">Contact</Link>
            </div>

            <div className="flex items-center gap-3">
              <a href="tel:+8801730150390" className="btn-primary py-2 px-5 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Call Now</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-[#030712]" />
        </div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-indigo-400 text-sm font-medium mb-6">
              <MessageCircle className="w-4 h-4" />
              Get In Touch
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Let's <span className="text-gradient">Connect</span>
            </h1>
            
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
              Have questions about properties? Ready to buy or sell? 
              Our expert team is here to help you every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== CONTACT INFO CARDS ===== */}
      <section className="py-12 relative -mt-10 z-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.action}
                target={info.action?.startsWith('http') ? '_blank' : undefined}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-6 group hover:scale-105 transition-all cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {info.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-white/50 text-sm">{detail}</p>
                ))}
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="card-premium p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Send Us a Message</h2>
                <p className="text-white/50 mb-8">Fill out the form and we'll get back to you within 24 hours.</p>

                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-white/50 mb-6">Thank you for contacting us. We'll respond soon.</p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="btn-outline px-6 py-3"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Your Name *</label>
                        <div className="relative">
                          <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-indigo-500 outline-none transition-colors"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Email Address *</label>
                        <div className="relative">
                          <AtSign className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-indigo-500 outline-none transition-colors"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-indigo-500 outline-none transition-colors"
                            placeholder="+880 1XXX-XXXXXX"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Property Type</label>
                        <div className="relative">
                          <Building2 className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                          <select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 outline-none transition-colors appearance-none cursor-pointer"
                          >
                            <option value="" className="bg-gray-900">Select Type</option>
                            <option value="apartment" className="bg-gray-900">Apartment</option>
                            <option value="house" className="bg-gray-900">House</option>
                            <option value="villa" className="bg-gray-900">Villa</option>
                            <option value="commercial" className="bg-gray-900">Commercial</option>
                            <option value="land" className="bg-gray-900">Land</option>
                          </select>
                          <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">Subject *</label>
                      <div className="relative">
                        <FileText className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-indigo-500 outline-none transition-colors"
                          placeholder="How can we help you?"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-indigo-500 outline-none resize-none transition-colors"
                        placeholder="Tell us more about your requirements..."
                      />
                    </div>

                    {error && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Map */}
              <div className="card-premium p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  Our Location
                </h3>
                <div className="rounded-xl overflow-hidden h-64 bg-white/5">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.7873246838!2d90.41279321498238!3d23.794774484568493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70c46de8e8d%3A0x7a6c3c5e9c9b5c3e!2sGulshan%202%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    className="grayscale contrast-125 opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <a
                  href="https://maps.google.com/?q=Gulshan+2+Dhaka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  Get Directions
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* WhatsApp */}
              <div className="card-premium p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <h3 className="font-bold text-lg mb-2">Quick Chat on WhatsApp</h3>
                <p className="text-white/50 text-sm mb-4">Get instant responses to your property queries</p>
                <a
                  href="https://wa.me/8801730150390?text=Hi, I'm interested in your properties"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>

              {/* Social Links */}
              <div className="card-premium p-6">
                <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {[
                    { icon: <Facebook className="w-5 h-5" />, href: '#', color: 'hover:bg-blue-500' },
                    { icon: <Instagram className="w-5 h-5" />, href: '#', color: 'hover:bg-pink-500' },
                    { icon: <Twitter className="w-5 h-5" />, href: '#', color: 'hover:bg-sky-500' },
                    { icon: <Linkedin className="w-5 h-5" />, href: '#', color: 'hover:bg-blue-600' },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      className={`w-12 h-12 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white ${social.color} transition-all`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />
        
        <div className="max-w-[900px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-amber-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-gradient-gold">Questions</span>
            </h2>
            <p className="text-white/50">Quick answers to common queries</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <span className="font-semibold pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-indigo-400 flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === index ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-white/60">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card-premium p-12 text-center relative overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your <span className="text-gradient">Perfect Property?</span>
              </h2>
              <p className="text-white/60 text-lg max-w-xl mx-auto mb-8">
                Start browsing our exclusive collection of properties in Dhaka.
              </p>
              <Link
                to="/properties"
                className="btn-primary px-8 py-4 text-lg inline-flex items-center gap-2 group"
              >
                Explore Properties
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-16 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <div>
                  <h1 className="font-bold text-lg">SARDAR</h1>
                  <p className="text-xs text-indigo-400">REAL ESTATE</p>
                </div>
              </Link>
              <p className="text-white/50 mb-6">
                Your trusted partner in Bangladesh real estate since 2007.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {['Home', 'Properties', 'About', 'Contact'].map((link) => (
                  <li key={link}>
                    <Link
                      to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                      className="text-white/50 hover:text-indigo-400 transition-colors flex items-center gap-2"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-bold text-lg mb-6">Services</h3>
              <ul className="space-y-3">
                {['Buy Property', 'Sell Property', 'Rent Property', 'Consultation'].map((service) => (
                  <li key={service} className="text-white/50 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-6">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
                  <span className="text-white/50">House 123, Road 12, Gulshan 2, Dhaka</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-indigo-400" />
                  <a href="tel:+8801730150390" className="text-white/50 hover:text-indigo-400">+880 1730-150390</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <a href="mailto:info@sardarrealestate.com" className="text-white/50 hover:text-indigo-400">info@sardarrealestate.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            © 2025 Sardar Real Estate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactUltra;
