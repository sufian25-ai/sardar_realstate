import React, { useEffect, useState } from "react";
import axios from "axios";

const CityManagement = () => {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    cname: "",
    slug: "",
    state_id: "",
    is_active: true,
  });
  const [editId, setEditId] = useState(null);

  // 🔹 তোমার Backend API Base URL
  const API_URL = "http://127.0.0.1:8000/api";
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  // 🟢 সব State আনো (dropdown এর জন্য)
  const fetchStates = async () => {
    try {
      const res = await axios.get(`${API_URL}/states`, axiosConfig);
      setStates(res.data.data.data || []);
    } catch (err) {
      console.error("State fetch error:", err);
    }
  };

  // 🟢 সব City আনো
  const fetchCities = async () => {
    try {
      const res = await axios.get(`${API_URL}/cities`, axiosConfig);
      setCities(res.data.data.data || []);
    } catch (err) {
      console.error("City fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchCities();
  }, []);

  // 🟡 Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // 🟢 Add or Update City
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/cities/${editId}`, formData, axiosConfig);
        alert("City updated successfully!");
      } else {
        await axios.post(`${API_URL}/cities`, formData, axiosConfig);
        alert("City added successfully!");
      }
      setFormData({ cname: "", slug: "", state_id: "", is_active: true });
      setEditId(null);
      fetchCities();
    } catch (err) {
      console.error(err);
      alert("Failed to save city.");
    }
  };

  // ✏️ Edit City
  const handleEdit = (city) => {
    setEditId(city.cid);
    setFormData({
      cname: city.cname,
      slug: city.slug,
      state_id: city.state_id,
      is_active: city.is_active,
    });
  };

  // ❌ Delete City
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this city?")) {
      try {
        await axios.delete(`${API_URL}/cities/${id}`, axiosConfig);
        alert("City deleted!");
        fetchCities();
      } catch (err) {
        alert("Failed to delete city.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🏙️ City Management
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md mb-6 w-full max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City Name */}
          <div>
            <label className="block mb-2 font-semibold">City Name</label>
            <input
              type="text"
              name="cname"
              value={formData.cname}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter city name"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block mb-2 font-semibold">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter slug"
              required
            />
          </div>

          {/* State Dropdown */}
          <div>
            <label className="block mb-2 font-semibold">Select State</label>
            <select
              name="state_id"
              value={formData.state_id}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="">-- Select State --</option>
              {states.map((st) => (
                <option key={st.sid} value={st.sid}>
                  {st.sname}
                </option>
              ))}
            </select>
          </div>

          {/* Active */}
          <div className="flex items-center mt-6 gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            <label>Active</label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          {editId ? "Update City" : "Add City"}
        </button>
      </form>

      {/* City List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">City Name</th>
              <th className="py-3 px-4 text-left">Slug</th>
              <th className="py-3 px-4 text-left">State</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city, index) => (
              <tr key={city.cid} className="border-b hover:bg-gray-50 transition">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{city.cname}</td>
                <td className="py-2 px-4">{city.slug}</td>
                <td className="py-2 px-4">
                  {city.state ? city.state.sname : "N/A"}
                </td>
                <td className="py-2 px-4">
                  {city.is_active ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="py-2 px-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(city)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(city.cid)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CityManagement;
