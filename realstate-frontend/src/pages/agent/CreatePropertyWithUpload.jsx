// src/pages/CreatePropertyWithUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CreatePropertyWithUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    pcontent: '',
    type: '',
    stype: 'sale',
    bedroom: '',
    bathroom: '',
    balcony: '',
    kitchen: '',
    drawing_room: '',
    dining_room: '',
    floor: '',
    totalfloor: '',
    size: '',
    price: '',
    location: '',
    city_id: '',
    state_id: '',
    feature: '',
    user_id: '',
    status: 'available',
    featured: false,
    verified: false,
  });

  const [images, setImages] = useState({
    pimage: null,
    pimage1: null,
    pimage2: null,
    pimage3: null,
    pimage4: null,
    mapimage: null,
    groundmapimage: null,
  });

  const [preview, setPreview] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0] || null;

    setImages(prev => ({ ...prev, [name]: file }));

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    try {
      const data = new FormData();

      // Append text fields
Object.keys(formData).forEach(key => {
  let value = formData[key];

  // featured / verified কে boolean থেকে string এ convert করা
  if (key === 'featured' || key === 'verified') {
    value = value ? '1' : '0';
  }

  data.append(key, value);
});


      // Append images
      Object.keys(images).forEach(key => {
        if (images[key]) data.append(key, images[key]);
      });

      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://127.0.0.1:8000/api/properties',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);

      // Reset form
      setFormData({
        title: '', pcontent: '', type: '', stype: 'sale', bedroom: '', bathroom: '',
        balcony: '', kitchen: '', drawing_room: '', dining_room: '', floor: '', totalfloor: '',
        size: '', price: '', location: '', city_id: '', state_id: '', feature: '', user_id: '',
        status: 'available', featured: false, verified: false,
      });
      setImages({
        pimage: null, pimage1: null, pimage2: null, pimage3: null, pimage4: null,
        mapimage: null, groundmapimage: null
      });
      setPreview({});
    } catch (err) {
  if(err.response && err.response.status === 422){
    console.log(err.response.data.errors); // এখানে সব validation error দেখাবে
    setErrors(err.response.data.errors);
  }
}
  };

  const renderImagePreview = (field) => {
    if (preview[field]) {
      return <img src={preview[field]} alt={field} className="img-thumbnail mb-2" style={{ maxHeight: '150px' }} />;
    }
    return null;
  };

  return (
    <div className="container mt-5">
      <h2>Add New Property (With Image Upload)</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">

        {/* Basic Fields */}
        <div className="mb-3">
          <label className="form-label">Title *</label>
          <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange}/>
          {errors.title && <small className="text-danger">{errors.title[0]}</small>}
        </div>

        <div className="mb-3">
          <label className="form-label">Description *</label>
          <textarea name="pcontent" className="form-control" rows="4" value={formData.pcontent} onChange={handleChange}></textarea>
          {errors.pcontent && <small className="text-danger">{errors.pcontent[0]}</small>}
        </div>

        {/* Images */}
        {Object.keys(images).map(field => (
          <div className="mb-3" key={field}>
            <label className="form-label">{field.toUpperCase()}</label>
            <input type="file" className="form-control" name={field} onChange={handleFileChange} />
            {renderImagePreview(field)}
            {errors[field] && <small className="text-danger">{errors[field][0]}</small>}
          </div>
        ))}

        {/* Other Fields */}
        <div className="row">
          {['type','stype','bedroom','bathroom','balcony','kitchen','drawing_room','dining_room','floor','totalfloor','size','price','location','city_id','state_id','feature','user_id','status'].map(field => (
            <div className="col-md-3 mb-3" key={field}>
              <label className="form-label">{field.replace('_',' ').toUpperCase()}</label>
              {field === 'type' ?
                <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                </select>
              : field === 'stype' ?
                <select name="stype" className="form-select" value={formData.stype} onChange={handleChange}>
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                </select>
              : field === 'status' ?
                <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                  <option value="pending">Pending</option>
                </select>
              :
                <input type={['price','bedroom','bathroom','balcony','kitchen','drawing_room','dining_room','totalfloor','size','city_id','state_id','user_id'].includes(field)?'number':'text'} 
                       className="form-control" name={field} value={formData[field]} onChange={handleChange} />
              }
              {errors[field] && <small className="text-danger">{errors[field][0]}</small>}
            </div>
          ))}
        </div>

        {/* Checkboxes */}
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" name="featured" checked={formData.featured} onChange={handleChange}/>
          <label className="form-check-label">Featured</label>
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" name="verified" checked={formData.verified} onChange={handleChange}/>
          <label className="form-check-label">Verified</label>
        </div>

        <button type="submit" className="btn btn-primary">Submit Property</button>
      </form>
    </div>
  );
};

export default CreatePropertyWithUpload;
