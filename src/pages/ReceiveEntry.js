import React, { useState } from "react";
import "./css/ReceiveEntries.css";

function ReceiveEntries() {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  // Map constituency number → name
  const constituencyMap = {
    34: "Julana",
    35: "Safidon",
    36: "Jind",
    37: "Uchana Kalan",
    38: "Narwana",
  };

  // Fetch entries from backend
  const fetchEntries = async () => {
    if (!month || !day) {
      alert("Please select both month and day");
      return;
    }

    setLoading(true);
    setConfirmation("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/receive-entries/${month}/${day}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (res.ok) {
        setEntries(data);
      } else {
        setConfirmation(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setConfirmation("❌ Server error while fetching entries");
    }

    setLoading(false);
  };

  // Update receive entries
  const updateReceiveEntries = async () => {
    if (!month || !day) {
      alert("Please select month and day first");
      return;
    }

    setUpdating(true);
    setConfirmation("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/receive-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ month, day }),
      });

      const data = await res.json();

      setTimeout(() => {
        setUpdating(false);
        if (res.ok) {
          setConfirmation("✅ Receive entries updated successfully!");
        } else {
          setConfirmation(`❌ Error: ${data.error}`);
        }
      }, 3000);
    } catch (err) {
      setUpdating(false);
      setConfirmation("❌ Server error while updating entries");
    }
  };

  return (
    <div className="receive-container">
      <h1 className="receive-heading">📥 Receive Entries</h1>

      <div className="filter-box">
        <label>Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />

        <label>Select Day:</label>
        <select value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="">Select</option>
          <option value="15">15</option>
          <option value="30">30</option>
        </select>

        <button onClick={fetchEntries} disabled={loading}>
          {loading ? "⏳ Loading..." : "🔍 Fetch Entries"}
        </button>
      </div>

      {entries.length > 0 && (
        <table className="entries-table">
          <thead>
            <tr>
              <th>Constituency No.</th>
              <th>Constituency Name</th>
              <th>Day</th>
              <th>Form 6 Count</th>
              <th>Form 8 Count</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, index) => (
              <tr key={index}>
                <td>{e.constituency}</td>
                <td>{constituencyMap[e.constituency] || "Unknown"}</td>
                <td>{e.day}</td>
                <td>{e.form6_count}</td>
                <td>{e.form8_count}</td>
                <td>{e.form6_count + e.form8_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {entries.length > 0 && (
        <button
          className="update-btn"
          onClick={updateReceiveEntries}
          disabled={updating}
        >
          {updating ? "⏳ Updating..." : "✅ Update Receive Entries"}
        </button>
      )}

      {confirmation && <p className="confirmation">{confirmation}</p>}
    </div>
  );
}

export default ReceiveEntries;
