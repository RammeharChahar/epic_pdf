import React, { useEffect, useState } from "react";
import "./css/DistributeEntries.css";

function DistributeEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Constituency mapping
  const constituencyMap = {
    34: "Julana",
    35: "Safidon",
    36: "Jind",
    37: "Uchana Kalan",
    38: "Narwana",
  };

  // Fetch entries from backend
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch("https://epic-pdf-backend.onrender.com/api/distribution-entries");
        if (!res.ok) throw new Error("Failed to fetch entries");
        const data = await res.json();
        setEntries(data);
      } catch (err) {
        console.error("Error fetching entries:", err);
        setError("⚠️ Could not fetch distribution entries.");
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Handle distribution update
  const handleDistribute = async (entry) => {
    try {
      const res = await fetch("https://epic-pdf-backend.onrender.com/api/distribution-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });

      const data = await res.json();
      alert(data.message);

      // Remove the distributed entry from state
      setEntries(entries.filter((e) => !(e.constituency === entry.constituency && e.month === entry.month && e.day === entry.day)));
    } catch (err) {
      console.error("Error updating distribution:", err);
      alert("❌ Failed to update distribution entry");
    }
  };

  if (loading) return <p>⏳ Loading distribution entries...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="distribute-container">
      <h2>📦 Distribute Entries</h2>
      {entries.length === 0 ? (
        <p>✅ All entries are already distributed!</p>
      ) : (
        <table className="distribute-table">
          <thead>
            <tr>
              <th>Constituency No.</th>
              <th>Constituency Name</th>
              <th>Month</th>
              <th>Day</th>
              <th>Form 6 Count</th>
              <th>Form 8 Count</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={`${entry.constituency}-${entry.month}-${entry.day}`}>
                <td>{entry.constituency}</td>
                <td>{constituencyMap[entry.constituency] || "Unknown"}</td>
                <td>{entry.month}</td>
                <td>{entry.day}</td>
                <td>{entry.form6_count}</td>
                <td>{entry.form8_count}</td>
                <td>{entry.total}</td>
                <td>
                  <button
                    className="distribute-btn"
                    onClick={() => handleDistribute(entry)}
                  >
                    ✅ Mark Distributed
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DistributeEntries;
