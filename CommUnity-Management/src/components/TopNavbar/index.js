import React from "react";
import { Link } from "react-router-dom";
import { IoPeople } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import "./index.css";

function TopNavbar({ heading, full }) {
  const data = JSON.parse(localStorage.getItem("data"));
  const { name } = data;
  return (
    <nav className="top-nav-bar-container">
      <h3 className="n-head">{heading}</h3>
      <Link to="/user-profile" style={{ textDecoration: "none" }}>
        <button className="av-sec">
          <img
            src="https://res.cloudinary.com/digbzwlfx/image/upload/v1725489848/profile_sjcrjn.png"
            alt="profile"
            className="avathar"
          />
          <p className="n-text">{name}</p>
        </button>
      </Link>
      <Link to="/apartment">
        <IoPeople
          style={{
            height: "25px",
            width: "25px",
            marginLeft: "30px",
            cursor: "pointer",
            color: "#1a4258",
          }}
        />
      </Link>

      {full && (
        <Link to="/dashboard">
          <HiOutlineLogout className="t-icon" />
        </Link>
      )}
    </nav>
  );
}

export default TopNavbar;
