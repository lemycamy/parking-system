import React, { useEffect, useState } from "react";
import "../css/Admin.css"; // make sure this file exists
import SlotCard from "../components/SlotCard";
import { getParkingSlots } from "../utils/api"; // API call to fetch slots

const AdminLayout = () => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    // Fetch slots from backend
    const fetchSlots = async () => {
      try {
        const data = await getParkingSlots();
        setSlots(data);
      } catch (err) {
        console.error("Failed to fetch parking slots:", err);
      }
    };
    fetchSlots();
  }, []);

  // Helper to get slot object by ID
  const getSlot = (id) => slots.find((s) => s.number === id) || { number: id, status: "empty" };

  return (
    <div className="admin-layout">
      <h2>Parking Layout</h2>

      {/* Section A */}
      <div className="section section-a">
        <h3>Section A</h3>
        <div className="slot-row">
          {[1, 2, 3].map((id) => (
            <SlotCard key={id} slot={getSlot(id)} />
          ))}
        </div>
      </div>

      {/* Section B */}
      <div className="section section-b">
        <h3>Section B</h3>
        <div className="slot-grid">
          {[4, 5, 6, 7, 8, 9, 10, 11].map((id) => (
            <SlotCard key={id} slot={getSlot(id)} />
          ))}
        </div>
      </div>

      {/* Section C */}
      <div className="section section-c">
        <h3>Section C</h3>
        <div className="slot-grid">
          {[12, 13, 14, 15, 16, 17, 18, 19].map((id) => (
            <SlotCard key={id} slot={getSlot(id)} />
          ))}
        </div>
      </div>

      {/* Section D – McDo (Disabled) */}
      <div className="section section-d">
        <h3>McDonald's (Free Parking)</h3>
        <div className="slot-grid">
          {[20, 21, 22, 23, 24].map((id) => (
            <SlotCard
              key={id}
              slot={{ number: id, status: "mcdo" }}
              disabled={true} // disables clicks/bookings
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
