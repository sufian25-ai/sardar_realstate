import React, { useState } from "react";
import axios from "axios";

const PropertyAddForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    pcontent: "",
    type: "apartment",
    stype: "sale",
    bedroom: "",
    bathroom: "",
    balcony: "",
    kitchen: "",
    drawing_room: "",
    dining_room: "",
    floor: "",
    size: "",
    price: "",
    location: "",
    city_id: "",
    state_id: "",
    feature: "",
    status: "available",
    pimage: "",
    pimage1: "",
    pimage2: "",
    pimage3: "",
    pimage4: "",
    mapimage: "",
    topmapimage: "",
    groundmapimage: "",
    totalfloor: "",
    featured: false,
    verified: false,
    date: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token"); // Sanctum token

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/properties", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Property created successfully!");
      console.log(res.data);

      // Reset form
      setFormData({
        title: "",
        slug: "",
        pcontent: "",
        type: "apartment",
        stype: "sale",
        bedroom: "",
        bathroom: "",
        balcony: "",
        kitchen: "",
        drawing_room: "",
        dining_room: "",
        floor: "",
        size: "",
        price: "",
        location: "",
        city_id: "",
        state_id: "",
        feature: "",
        status: "available",
        pimage: "",
        pimage1: "",
        pimage2: "",
        pimage3: "",
        pimage4: "",
        mapimage: "",
        topmapimage: "",
        groundmapimage: "",
        totalfloor: "",
        featured: false,
        verified: false,
        date: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add property. Check your input data.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg p-8 rounded-2xl">
      <h2 className="text-2xl font-semibold text-center mb-6">Add New Property</h2>
      {message && (
        <div
          className={`p-3 mb-4 rounded text-center ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="border p-2 rounded" required />
        <input type="text" name="slug" placeholder="Slug (unique)" value={formData.slug} onChange={handleChange} className="border p-2 rounded" required />
        
        <textarea name="pcontent" placeholder="Description" value={formData.pcontent} onChange={handleChange} rows="4" className="border p-2 rounded col-span-2"></textarea>

        <select name="type" value={formData.type} onChange={handleChange} className="border p-2 rounded">
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="land">Land</option>
          <option value="commercial">Commercial</option>
        </select>

        <select name="stype" value={formData.stype} onChange={handleChange} className="border p-2 rounded">
          <option value="sale">Sale</option>
          <option value="rent">Rent</option>
        </select>

        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="border p-2 rounded" required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="border p-2 rounded" required />

        <input type="number" name="bedroom" placeholder="Bedrooms" value={formData.bedroom} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="bathroom" placeholder="Bathrooms" value={formData.bathroom} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="balcony" placeholder="Balcony" value={formData.balcony} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="kitchen" placeholder="Kitchen" value={formData.kitchen} onChange={handleChange} className="border p-2 rounded" />

        <input type="number" name="drawing_room" placeholder="Drawing Room" value={formData.drawing_room} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="dining_room" placeholder="Dining Room" value={formData.dining_room} onChange={handleChange} className="border p-2 rounded" />

        <input type="text" name="floor" placeholder="Floor" value={formData.floor} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="totalfloor" placeholder="Total Floor" value={formData.totalfloor} onChange={handleChange} className="border p-2 rounded" />

        <input type="text" name="size" placeholder="Size (sqft)" value={formData.size} onChange={handleChange} className="border p-2 rounded" />

        <input type="number" name="city_id" placeholder="City ID" value={formData.city_id} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="state_id" placeholder="State ID" value={formData.state_id} onChange={handleChange} className="border p-2 rounded" />

        <input type="text" name="feature" placeholder="Feature (comma separated)" value={formData.feature} onChange={handleChange} className="border p-2 rounded col-span-2" />

        <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-2 rounded col-span-2" />

        <div className="flex items-center gap-4 col-span-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="verified" checked={formData.verified} onChange={handleChange} />
            Verified
          </label>
        </div>

        <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded col-span-2">
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
        </select>

        <div className="col-span-2 text-center">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Add Property
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyAddForm;