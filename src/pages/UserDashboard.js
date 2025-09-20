// src/pages/UserDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/UserDashboard.css";

function UserDashboard() {
  const [month, setMonth] = useState("");
  const [dateOfMonth, setDateOfMonth] = useState("");
  const [form6Count, setForm6Count] = useState("");
  const [form8Count, setForm8Count] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [disabledDates, setDisabledDates] = useState([]);

  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();

  // fetch disabled dates from backend
  useEffect(() => {
    const fetchDisabled = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        navigate("/"); // if not logged in redirect to login
        return;
      }

      const res = await fetch(`http://localhost:5000/api/entries/disabled`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setDisabledDates(data);
      console.log(data);
    };

    fetchDisabled();
  }, [navigate]);

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setConfirmation("");

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));


    const res = await fetch("http://localhost:5000/api/entries/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        month,
        date_of_month: Number(dateOfMonth),
        form6_count: Number(form6Count),
        form8_count: Number(form8Count),
        period_from: periodFrom,
        period_to: periodTo,
      }),
    });

    const data = await res.json();

    setTimeout(() => {
      setSubmitting(false);
      if (res.ok) {
        setConfirmation("✅ Entry submitted successfully!");
        setDisabledDates([
          ...disabledDates,
          { month, day: Number(dateOfMonth) },
        ]);

        // reset form
        setMonth("");
        setDateOfMonth("");
        setForm6Count("");
        setForm8Count("");
        setPeriodFrom("");
        setPeriodTo("");
      } else {
        setConfirmation(`❌ Error: ${data.error}`);
      }
    }, 4000);
  };

  // handle logout
  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoggingOut(false);
      alert("✅ You have been logged out successfully!");
      navigate("/");
    }, 3000);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-heading">📊 User Dashboard</h1>
        <button
          className="logout-btn"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "⏳ Logging out..." : "🚪 Logout"}
        </button>
      </div>

      <form className="entry-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Month</label>
            <select
              value={dateOfMonth}
              onChange={(e) => setDateOfMonth(e.target.value)}
              required
            >
              <option value="">Select Date</option>
              <option
                value="15"
                disabled={disabledDates.some(
                  (d) => d.month === month && Number(d.day) === 15
                )}
              >
                15
              </option>

              <option
                value="30"
                disabled={disabledDates.some(
                  (d) => d.month === month && Number(d.day) === 30
                )}
              >
                30
              </option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Form 6 PDF Count</label>
            <input
              type="number"
              value={form6Count}
              onChange={(e) => setForm6Count(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Form 8 PDF Count</label>
            <input
              type="number"
              value={form8Count}
              onChange={(e) => setForm8Count(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Period From</label>
            <input
              type="date"
              value={periodFrom}
              onChange={(e) => setPeriodFrom(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Period To</label>
            <input
              type="date"
              value={periodTo}
              onChange={(e) => setPeriodTo(e.target.value)}
              required
            />
          </div>
        </div>

        {submitting && <p className="loading">⏳ Submitting entry...</p>}
        {confirmation && <p className="confirmation">{confirmation}</p>}

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Entry"}
        </button>
      </form>
    </div>
  );
}

export default UserDashboard;
