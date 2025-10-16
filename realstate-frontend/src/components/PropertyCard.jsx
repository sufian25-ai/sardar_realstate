import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, Phone, User } from 'lucide-react';

const PropertyCard = ({ property }) => {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
      {/* Image Section */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={property.pimage ? `http://localhost:8000/${property.pimage}` : '/assets/placeholder.jpg'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${
            property.stype === 'sale' 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
              : 'bg-gradient-to-r from-purple-600 to-purple-700'
          }`}>
            For {property.stype === 'sale' ? 'Sale' : 'Rent'}
          </span>
          
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg">
            {property.type}
          </span>
        </div>

        {/* Heart Icon */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg group/heart">
          <Heart className="w-5 h-5 text-gray-700 group-hover/heart:text-red-500 group-hover/heart:fill-red-500 transition-all" />
        </button>

        {/* Verified Badge */}
        {property.verified && (
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Location */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
          <span className="text-sm text-gray-600 line-clamp-1">{property.location}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 min-h-[56px]">
          {property.title}
        </h3>

        {/* Price */}
        <div className="mb-4">
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            ${property.price?.toLocaleString()}
          </div>
          {property.stype === 'rent' && (
            <span className="text-sm text-gray-500 font-medium">/month</span>
          )}
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Bed className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Bed</span>
              <span className="text-sm font-bold text-gray-900">{property.bedroom || 0}</span>
            </div>
          </div>

          <div className="w-px h-10 bg-gray-200"></div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Bath className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Bath</span>
              <span className="text-sm font-bold text-gray-900">{property.bathroom || 0}</span>
            </div>
          </div>

          <div className="w-px h-10 bg-gray-200"></div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
              <Square className="w-4 h-4 text-pink-600" />
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Size</span>
              <span className="text-sm font-bold text-gray-900">{property.size || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Agent Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Agent</p>
              <p className="text-sm font-semibold text-gray-900">
                {property.agent_name || 'Sardar Estate'}
              </p>
            </div>
          </div>

          <button className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 group/phone">
            <Phone className="w-5 h-5 text-white group-hover/phone:scale-110 transition-transform" />
          </button>
        </div>

        {/* View Details Button */}
        <Link
          to={`/properties/${property.pid}`}
          className="block w-full text-center py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;