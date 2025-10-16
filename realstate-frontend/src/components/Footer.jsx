import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/assets/logo1.png"
                  alt="Sardar Estate"
                  className="w-20 h-50 rounded-lg shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Sardar Realstate</h3>
                <p className="text-xs text-gray-400">Premium Properties</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner in real estate with premium property solutions. We help you find your dream home or perfect investment opportunity.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-3">
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg group"
              >
                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-cyan-700 hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg group"
              >
                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-pink-600 to-pink-700 hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg group"
              >
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 hover:scale-110 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg group"
              >
                <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h5 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              Quick Links
            </h5>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 text-blue-400 mr-2 group-hover:translate-x-1 transition-transform" />
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/properties" 
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 text-blue-400 mr-2 group-hover:translate-x-1 transition-transform" />
                  Properties
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 text-blue-400 mr-2 group-hover:translate-x-1 transition-transform" />
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 text-blue-400 mr-2 group-hover:translate-x-1 transition-transform" />
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 text-blue-400 mr-2 group-hover:translate-x-1 transition-transform" />
                  Services
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h5 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
              Contact Info
            </h5>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-600/30 transition-all">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Call Us</p>
                  <a href="tel:+8801234567890" className="hover:text-white transition-colors">
                    +880 1234-567890
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-purple-600/30 transition-all">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email Us</p>
                  <a href="mailto:info@sardarestate.com" className="hover:text-white transition-colors">
                    info@sardarestate.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-pink-600/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-pink-600/30 transition-all">
                  <MapPin className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Visit Us</p>
                  <span>Bashundra, Keranigunj, Dhaka 1211 , Bangladesh</span>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="space-y-4">
            <h5 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-pink-600 to-orange-600 rounded-full"></div>
              Newsletter
            </h5>
            <p className="text-gray-400 mb-4">
              Subscribe to get exclusive property updates and special offers delivered to your inbox.
            </p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-white placeholder-gray-500 transition-all duration-300"
              />
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Subscribe Now
              </button>
            </div>
            <p className="text-xs text-gray-500">
              🔒 Your email is safe with us. We respect your privacy.
            </p>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center md:text-left">
              &copy; {new Date().getFullYear()} <span className="font-semibold text-white">Sardar Real Estate</span>. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>

        {/* Made with Love */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Made with <span className="text-red-500 animate-pulse">❤️</span> by <span className="font-semibold text-gray-400">Sardar Realstate Team</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;