import React, { Component } from "react";
import Cookies from "js-cookie";
import "./index.css";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      role: "", // default role
      errorMessage: "",
    };
  }

  handleInputChange = (event) => {
    const { id, value } = event.target;
    this.setState({
      [id]: value,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { email, password, role } = this.state;

    try {
      const response = await fetch("http://localhost:9999/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          role: role.toUpperCase(), // Convert role to uppercase as required by the API
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the response contains a token and user info
        console.log(data);
        window.location.href = "/login"; // Example redirect to a dashboard page
      } else {
        const errorData = await response.json();
        this.setState({ errorMessage: errorData.message || "Sign up failed" });
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      this.setState({ errorMessage: "An error occurred during sign up." });
    }
  };

  render() {
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
            <h1 className="login-title">Sign Up</h1>
          </div>
          <form onSubmit={this.handleSubmit} className="new-form">
            <div className="login-input-group">
              <label htmlFor="email" className="login-input-label">
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                className="login-input-field"
                value={this.state.email}
                onChange={this.handleInputChange}
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
                value={this.state.password}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="login-input-group">
              <label htmlFor="role" className="login-input-label">
                ROLE
              </label>
              <select
                id="role"
                className="login-input-field"
                value={this.state.role}
                onChange={this.handleInputChange}
                required
              >
                <option value="admin">Admin</option>
                <option value="resident">Resident</option>
              </select>
            </div>
            {this.state.errorMessage && (
              <p className="error-message">{this.state.errorMessage}</p>
            )}
            <button type="submit" className="login-submit-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default SignUp;
