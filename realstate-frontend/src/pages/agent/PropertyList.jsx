import React, { useEffect, useState } from "react";
import axios from "axios";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token"); // or 'access_token'
        const response = await axios.get("http://127.0.0.1:8000/api/properties", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Laravel pagination: data.data.data
        setProperties(response.data.data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="container mt-4">
      <h3>All Properties</h3>
      <div className="row">
        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          properties.map((property) => (
            <div key={property.pid} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <img
                  src={
                    property.pimage
                      ? `http://127.0.0.1:8000/${property.pimage}`
                      : "/placeholder.jpg"
                  }
                  alt={property.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5>{property.title}</h5>
                  <p>{property.location}</p>
                  <p>
                    <strong>Price:</strong> ${property.price}
                  </p>
                  <p>
                    <span className="badge bg-success">{property.type}</span>{" "}
                    <span className="badge bg-info">{property.status}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyList;
