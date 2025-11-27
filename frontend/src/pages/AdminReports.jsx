import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Admin.css";

const AdminReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState({
    totalWalkIn: 0,
    totalReservation: 0,
    totalEarnings: 0,
    walkInList: [],
    reservationList: [],
  });

  // Admin login protection
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/login");

    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        setReports({
          totalWalkIn: data.totalWalkIn || 0,
          totalReservation: data.totalReservation || 0,
          totalEarnings: data.totalEarnings || 0,
          walkInList: data.walkInList || [],
          reservationList: data.reservationList || [],
        });
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };

    fetchReports();
  }, [navigate]);

  return (
    <div className="ez-dashboard-page">
      <div className="ez-topbar">
        <div className="ez-topbar-inner">
          <h2>Admin Reports</h2>
        </div>
      </div>

      <div className="dashboard-container" style={{ paddingTop: "60px" }}>
        {/* Top Summary Cards */}
        <div className="dashboard-grid" style={{ marginBottom: "30px" }}>
          <div className="dashboard-card">
            <h3>Total Walk-Ins</h3>
            <p style={{ fontSize: "24px", fontWeight: "700" }}>{reports.totalWalkIn}</p>
          </div>
          <div className="dashboard-card">
            <h3>Total Reservations</h3>
            <p style={{ fontSize: "24px", fontWeight: "700" }}>{reports.totalReservation}</p>
          </div>
          <div className="dashboard-card">
            <h3>Total Earnings</h3>
            <p style={{ fontSize: "24px", fontWeight: "700" }}>₱{reports.totalEarnings}</p>
          </div>
        </div>

        {/* Walk-In Details */}
        <div className="dashboard-card" style={{ marginBottom: "20px", width: "100%" }}>
          <h3>Walk-In Details</h3>
          {reports.walkInList.length === 0 ? (
            <p>No walk-in records available.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #ccc" }}>
                  <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Vehicle</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Time In</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Time Out</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {reports.walkInList.map((w, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px" }}>{w.name}</td>
                    <td style={{ padding: "8px" }}>{w.vehicle}</td>
                    <td style={{ padding: "8px" }}>{w.timeIn}</td>
                    <td style={{ padding: "8px" }}>{w.timeOut || "-"}</td>
                    <td style={{ padding: "8px" }}>₱{w.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Reservation Details */}
        <div className="dashboard-card" style={{ width: "100%" }}>
          <h3>Reservation Details</h3>
          {reports.reservationList.length === 0 ? (
            <p>No reservation records available.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #ccc" }}>
                  <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Vehicle</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Date</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Slot</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {reports.reservationList.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px" }}>{r.name}</td>
                    <td style={{ padding: "8px" }}>{r.vehicle}</td>
                    <td style={{ padding: "8px" }}>{r.date}</td>
                    <td style={{ padding: "8px" }}>{r.slot}</td>
                    <td style={{ padding: "8px" }}>₱{r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

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

export default AdminReports;
