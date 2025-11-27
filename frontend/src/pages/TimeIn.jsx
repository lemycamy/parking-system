import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/TimeInPage.css";
import axios from "../utils/api";

const TimeIn = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // Page protection: redirect if not staff
  useEffect(() => {
    if (!role || role !== "staff") {
      navigate("/login");
    }
  }, [role, navigate]);

  const [name, setName] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");
  const [plateNumber, setPlateNumber] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !plateNumber) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("/bookings/timein", {
        name,
        vehicleType,
        plateNumber,
        staffName: localStorage.getItem("name"),
      });

      if (response.data.success) {
        setMessage("Time In recorded successfully!");
        setName("");
        setPlateNumber("");
        setVehicleType("Car");
      } else {
        setMessage("Failed to record Time In.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Try again.");
    }
  };

  return (
    <div className="timein-container">
      <button className="back-button" onClick={() => navigate("/staff")}>
        &#8592; Back
      </button>

      <div className="timein-card">
        <h2>Staff Time In</h2>

        {message && <div className="message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Customer Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicleType">Vehicle Type</label>
            <select
              id="vehicleType"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="Car">Car</option>
              <option value="Motorcycle">Motorcycle</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="plateNumber">Plate Number</label>
            <input
              type="text"
              id="plateNumber"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="Enter plate number"
            />
          </div>

          <button type="submit" className="submit-button">
            Record Time In
          </button>
        </form>
      </div>
    </div>
  );
};

export default TimeIn;
