import React from "react";
import "./index.css";
import TopNavbar from "../TopNavbar";
import Cookies from "js-cookie";

const userDetails = [
  {
    name: "Aravind",
    block: "Block B",
    room: "B - 102",
    phone: "9909118099",
    email: "aravind198@gmail.com",
  },
];

const UserProfile = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  const role = Cookies.get("role");
  const block = role === "ADMIN" ? "ADMIN-FLT" : data.flatNo[0];
  const { name, email, phoneNo, flatNo, societyName } = data;

  return (
    <div className="user-container">
      <TopNavbar
        heading={role === "ADMIN" ? "Admin Profile" : "User Profile"}
        full={true}
      />
      <div className="user-main-sec">
        <div className="profile-card">
          <div className="profile-left">
            <div className="u-name-sec">
              <h2 className="i-name-head">{name}</h2>
              {role === "ADMIN" && <p>Flat - N/A</p>}
              {role === "RESIDENT" && <p>Flat - {flatNo}</p>}
            </div>
          </div>
          <div className="profile-right">
            <h3 className="p-head">INFORMATION</h3>
            <hr className="line" />
            <div className="p-menu-item">
              <div className="p-menu-each-item">
                <h4 className="p-m-head">Society Name</h4>
                <p className="p-m-text">{societyName}</p>
              </div>
              <div className="p-menu-each-item">
                <h4 className="p-m-head">Name</h4>
                <p className="p-m-text">{name}</p>
              </div>
            </div>
            <div className="p-menu-item">
              <div className="p-menu-each-item">
                <h4 className="p-m-head">Block</h4>
                <p className="p-m-text">Block {block}</p>
              </div>
              <div className="p-menu-each-item">
                <h4 className="p-m-head">Flat No</h4>
                <p className="p-m-text">{role === "ADMIN" ? "N/A" : flatNo}</p>
              </div>
            </div>
            <div className="p-menu-item">
              <div className="p-menu-each-item">
                <h4 className="p-m-head">Phone</h4>
                <p className="p-m-text">{phoneNo}</p>
              </div>
              <div className="p-menu-each-item">
                <h4 className="p-m-head">Email</h4>
                <p className="p-m-text">{email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
