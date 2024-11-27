import React from "react";
import LandingNavbar from "../LandingNavbar";
import Footer from "../Footer";
import { Link } from "react-router-dom";
import "./index.css";

function LandingPage() {
  return (
    <div className="landingPage">
      <LandingNavbar />
      <div className="mainContent">
        <div className="landing-top-section">
          <div className="heroContent">
            <p className="heroText">
              Welcome to CommUnity, the ultimate platform designed to streamline
              housing society management and foster community connections.
              Whether you're a resident, administrator, or non-resident,
              CommUnity brings convenience to your fingertips with a
              comprehensive set of features tailored for everyone.
            </p>
            <div className="ctaWrapper">
              <Link
                to="/join-here"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontFamily: "Poppins",
                }}
              >
                <button className="ctaButton">Get Started</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="about-content">
          <h2 className="aboutTitle">About CommUnity</h2>
          <p className="desc-landing">
            Our website is dedicated to providing seamless interaction and
            management within our community. We strive to offer the best
            services to ensure a cohesive and supportive environment for all
            members.
          </p>
        </div>
        <div className="whyCommUnity">
          <h3 style={{ fontWeight: 700, lineHeight: "30px" }}>
            Why CommUnity?
          </h3>
          <p style={{ textAlign: "center" }}>
            CommUnity makes society management simple and efficient with
            seamless account management, instant access to a digital
            noticeboard, and easy online maintenance payments. Residents can
            raise and track complaints, join clubs, and share personal
            recommendations. Admins can post commercial updates and conduct
            polls. Stay informed with emergency contacts, security personnel
            details, and real-time WhatsApp notifications, ensuring a connected
            and engaged community experience.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
