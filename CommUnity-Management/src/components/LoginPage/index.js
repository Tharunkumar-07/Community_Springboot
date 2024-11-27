import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode without curly braces
import "./index.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (id === "email") {
      setEmail(value);
    } else if (id === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:9999/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const jwtToken = data.token;
        const decodedToken = jwtDecode(jwtToken);
        const roles = decodedToken.roles;
        const userRole = roles[0].slice(5); // Remove "ROLE_" from role string

        Cookies.set("jwt_token", jwtToken);
        Cookies.set("role", userRole);

        const url =
          userRole === "ADMIN"
            ? `http://localhost:9999/api/community/management-service/societies/by-email/${email}`
            : `http://localhost:9999/api/community/management-service/residents/findby-email/${email}`;

        const residentResponse = await fetch(url, {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Include the JWT token in the header
          },
        });

        if (residentResponse.ok) {
          const data1 = await residentResponse.json();
          const newData = {
            ...data1,
            id: userRole === "ADMIN" ? data1.id : data1.societyId,
          };
          console.log(data1);
          setResult(data1);
          localStorage.setItem("data", JSON.stringify(newData));
          navigate("/dashboard");
        } else if (residentResponse.status === 404) {
          // User not found in residents table
          if (userRole === "ADMIN") {
            navigate("/admin-register", { state: { email } });
          } else {
            navigate("/user-register", { state: { email } });
          }
        } else {
          // Handle other errors from the resident API
          const errorData = await residentResponse.json();

          setErrorMessage(
            errorData || "An error occurred while checking user details."
          );
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.description || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred during login.");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-left-sec"></div>
      <div className="login-right-sec">
        <img
          src="https://res.cloudinary.com/digbzwlfx/image/upload/v1724905823/Group_315_gyjyyl.png"
          alt="main-logo"
          className="login-main-logo"
        />
        <div className="login-title-wrapper">
          <h1 className="login-title">Login</h1>
          <p className="login-welcome-text">Welcome Back</p>
        </div>
        <form onSubmit={handleSubmit} className="new-form">
          <div className="login-input-group">
            <label htmlFor="email" className="login-input-label">
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              className="login-input-field"
              value={email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="login-input-group">
            <label htmlFor="password" className="login-input-label">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="login-input-field"
              value={password}
              onChange={handleInputChange}
              required
            />
          </div>
          {errorMessage && <p className="error-message">* {errorMessage}</p>}
          <button type="submit" className="login-submit-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
