import React from "react";
import "./index.css";

const VendorSummaryCard = ({ title, value, color, icon }) => {
  return (
    <div
      className="v-card"
      style={{
        color: color,
        backgroundColor: `${color}40`,
        padding: "10px", // Added padding for better styling
        borderRadius: "10px", // Rounded corners for better visual
        textAlign: "center", // Center align text
      }}
    >
      <div className="v-top-sec">
        <p className="v-h4">{value}</p>
        <div className="v-img-bg" style={{ backgroundColor: "white" }}>
          {icon}
        </div>
      </div>

      <p className="v-p">{title}</p>
    </div>
  );
};

export default VendorSummaryCard;
