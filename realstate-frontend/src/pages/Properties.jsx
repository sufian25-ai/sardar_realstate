import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/properties')
      .then(response => {
        setProperties(response.data.data.data);
      })
      .catch(() => {
        setProperties([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading properties...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Properties</h1>
      <Link to="/properties/new" className="mb-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded">
        Add New Property
      </Link>
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <ul className="space-y-4">
          {properties.map((property) => (
            <li key={property.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{property.title}</h2>
              <p>{property.description}</p>
              <p>Price: ${property.price}</p>
              <p>Location: {property.location}</p>
              <Link to={`/properties/${property.id}`} className="text-indigo-600 hover:underline">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Properties;
