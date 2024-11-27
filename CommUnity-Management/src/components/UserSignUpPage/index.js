import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";
import { JsonRequestError } from "@fullcalendar/core/index.js";

const UserSignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    societyName: "",
    postal: "",
    flatNo: "",
    email: emailFromState,
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const jwtToken = Cookies.get("jwt_token");

    try {
      const response = await fetch(
        "http://localhost:9999/api/community/management-service/residents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      console.log("res", response);

      if (response.ok) {
        const jsonData = await response.json();
        navigate("/login");
        console.log("User registered successfully");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        console.error("Registration failed:", errorData);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("An error occurred during registration.");
    }
  };

  return (
    <div className="u-form-container">
      <div className="u-img-sec"></div>
      <div className="u-inp-sec">
        <div className="u-inp-top-sec">
          <h3 className="u-head1">Sign Up</h3>
          <img
            src="https://res.cloudinary.com/digbzwlfx/image/upload/v1724896011/logo-color_1_i3fzir.png"
            alt="logo"
            className="u-logo-img"
          />
        </div>
        <form className="u-register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="u-input-f"
            required
          />
          <input
            type="text"
            name="phoneNo"
            placeholder="Phone No"
            value={formData.phoneNo}
            onChange={handleChange}
            className="u-input-f"
            required
          />
          <input
            type="text"
            name="societyName"
            placeholder="Society Name"
            value={formData.societyName}
            onChange={handleChange}
            className="u-input-f"
            required
          />
          <input
            type="text"
            name="flatNo"
            placeholder="Flat No"
            value={formData.flatNo}
            onChange={handleChange}
            className="u-input-f"
            required
          />
          <input
            type="text"
            name="postal"
            placeholder="Postal"
            value={formData.postal}
            onChange={handleChange}
            className="u-input-f"
            required
          />
          {errorMessage && <p className="error-message">*{errorMessage}</p>}
          <button type="submit" className="u-submit-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSignUpPage;
