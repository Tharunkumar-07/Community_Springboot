import "./index.css";
import TopNavbar from "../TopNavbar";
import SideNavbar from "../SideNavbar";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { RotatingLines } from "react-loader-spinner";
import PersonCard from "../PersonCard";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const Apartments = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [selectedBlock, setSelectedBlock] = useState("Block A");
  const [apartments, setApartments] = useState([]);

  const filteredMembers = apartments.filter(
    (member) => member.role !== "ADMIN"
  );
  const filterByBlock = filteredMembers.filter(
    (each) => each.flatNo[0] === selectedBlock[6]
  );

  const fetchApartments = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data; // Assuming `id` is the societyId

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/management-service/residents/findby-societyid/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        const apartmentsData = await response.json();
        setApartments(apartmentsData);
        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching apartments data:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const renderFailureView = () => (
    <div className="error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="failure"
        className="failure-img"
      />
      <h1 className="failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  );

  const renderLoadingView = () => (
    <div className="loader-container">
      <RotatingLines
        visible={true}
        height="96"
        width="96"
        color="#1a4258"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );

  const renderSuccessView = () => (
    <div className="user-main-sec left-space">
      <div className="top-bar">
        <button
          className={`block-button ${
            selectedBlock === "Block A" ? "active" : ""
          }`}
          onClick={() => setSelectedBlock("Block A")}
        >
          Block A
        </button>
        <button
          className={`block-button ${
            selectedBlock === "Block B" ? "active" : ""
          }`}
          onClick={() => setSelectedBlock("Block B")}
        >
          Block B
        </button>
      </div>
      {/* <div className="m-search-sec">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name..."
          className="ap-search-input"
        />
        <IoSearch className="ap-search-icon" />
      </div>
    </div> */}

      <div className="members-grid">
        {filterByBlock.map((member, index) => (
          <PersonCard
            key={index}
            name={member.name}
            block={member.flatNo[0]}
            room={member.flatNo}
            phone={member.phoneNo}
            email={member.email}
          />
        ))}
      </div>
    </div>
  );

  const getView = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <div className="apartments-page">
      <div className="apartments-content">
        <TopNavbar heading="Apartments" full={true} />
        {getView()}
      </div>
    </div>
  );
};

export default Apartments;
