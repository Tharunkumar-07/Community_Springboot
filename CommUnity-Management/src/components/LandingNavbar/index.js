import { Component } from "react";
import "./index.css";

class LandingNavbar extends Component {
  render() {
    return (
      <div className="headerWrapper">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/fc2ca5c49064cee6d71e04bceba50dd355da359ff4d91fadeda140894fd91140?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3"
          className="logo"
          alt="CommUnity Logo"
        />
        <nav className="navWrapper">
          <ul className="navList">
            <li className="navItem">
              <a href="#home" className="navLink">
                Home
              </a>
            </li>
            <li className="navItem">
              <a href="#about" className="navLink">
                About Us
              </a>
            </li>
            <li className="navItem">
              <a href="#contact" className="navLink">
                Contact Us
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default LandingNavbar;
