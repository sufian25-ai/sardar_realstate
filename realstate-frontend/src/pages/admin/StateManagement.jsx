import React, { useEffect, useState } from "react";
import axios from "axios";

const StateManagement = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    sname: "",
    slug: "",
    is_active: true,
  });
  const [editId, setEditId] = useState(null);

  // 🔹 Replace with your backend URL
  const API_URL = "http://127.0.0.1:8000/api/states";
  const token = localStorage.getItem("token"); // assuming Sanctum token stored here

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  // 🟢 Fetch All States
  const fetchStates = async () => {
    try {
      const res = await axios.get(API_URL, axiosConfig);
      setStates(res.data.data.data || []); // paginate(10) data => res.data.data.data
    } catch (err) {
      setError("Failed to fetch states");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  // 🟡 Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 Add / Update State
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData, axiosConfig);
        alert("State updated successfully!");
      } else {
        await axios.post(API_URL, formData, axiosConfig);
        alert("State added successfully!");
      }
      setFormData({ sname: "", slug: "", is_active: true });
      setEditId(null);
      fetchStates();
    } catch (err) {
      console.error(err);
      alert("Failed to save state.");
    }
  };

  // 🟠 Edit
  const handleEdit = (state) => {
    setEditId(state.sid);
    setFormData({
      sname: state.sname,
      slug: state.slug,
      is_active: state.is_active,
    });
  };

  // 🔴 Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this state?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, axiosConfig);
        alert("State deleted!");
        fetchStates();
      } catch (err) {
        alert("Failed to delete state.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🏙️ State Management</h2>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md mb-6 w-full max-w-lg"
      >
        <div className="mb-4">
          <label className="block mb-2 font-semibold">State Name</label>
          <input
            type="text"
            name="sname"
            value={formData.sname}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter state name"
            required
          />
        </div>

        <div className="mb-4">
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

        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
          />
          <label>Active</label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          {editId ? "Update State" : "Add State"}
        </button>
      </form>

      {/* State List */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Slug</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {states.map((state, index) => (
              <tr
                key={state.sid}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{state.sname}</td>
                <td className="py-2 px-4">{state.slug}</td>
                <td className="py-2 px-4">
                  {state.is_active ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="py-2 px-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(state)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(state.sid)}
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

export default StateManagement;
