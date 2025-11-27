import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Staff.css";

const StaffDashboard = () => {
  const navigate = useNavigate();

  const handleNavigate = (page) => {
    switch (page) {
      case "timein":
        navigate("/timein");
        break;
      case "timeout":
        navigate("/timeout");
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("staffToken"); // remove JWT
    navigate("/login");
  };

  return (
    <div className="staff-ez-dashboard-page">
      {/* Topbar */}
      <div className="staff-ez-topbar">
        <div className="staff-ez-topbar-inner">
          <img src="/logo.png" alt="Logo" className="staff-ez-logo" />
        </div>
      </div>

      {/* Dashboard Container */}
      <div className="staff-dashboard-container">
        <div className="staff-dashboard-card">
          <h1 className="staff-dashboard-title">Staff Dashboard</h1>

          <div className="staff-dashboard-grid">
            <button
              className="staff-dashboard-btn"
              onClick={() => handleNavigate("timein")}
            >
              Time In
            </button>

            <button
              className="staff-dashboard-btn"
              onClick={() => handleNavigate("timeout")}
            >
              Time Out
            </button>

            <button
              className="staff-dashboard-btn staff-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
