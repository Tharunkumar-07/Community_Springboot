import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

const AdminRegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState = location.state?.email || "";
  console.log(location);

  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    societyName: "",
    societyAddress: "",
    city: "",
    district: "",
    postal: "",
    email: emailFromState, // Initialize with email from state
  });

  console.log("e", emailFromState);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const jwtToken = Cookies.get("jwt_token");

    try {
      const response = await fetch(
        "http://localhost:9999/api/community/management-service/societies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        console.log("response", response);

        navigate("/login");

        console.log("User registered successfully");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Registration failed");
        console.error("Registration failed:", errorData);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("An error occurred during registration.");
    }
  };

  return (
    <div className="form-container">
      <div className="ad-img-sec"></div>
      <div className="ad-inp-sec">
        <div className="ad-inp-top-sec">
          <h3 className="ad-head1">Fill these details to continue</h3>
          <img
            src="https://res.cloudinary.com/digbzwlfx/image/upload/v1724896011/logo-color_1_i3fzir.png"
            alt="logo"
            className="ad-logo-img"
          />
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="ad-input-f"
            required
          />
          <input
            type="text"
            name="phoneNo"
            placeholder="Phone No"
            value={formData.phoneNo}
            onChange={handleChange}
            className="ad-input-f"
            required
          />
          <input
            type="text"
            name="societyName"
            placeholder="Society Name"
            value={formData.societyName}
            onChange={handleChange}
            className="ad-input-f"
            required
          />
          <input
            type="text"
            name="societyAddress"
            placeholder="Society Address"
            value={formData.societyAddress}
            onChange={handleChange}
            className="ad-input-f"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="ad-input-f"
            required
          />
          <input
            type="text"
            name="district"
            placeholder="District"
            value={formData.district}
            onChange={handleChange}
            className="ad-input-f"
            required
          />
          <input
            type="text"
            name="postal"
            placeholder="Postal"
            value={formData.postal}
            onChange={handleChange}
            className="ad-input-f"
            required
          />
          <button type="submit">Register</button>
        </form>
        {errorMessage && <p className="error-message">{emailFromState}</p>}
      </div>
    </div>
  );
};

export default AdminRegisterPage;
