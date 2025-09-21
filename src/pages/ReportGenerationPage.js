import React, { useState } from "react";
import "./css/ReportGenerationPage.css";

const constituencyMap = {
  34: "Julana",
  35: "Safidon",
  36: "Jind",
  37: "Uchana Kalan",
  38: "Narwana",
};

const ReportGenerationPage = () => {
  const [reportType, setReportType] = useState("Receive");
  const [year, setYear] = useState(new Date().getFullYear());
  const [groupedData, setGroupedData] = useState({});

  const fetchReports = async () => {
    try {
      const res = await fetch(
        `https://epic-pdf-backend.onrender.com/api/reports?reportType=${reportType}&year=${year}`
      );
      if (!res.ok) throw new Error("Failed to fetch report data");

      const json = await res.json();
      if (!Array.isArray(json)) {
        console.error("Invalid response:", json);
        return;
      }

      // group by month number
      const grouped = {};
      json.forEach((row) => {
        const key = String(row.month); // numeric 1..12
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(row);
      });
      setGroupedData(grouped);
    } catch (err) {
      console.error("Error fetching reports:", err);
      alert("Failed to fetch reports. Please check backend API.");
    }
  };

  // calculate grand total across all months
  const allRows = Object.values(groupedData).flat();
  const grand6 = allRows.reduce((a, b) => a + b.form6_count, 0);
  const grand8 = allRows.reduce((a, b) => a + b.form8_count, 0);
  const grandTotal = allRows.reduce((a, b) => a + b.total, 0);

  return (
    <div className="report-container">
      <h2>Report Generation</h2>

      <div className="filter-section">
        <label>
          Report Type:{" "}
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="Receive">Receive Entries</option>
            <option value="Distribute">Distribute Entries</option>
          </select>
        </label>

        <label>
          Year:{" "}
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            {[2023, 2024, 2025, 2026].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </label>

        <button onClick={fetchReports} className="fetch-btn">
          Fetch Report
        </button>
      </div>

      {Object.keys(groupedData).length === 0 ? (
        <p style={{ marginTop: "20px", color: "#555" }}>
          No report data available. Please select filters and click Fetch.
        </p>
      ) : (
        <>
          {/* 🔥 Big heading above tables */}
          <div className="report-heading">
            {reportType === "Receive"
              ? "📥 Receive Entries Report"
              : "📤 Distribute Entries Report"}
          </div>

          {Object.keys(groupedData).map((monthKey) => {
            const rows = groupedData[monthKey];
            const monthLabel = rows[0]?.month_label || `Month ${monthKey}`;

            const monthTotal6 = rows.reduce((a, b) => a + b.form6_count, 0);
            const monthTotal8 = rows.reduce((a, b) => a + b.form8_count, 0);
            const monthGrand = rows.reduce((a, b) => a + b.total, 0);

            return (
              <div key={monthKey} className="month-section">
                <h3>{monthLabel}</h3>
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Constituency No</th>
                      <th>Constituency Name</th>
                      <th>Day</th>
                      <th>Form 6 Count</th>
                      <th>Form 8 Count</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, idx) => (
                      <tr key={idx}>
                        <td>{r.constituency_no}</td>
                        <td>{constituencyMap[r.constituency_no] || "Unknown"}</td>
                        <td>{r.day}</td>
                        <td>{r.form6_count}</td>
                        <td>{r.form8_count}</td>
                        <td>{r.total}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td colSpan="3">Monthly Total</td>
                      <td>{monthTotal6}</td>
                      <td>{monthTotal8}</td>
                      <td>{monthGrand}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}

          {/* Grand total across all months */}
          <div className="grand-total-section">
            <h3>Grand Total (All Months)</h3>
            <table className="report-table grand-total-table">
              <thead>
                <tr>
                  <th>Form 6 Total</th>
                  <th>Form 8 Total</th>
                  <th>Overall Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{grand6}</td>
                  <td>{grand8}</td>
                  <td>{grandTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportGenerationPage;
