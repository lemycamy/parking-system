import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/TimeOutPage.css";
import axios from "../utils/api";

const TimeOut = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // Page protection: redirect if not staff
  useEffect(() => {
    if (!role || role !== "staff") {
      navigate("/login");
    }
  }, [role, navigate]);

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState(null);

  // Fetch active bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get("/bookings/active");
      setBookings(res.data.bookings);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load bookings.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleTimeOut = async () => {
    if (!selectedBooking) {
      setMessage("Select a booking first.");
      return;
    }

    try {
      const res = await axios.post("/bookings/timeout", {
        bookingId: selectedBooking._id,
        staffName: localStorage.getItem("name"),
      });

      if (res.data.success) {
        setReceipt(res.data.receipt);
        setMessage("Time Out completed successfully!");
        setSelectedBooking(null);
        fetchBookings(); // refresh active bookings
      } else {
        setMessage("Failed to complete Time Out.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Try again.");
    }
  };

  return (
    <div className="timeout-container">
      <button className="back-button" onClick={() => navigate("/staff")}>
        &#8592; Back
      </button>

      <div className="timeout-card">
        <h2>Staff Time Out</h2>
        {message && <div className="message">{message}</div>}

        <select
          className="input-field"
          value={selectedBooking ? selectedBooking._id : ""}
          onChange={(e) => {
            const booking = bookings.find(b => b._id === e.target.value);
            setSelectedBooking(booking);
          }}
        >
          <option value="">Select Booking</option>
          {bookings.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name} - {b.vehicleType} ({b.plateNumber})
            </option>
          ))}
        </select>

        <button
          className="submit-button complete-button"
          onClick={handleTimeOut}
        >
          Complete Time Out
        </button>

        {receipt && (
          <div className="receipt">
            <h3>Receipt</h3>
            <p><strong>Customer:</strong> {receipt.name}</p>
            <p><strong>Vehicle:</strong> {receipt.vehicleType}</p>
            <p><strong>Plate Number:</strong> {receipt.plateNumber}</p>
            <p><strong>Time In:</strong> {new Date(receipt.timeIn).toLocaleString()}</p>
            <p><strong>Time Out:</strong> {new Date(receipt.timeOut).toLocaleString()}</p>
            <p><strong>Total Amount:</strong> ₱{receipt.totalAmount}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeOut;
