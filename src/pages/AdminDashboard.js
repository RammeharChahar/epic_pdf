import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  // Prevent going back to login page using browser back button
  useEffect(() => {
    const handlePopState = () => {
      // Always push back to dashboard when user tries to go back
      navigate("/admin-dashboard", { replace: true });
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoggingOut(false);
      alert("✅ You have been logged out successfully!");
      navigate("/", { replace: true });
    }, 2000);
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <h1>⚙️ Admin Dashboard</h1>
        <button
          className="logout-btn"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "⏳ Logging out..." : "🚪 Logout"}
        </button>
      </header>

      <div className="admin-menu">
        <div
          className="menu-card"
          onClick={() => navigate("/receive-entries")}
        >
          <h2>📥 Receive Entries</h2>
          <p>Verify & manage user-submitted entries</p>
        </div>

        <div
          className="menu-card"
          onClick={() => navigate("/distribute-entries")}
        >
          <h2>📤 Distribution Entry</h2>
          <p>Update which EPIC cards are distributed</p>
        </div>

        <div
          className="menu-card"
          onClick={() => navigate("/report-generation")}
        >
          <h2>📊 Report Generation</h2>
          <p>Generate summaries & export reports</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
