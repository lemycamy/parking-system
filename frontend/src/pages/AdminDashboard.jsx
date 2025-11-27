import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Admin.css";
import logo from "../images/ezpark.png";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ✅ Check token on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/", { replace: true });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <div className="ez-admin-page">
      <div className="ez-admin-topbar">
        <img src={logo} alt="EZPark Logo" className="ez-logo" />
        <nav className="ez-admin-nav">
          <button onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/admin-reports")}>Reports</button>
          <button onClick={() => navigate("/adminCCTV")}>CCTV</button>
          <button onClick={() => navigate("/admin-layout")}>Layout</button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </div>

      <div className="ez-admin-main">
        <h1>Welcome, Admin</h1>
        <p>This is your dashboard where you can manage parking slots, users, and reports.</p>
      </div>
    </div>
  );
}
