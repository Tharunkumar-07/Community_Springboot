import React from "react";
import { Link } from "react-router-dom"; // Import Link
import "./index.css";

function SideMenuItem({ icon, text, path, isActive, onClick }) {
  const itemClass = isActive ? "menu-item active" : "menu-item";
  const iconColor = isActive ? "icon active-icon" : "icon";

  return (
    <Link to={path} className={itemClass} onClick={() => onClick(text)}>
      <img src={icon} alt="" className={iconColor} />
      <span className="text">{text}</span>
    </Link>
  );
}

export default SideMenuItem;
