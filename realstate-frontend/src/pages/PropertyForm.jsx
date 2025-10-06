import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    type: 'sale',
    images: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/properties/${id}`)
        .then(response => {
          setProperty(response.data.data);
        })
        .catch(() => {
          setError('Failed to load property');
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/properties/${id}`, property);
      } else {
        await api.post('/properties', property);
      }
      navigate('/properties');
    } catch {
      setError('Failed to save property');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Property' : 'Add Property'}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={property.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border rounded" />
        <textarea name="description" value={property.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 border rounded" />
        <input name="price" type="number" value={property.price} onChange={handleChange} placeholder="Price" required className="w-full p-2 border rounded" />
        <input name="location" value={property.location} onChange={handleChange} placeholder="Location" required className="w-full p-2 border rounded" />
        <input name="bedrooms" type="number" value={property.bedrooms} onChange={handleChange} placeholder="Bedrooms" className="w-full p-2 border rounded" />
        <input name="bathrooms" type="number" value={property.bathrooms} onChange={handleChange} placeholder="Bathrooms" className="w-full p-2 border rounded" />
        <input name="area" type="number" value={property.area} onChange={handleChange} placeholder="Area (sq ft)" className="w-full p-2 border rounded" />
        <select name="type" value={property.type} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="sale">Sale</option>
          <option value="rent">Rent</option>
        </select>
        {/* For simplicity, images input as comma separated URLs */}
        <input
          name="images"
          value={property.images.join(',')}
          onChange={(e) => setProperty(prev => ({ ...prev, images: e.target.value.split(',').map(s => s.trim()) }))}
          placeholder="Image URLs (comma separated)"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
          {id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;
