import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/properties')
      .then(response => {
        // PropertyController অনুযায়ী pagination data
        setProperties(response.data.data.data || []);
      })
      .catch(err => {
        console.error('Error fetching properties:', err);
        setProperties([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4 text-center">Loading properties...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Properties</h1>

      {properties.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <div key={property.id} className="border rounded-lg shadow hover:shadow-lg transition p-4 bg-white">
              {/* Main Image */}
              {property.pimage && (
                <img
                  src={`http://127.0.0.1:8000/${property.pimage}`}
                  alt={property.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}

              <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
              <p className="text-gray-600 mb-2">{property.pcontent}</p>

              <div className="text-sm text-gray-500 space-y-1 mb-3">
                <p><span className="font-semibold">Type:</span> {property.type} ({property.stype})</p>
                <p><span className="font-semibold">Price:</span> ${property.price}</p>
                <p><span className="font-semibold">Location:</span> {property.location}</p>
                <p><span className="font-semibold">City:</span> {property.city?.cname}</p>
                <p><span className="font-semibold">State:</span> {property.state?.sname}</p>
                <p><span className="font-semibold">Bedrooms:</span> {property.bedroom || 0}</p>
                <p><span className="font-semibold">Bathrooms:</span> {property.bathroom || 0}</p>
                <p><span className="font-semibold">Featured:</span> {property.featured ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold">Verified:</span> {property.verified ? 'Yes' : 'No'}</p>
              </div>

              {/* Multiple Images Preview */}
              <div className="flex flex-wrap gap-2 mb-2">
                {['pimage1','pimage2','pimage3','pimage4','mapimage','groundmapimage'].map(imgField => (
                  property[imgField] && (
                    <img
                      key={imgField}
                      src={`http://127.0.0.1:8000/${property[imgField]}`}
                      alt={imgField}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )
                ))}
              </div>

              {/* View Details Button */}
              <a
                href={`/properties/${property.id}`}
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;
