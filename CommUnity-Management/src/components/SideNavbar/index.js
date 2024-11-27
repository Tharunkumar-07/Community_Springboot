import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Removed Link import
import "./index.css";
import SideMenuItem from "../SideMenuItem";
import Cookies from "js-cookie";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

// Define the menu items
const menuItems = [
  {
    icon: "https://res.cloudinary.com/digbzwlfx/image/upload/v1724915743/Dashboard_customize_xrctoq.png",
    text: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/914d6561fa6d787ddf33e5987926e52cf1d6f5de0f35f36c9657fdc9afe97ad9?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3",
    text: "Request Services",
    path: "/request",
  },

  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/31b26976256d8b526a4e01291a13cc0f32e9dff5fd54ec6c9560251ed19225fd?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3",
    text: "Complaints",
    path: "/complaint",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/8f3bd0397d12914ab9265783a0863246d7ebed26934f9c768f0c093d9c106902?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3",
    text: "Events",
    path: "/events",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/bb12112c297e8467ee8084cc6f3c42f628443e3b4c4c7acc3426ce046d5d2467?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3",
    text: "Notices",
    path: "/notice-board",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/bb12112c297e8467ee8084cc6f3c42f628443e3b4c4c7acc3426ce046d5d2467?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3",
    text: "Posts",
    path: "/posts",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/211ca4d28c940cc88c6e468b1b15f5c250d2da7dae1411d36cb34743e7173a9b?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3",
    text: "Parking",
    path: "/parking",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/bb12112c297e8467ee8084cc6f3c42f628443e3b4c4c7acc3426ce046d5d2467?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3",
    text: "Emergency Contacts",
    path: "/emergency-contacts",
  },

  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/eae2b4a85957b8e772f0df5f63f2047fd2d3a4b50bcdb91efef49d6f7f70202b?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3",
    text: "Billings",
    path: "/billings",
  },
];

const SideNavbar = () => {
  const location = useLocation(); // Get current location
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(location.pathname); // Initialize active item based on path
  const [clickedLogout, setClickedLogout] = useState(false);

  const handleLogoutClick = () => {
    setClickedLogout(true);
  };

  const logout = () => {
    Cookies.remove("jwt_token");
    Cookies.remove("role");
    localStorage.removeItem("data");
    navigate("/");
  };

  // Update active item when path changes
  useEffect(() => {
    setActiveItem(location.pathname);
    console.log(location.pathname);
  }, [location.pathname]);

  return (
    <div className="side-nav-bar">
      <img
        src="https://res.cloudinary.com/digbzwlfx/image/upload/v1724896011/logo-color_1_i3fzir.png"
        alt="logo"
        className="side-nav-logo"
      />
      <nav className="side-menu">
        {menuItems.map((item, index) => (
          <SideMenuItem
            key={index}
            icon={item.icon}
            text={item.text}
            path={item.path}
            isActive={activeItem === item.path} // Check if the path matches the active item
            onClick={() => setActiveItem(item.path)} // Set the active item on click
          />
        ))}
      </nav>
      <div className="logout-container">
        <Popup
          trigger={
            <button
              className="menu-item logout-pop"
              onClick={handleLogoutClick}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/add2d807606eaae0f6c70e630e8c105f96c0376f593212db3c7a75c60b4a9639?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3"
                alt="logout"
                className="logout"
              />
              <span className="text">Logout</span>
            </button>
          }
          modal
        >
          {(close) => (
            <div className="modal">
              <div className="p-header">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/add2d807606eaae0f6c70e630e8c105f96c0376f593212db3c7a75c60b4a9639?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3"
                  alt="logout"
                  className="icon2"
                />
                <p className="head4"> Are you sure you want to Logout?</p>
              </div>

              <div className="actions">
                <button
                  className="login-submit-button no-space size-less"
                  onClick={() => {
                    logout();
                    close();
                    console.log("modal closed ");
                  }}
                >
                  Yes
                </button>
                <button
                  className="login-submit-button no-space size-less outline"
                  onClick={() => {
                    console.log("modal closed ");
                    close();
                  }}
                >
                  cancel
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </div>
  );
};

export default SideNavbar;
