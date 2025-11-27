import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Admin.css"; 

const AdminCCTV = () => {
  const navigate = useNavigate();
  const [feeds, setFeeds] = useState([]);

  // Check if admin is logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/login");

    // Example: fetch feeds from backend (replace with real endpoint)
    const fetchFeeds = async () => {
      try {
        const response = await fetch("/api/cctv/feeds", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setFeeds(data.feeds || []);
      } catch (err) {
        console.error("Error fetching CCTV feeds:", err);
      }
    };

    fetchFeeds();
  }, [navigate]);

  return (
    <div className="ez-dashboard-page">
      <div className="ez-topbar">
        <div className="ez-topbar-inner">
          <h2>Admin CCTV</h2>
        </div>
      </div>

      <div className="dashboard-container" style={{ paddingTop: "60px" }}>
        {feeds.length === 0 ? (
          <p>No CCTV feeds available.</p>
        ) : (
          <div
            className="dashboard-grid"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}
          >
            {feeds.map((feed, index) => (
              <div
                key={index}
                className="dashboard-card"
                style={{ padding: "15px", textAlign: "center" }}
              >
                <h3>Camera {index + 1}</h3>
                <video
                  src={feed.url}
                  controls
                  autoPlay
                  muted
                  style={{ width: "100%", borderRadius: "12px" }}
                />
              </div>
            ))}
          </div>
        )}

        <button
          className="dashboard-btn logout-btn"
          onClick={() => navigate("/admin-dashboard")}
          style={{ marginTop: "30px" }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminCCTV;
