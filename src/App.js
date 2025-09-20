// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard"; 
import ReceiveEntries from "./pages/ReceiveEntry";
import DistributeEntries from "./pages/DistributeEntries";
import ReportGeneration from "./pages/ReportGenerationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/receive-entries" element={<ReceiveEntries />} />
        <Route path="/distribute-entries" element={<DistributeEntries />} />
        <Route path="/report-generation" element={<ReportGeneration />} />
      </Routes>
    </Router>
  );
}

export default App;
