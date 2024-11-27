import React, { Component } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import "./index.css";

const socialIcons = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/10e59c07e7b33df4a6f981d27ab77a2d960eb5ce45c204e441c22c596d5355c6?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3",
    alt: "Instagram icon",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/d5590da34d87462254eead044c379896ced1ce5b46685b52dbf97652a01a9706?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3",
    alt: "Social media icon",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/9e15ed8ecaca9cb459ec88c67dbcbe895c653f83242d93ea5c3904f2497928c3?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3",
    alt: "Social media icon",
  },
  {
    src: "https://res.cloudinary.com/digbzwlfx/image/upload/v1724847481/Frame_10_o8vdg9.png",
    alt: "Instagram icon",
  },
];
const SocialIcon = ({ src, alt }) => (
  <img loading="lazy" src={src} alt={alt} className="socialIcon" />
);

class Footer extends Component {
  render() {
    return (
      <section className="contactSection">
        <div className="contentWrapper">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/49ffc98388d47194ab33ecd76f6006473cc4a738c4a49bcbbcd183df29c513d6?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3"
            alt="Company logo"
            className="footer-logo"
          />
          <h1 className="mainHeading">Simplifying Society, Connecting Lives</h1>
          <h2 className="subHeading">Contact us on</h2>
          <div className="socialIcons">
            {socialIcons.map((icon, index) => (
              <SocialIcon key={index} {...icon} />
            ))}
          </div>
        </div>
        <div className="contactInfo">
          <div className="emailWrapper">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/6044b952dc456092fd42b3d4ff83fa698068ef40314a91745444835b0e3e1110?placeholderIfAbsent=true&apiKey=c0675f285b7e411a80445cebc7c0b8d3"
              alt="Email icon"
              className="emailIcon"
            />
            <address className="emailAddress">
              <a href="mailto:CommUnityMail@mail.com" className="link">
                CommUnityMail@mail.com
              </a>
            </address>
          </div>
          <div className="phoneWrapper">
            <div className="phoneNumber">
              {/* <FaPhoneAlt /> */}
              <a href="tel:9988776655" className="link">
                9988776655
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Footer;
