import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./index.css"; // Import global styles

class JoinHere extends Component {
  render() {
    return (
      <main className="joinPage">
        <div className="image-section"></div>
        <section className="j-contentWrapper">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/288dca6a01cbb4b0aac4c2b894efec77620adb1cf9bf6d1eecbf92a1465f37f3?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3"
            className="j-logo"
            alt="Company logo"
          />
          <div className="joinSection">
            <h1 className="joinTitle">Join Here</h1>
            <div className="buttonGroup">
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button className="j-button-content">Login</button>
              </Link>
              <p>Or </p>
              <Link to="/user-signup" style={{ textDecoration: "none" }}>
                <button className="j-button-content">Sign up</button>
              </Link>
            </div>
          </div>
          {/* <div className="registerSection">
            <p className="registerText">Register your community</p>
            <button className="registerButton">Register</button>
          </div> */}
        </section>
      </main>
    );
  }
}

export default JoinHere;
