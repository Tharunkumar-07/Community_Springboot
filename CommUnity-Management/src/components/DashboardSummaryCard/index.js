import React from "react";
import "./index.css";

const DashboardSummaryCard = ({ title, value, icon }) => {
  return (
    <div
      className="d-card"
      style={{
        color: "rgba(0,0,0,0.3)",
        backgroundColor: "white",
        padding: "10px", // Added padding for better styling
        borderRadius: "10px", // Rounded corners for better visual
        textAlign: "center", // Center align text
      }}
    >
      <div className="d-top-sec">
        <p className="d-h4">{value}</p>
        <div className="d-img-bg color">{icon}</div>
      </div>

      <p className="d-p">{title}</p>
    </div>
  );
};

export default DashboardSummaryCard;
