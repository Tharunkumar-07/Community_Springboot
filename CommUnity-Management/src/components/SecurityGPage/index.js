import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Cookies from "js-cookie";
import SideNavbar from "../SideNavbar";
import TopNavbar from "../TopNavbar";
import { RotatingLines } from "react-loader-spinner";

import "./index.css";

const dummySecurityData = [
  {
    name: "Kathir",
    block: "A",
    phoneNumber: "9626488117",
  },
  {
    name: "Murugan",
    block: "A",
    phoneNumber: "9445497450",
  },
  {
    name: "Iyyappan",
    block: "A",
    phoneNumber: "9888775670",
  },
  {
    name: "Siva",
    block: "A",
    phoneNumber: "9778868794",
  },
  {
    name: "Ganesh",
    block: "B",
    phoneNumber: "9080756453",
  },
  {
    name: "Kumar",
    block: "B",
    phoneNumber: "7896573580",
  },
  {
    name: "Sundharaj",
    block: "B",
    phoneNumber: "94630238576",
  },
  {
    name: "Nallasivam",
    block: "B",
    phoneNumber: "8903569358",
  },
];

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const SecurityGPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [securityDetils, setSecurityDetails] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [showModal, setShowModal] = useState(false);
  const role = Cookies.get("role");
  const [guardName, setGuardName] = useState("");
  const [block, setBlock] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const fetchDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data; // Assuming `id` is the societyId

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/management-service/security-details/get-by-society/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        const fetchedData = await response.json();
        console.log(fetchedData);

        setSecurityDetails(fetchedData); // Set the fetched data here

        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleAddSecurity = async () => {
    const jwtToken = Cookies.get("jwt_token");

    try {
      const data = JSON.parse(localStorage.getItem("data"));

      const newSecurity = {
        securityName: guardName,
        phoneNo: phoneNumber,
        blockNo: block,
        societyId: data.id, // Assuming `societyId` is the societyId
      };

      const createNoticeResponse = await fetch(
        "http://localhost:9999/api/community/management-service/security-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(newSecurity),
        }
      );

      if (createNoticeResponse.ok) {
        console.log("Notice created successfully");
        setPhoneNumber("");
        setBlock("");
        setGuardName("");
        toggleModal();
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
      console.error("Error creating notice:", error);
    }
  };

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

  const filterSecurityData = () => {
    if (activeFilter === "All") {
      return securityDetils;
    }
    // Convert "Block - A" to "A" and "Block - B" to "B"
    const blockFilter = activeFilter === "Block - A" ? "A" : "B";
    return securityDetils.filter((data) => data.blockNo === blockFilter);
  };

  const renderSuccessView = () => {
  
    const filteredSecurityData = filterSecurityData();
    console.log("f", filteredSecurityData);

    return (
      <div className="apartment-right-main-sec full-width">
        <h2 className="ap-head1 mar-top">Security Guard Details</h2>
        <div className="security-filter">
          {["All", "Block - A", "Block - B"].map((filter) => (
            <button
              key={filter}
              className={`c-block-button ${
                activeFilter === filter ? "active" : ""
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
          {role === "ADMIN" && (
            <button
              className="login-submit-button no-space align-end"
              onClick={toggleModal}
            >
              + Add Security
            </button>
          )}

          {showModal && (
            <div className="modal-overlay" onClick={toggleModal}>
              <div
                className="s-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-btn" onClick={toggleModal}>
                  <MdClose />
                </button>
                <div className="modal">
                  <h3 className="ap-head1">Add Security Guard</h3>
                  <div className="vendor-form">
                    <input
                      type="text"
                      className="n-inp"
                      placeholder="Enter Security Guard Name here..."
                      value={guardName}
                      onChange={(e) => setGuardName(e.target.value)}
                      required
                    />

                    <input
                      type="text"
                      className="n-inp"
                      placeholder="Enter the Block here..."
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                      required
                    />

                    <input
                      type="text"
                      className="n-inp"
                      placeholder="Enter the Phone Number here..."
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />

                    <div className="modal-actions space-more">
                      <button
                        className="login-submit-button outline no-space size-less"
                        onClick={toggleModal}
                      >
                        Cancel
                      </button>
                      <button
                        className="login-submit-button no-space size-less"
                        onClick={handleAddSecurity}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="security-display-sec">
          {/* Render blocks based on active filter */}
          {(activeFilter === "All" || activeFilter === "Block - A") && (
            <div>
              <h2 className="block-header">Block - A</h2>
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Block</th>
                    <th>Phone no</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSecurityData
                    .filter((data) => data.blockNo === "A")
                    .map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data.securityName}</td>
                        <td>{data.blockNo}</td>
                        <td>{data.phoneNo}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {(activeFilter === "All" || activeFilter === "Block - B") && (
            <div>
              <h2 className="block-header">Block - B</h2>
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Block</th>
                    <th>Phone no</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSecurityData
                    .filter((data) => data.blockNo === "B")
                    .map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data.securityName}</td>
                        <td>{data.blockNo}</td>
                        <td>{data.phoneNo}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

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

  return getView();
};

export default SecurityGPage;
