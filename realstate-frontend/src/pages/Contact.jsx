import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Phone, Mail, MapPin, Clock, Send, Facebook, Twitter, Instagram, Linkedin, Building2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import AnimatedSection from '../components/AnimatedSection';

const Contact = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    gsap.from('.contact-hero', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3,
    });
  }, []);

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone',
      details: ['+880 1234-567890', '+880 9876-543210'],
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      details: ['info@sardarestate.com', 'support@sardarestate.com'],
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Address',
      details: ['House 12, Road 27, Gulshan-1', 'Dhaka-1212, Bangladesh'],
      gradient: 'from-orange-600 to-red-600'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Working Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat - Sun: 10:00 AM - 4:00 PM'],
      gradient: 'from-green-600 to-emerald-600'
    }
  ];

  const offices = [
    {
      city: 'Dhaka',
      address: 'House 12, Road 27, Gulshan-1, Dhaka-1212',
      phone: '+880 1234-567890',
      email: 'dhaka@sardarestate.com'
    },
    {
      city: 'Chattogram',
      address: 'CDA Avenue, Nasirabad, Chattogram',
      phone: '+880 1234-567891',
      email: 'chattogram@sardarestate.com'
    },
    {
      city: 'Sylhet',
      address: 'Zindabazar, Sylhet-3100',
      phone: '+880 1234-567892',
      email: 'sylhet@sardarestate.com'
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');

    // Simulate API call
    setTimeout(() => {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/assets/contact-hero.jpg" 
            alt="Contact Us" 
            className="w-full h-full object-cover"
            onError={(e) => e.target.src = '/assets/hero-1.jpg'}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto h-full flex items-center px-6">
          <div className="max-w-3xl contact-hero">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 rounded-full mb-6">
              <MessageCircle className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white tracking-wide">GET IN TOUCH</span>
            </div>

            <h1 className="text-7xl font-black mb-6 leading-tight">
              <span className="text-white">Let's Talk About</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Your Property Goals
              </span>
            </h1>
            
            <p className="text-2xl text-white/90 mb-8 leading-relaxed">
              Have questions? We're here to help you find the perfect property solution.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <AnimatedSection animation="fadeUp">
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 -mt-20 relative z-10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-transparent hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    {info.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-600 mb-1">{detail}</p>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Contact Form & Map */}
      <AnimatedSection animation="fadeUp">
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <div className="mb-12">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
                    <Send className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-blue-600">SEND MESSAGE</span>
                  </div>
                  <h2 className="text-5xl font-black mb-6">
                    <span className="text-gray-900">Drop Us</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> A Line</span>
                  </h2>
                  <p className="text-gray-600 text-xl">
                    Fill out the form below and our team will get back to you within 24 hours.
                  </p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300 bg-white"
                        placeholder="+880 1234-567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Subject *</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white"
                      >
                        <option value="">Select Subject</option>
                        <option value="property-inquiry">Property Inquiry</option>
                        <option value="buying">Buying Property</option>
                        <option value="selling">Selling Property</option>
                        <option value="investment">Investment Opportunity</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Your Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white resize-none"
                      placeholder="Tell us about your requirements..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitStatus === 'sending'}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
                  >
                    {submitStatus === 'sending' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <span className="text-lg">Send Message</span>
                      </>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-100 border-2 border-green-500 text-green-700 px-6 py-4 rounded-2xl flex items-center gap-3"
                    >
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                      <span className="font-semibold">Message sent successfully! We'll get back to you soon.</span>
                    </motion.div>
                  )}
                </form>
              </div>

              {/* Map & Social */}
              <div className="space-y-8">
                {/* Map */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-100 h-96">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.0614903675147!2d90.4125181!3d23.7808875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a1c0b0b0b0%3A0x0!2zMjPCsDQ2JzUxLjIiTiA5MMKwMjQnNDUuMSJF!5e0!3m2!1sen!2sbd!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Social Media */}
                <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-3xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6">Connect With Us</h3>
                  <p className="text-blue-100 mb-6">Follow us on social media for latest updates and exclusive offers</p>
                  <div className="flex gap-4">
                    {[
                      { icon: <Facebook />, name: 'Facebook', color: 'from-blue-600 to-blue-700', url: '#' },
                      { icon: <Twitter />, name: 'Twitter', color: 'from-cyan-600 to-cyan-700', url: '#' },
                      { icon: <Instagram />, name: 'Instagram', color: 'from-pink-600 to-pink-700', url: '#' },
                      { icon: <Linkedin />, name: 'LinkedIn', color: 'from-purple-600 to-purple-700', url: '#' }
                    ].map((social, idx) => (
                      <a
                        key={idx}
                        href={social.url}
                        className={`w-14 h-14 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Immediate Assistance?</h3>
                  <p className="text-gray-600 mb-6">Call us directly for urgent queries</p>
                  <div className="flex gap-4">
                    <a href="tel:+8801234567890" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl text-center hover:shadow-xl transition-all flex items-center justify-center gap-2">
                      <Phone className="w-5 h-5" />
                      Call Now
                    </a>
                    <a href="mailto:info@sardarestate.com" className="flex-1 bg-white text-blue-600 font-bold py-4 rounded-xl text-center border-2 border-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Our Offices */}
      <AnimatedSection animation="fadeUp">
        <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-5xl font-black mb-6">
                <span className="text-gray-900">Our</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Offices</span>
              </h2>
              <p className="text-gray-600 text-xl">Visit us at our convenient locations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offices.map((office, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-transparent hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">{office.city}</h3>
                  <div className="space-y-4 text-gray-600">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <span>{office.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-purple-600" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-pink-600" />
                      <span>{office.email}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* FAQ Preview */}
      <AnimatedSection animation="fadeUp">
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-5xl font-black mb-6">
              <span className="text-gray-900">Have</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Questions?</span>
            </h2>
            <p className="text-gray-600 text-xl mb-12 max-w-2xl mx-auto">
              Check out our frequently asked questions or contact us for more information
            </p>
            <a 
              href="/faq" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
            >
              <span>View FAQs</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default Contact;
