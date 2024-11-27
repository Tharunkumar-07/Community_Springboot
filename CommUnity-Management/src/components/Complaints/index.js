import React, { useState, useEffect } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiFileWarningFill } from "react-icons/ri";
import { MdOutlinePendingActions } from "react-icons/md";
import { RotatingLines } from "react-loader-spinner";
import { IoSearch } from "react-icons/io5";
import { IoIosEye } from "react-icons/io";
import { MdEdit, MdClose } from "react-icons/md";
import Cookies from "js-cookie";
import "./index.css";

import SideNavbar from "../SideNavbar";
import TopNavbar from "../TopNavbar";
import VendorSummaryCard from "../VendorSummaryCard";

const randomColors = ["#00A3FF", "#7C00C9", "#1974D9", "#01E032", "#EA7200"];

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const calculateComplaintsSummary = (complaints) => {
  const totalComplaints = complaints.length;
  const totalSolved = complaints.filter(
    (complaint) => complaint.status === "CLOSED"
  ).length;
  const totalUnsolved = totalComplaints - totalSolved;
  const totalBlockA = complaints.filter(
    (complaint) => complaint.flatNo[0] === "A"
  ).length;
  const totalBlockB = complaints.filter(
    (complaint) => complaint.flatNo[0] === "B"
  ).length;

  return [
    {
      title: "Total no of Complaints",
      value: totalComplaints,
      icon: <RiFileWarningFill />,
    },
    {
      title: "Total no of Complaints Solved",
      value: totalSolved,
      icon: <IoMdCheckmarkCircleOutline />,
    },
    {
      title: "Total no of Complaints Unsolved",
      value: totalUnsolved,
      icon: <MdOutlinePendingActions />,
    },
    {
      title: "Total no of Complaints in Block A",
      value: totalBlockA,
      icon: <RiFileWarningFill />,
    },
    {
      title: "Total no of Complaints in Block B",
      value: totalBlockB,
      icon: <RiFileWarningFill />,
    },
  ];
};

const Complaints = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDetails, setFormDetails] = useState({
    name: "",
    title: "",
    description: "",
  });

  const complaintsSummary = calculateComplaintsSummary(complaints);
  const fetchComplaints = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const role = Cookies.get("role");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data;
    const { residentId } = data;
    const url =
      role === "ADMIN"
        ? `http://localhost:9999/api/community/complaint-service/complaints/by-society/${id}`
        : `http://localhost:9999/api/community/complaint-service/complaints/by-resident/${residentId}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        const complaintsData = await response.json();
        console.log("c", complaintsData);
        setComplaints(complaintsData);
        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []); // Ensure data.id or other relevant dependencies are included if they change

  const filteredComplaints = complaints
    .filter((complaint) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "Open") return complaint.status === "OPEN";
      if (activeFilter === "Closed") return complaint.status === "CLOSED";
      return false;
    })
    .filter((complaint) =>
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleViewClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  const handleCloseComplaint = async (complaint) => {
    const jwtToken = Cookies.get("jwt_token");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data;

    const updatedComplaint = { ...complaint, status: "CLOSED", societyId: id };

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/complaint-service/complaints/update-complaint/${complaint.complaintId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(updatedComplaint),
        }
      );

      if (response.ok) {
        setApiStatus(apiStatusConstants.success);
        await fetchComplaints();
      } else {
        console.error("Failed to close the complaint.");
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error closing complaint:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const handleInputChange = (e) => {
    setFormDetails({
      ...formDetails,
      [e.target.name]: e.target.value,
    });
  };

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

  const handleSubmit = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data;

    const newComplaint = {
      personName: formDetails.name,
      title: formDetails.title,
      description: formDetails.description,
      status: "",
      societyId: id,
      residentId: data.residentId,
      flatNo: data.flatNo,
    };

    const response = await fetch(
      "http://localhost:9999/api/community/complaint-service/complaints/create-complaint",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(newComplaint),
      }
    );
    if (response.ok) {
      setApiStatus(apiStatusConstants.success);
      const createdComplaint = await response.json();
      setComplaints((prevComplaints) => [...prevComplaints, createdComplaint]);
      setFormDetails({ name: "", title: "", description: "" });
    } else {
      setApiStatus(apiStatusConstants.failure);
      console.error("Failed to create the complaint.");
      // Handle failure scenario, e.g., show an error message
    }
  };

  const renderSuccessView = () => {
    const role = Cookies.get("role");
    return (
      <div className="apartment-right-main-sec">
        <div className="vendor-services-summary">
          {complaintsSummary.map((summary, index) => {
            const randomColor = randomColors[index % randomColors.length];
            return (
              <VendorSummaryCard
                key={index}
                title={summary.title}
                value={summary.value}
                color={randomColor}
                icon={summary.icon}
              />
            );
          })}
        </div>
        {role === "RESIDENT" && (
          <form className="service-request-details" onSubmit={handleSubmit}>
            <h3 className="ap-head1">Submit Complaint</h3>
            <label className="ap-label">Name</label>
            <input
              type="text"
              placeholder="Enter your Name here"
              name="name"
              value={formDetails.name}
              onChange={handleInputChange}
              className="req-input"
              required
            />
            <label className="ap-label">Title</label>
            <input
              type="text"
              placeholder="Enter the title here..."
              name="title"
              value={formDetails.title}
              onChange={handleInputChange}
              className="req-input"
              required
            />
            <label className="ap-label">Description</label>
            <textarea
              placeholder="Any Specific details"
              name="description"
              value={formDetails.description}
              onChange={handleInputChange}
              rows={4}
              className="req-input-text"
              required
            />
            <button className="login-submit-button" type="submit">
              Sumbit
            </button>
          </form>
        )}

        <div className="complaints-filter">
          {["All", "Open", "Closed"].map((filter) => (
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

          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="ap-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IoSearch className="ap-search-icon" />
          </div>
          <div className="complaints-display-sec">
            <h1 className="ap-head1">Complaints List</h1>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Flat no</th>
                  <th>Complaint</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{complaint.personName}</td>
                    <td>{complaint.flatNo}</td>
                    <td>
                      {complaint.title}{" "}
                      <IoIosEye
                        className="eye-icon"
                        onClick={() => handleViewClick(complaint)}
                      />
                    </td>
                    <td>
                      {complaint.status}{" "}
                      {role === "ADMIN" && (
                        <button
                          onClick={() => handleCloseComplaint(complaint)}
                          className="hover-eff"
                          style={{}}
                          disabled={complaint.status === "CLOSED"}
                        >
                          Close
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {isModalOpen && selectedComplaint && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={handleCloseModal}>
                <MdClose />
              </button>
              <div className="modal">
                <h2>Complaint Details</h2>
                <div className="complaint-popup">
                  {selectedComplaint && (
                    <>
                      <p className="p-tag">
                        <strong>Name: </strong> {selectedComplaint.personName}
                      </p>
                      <p className="p-tag">
                        <strong>Flat No: </strong> {selectedComplaint.flatNo}
                      </p>
                      <p className="p-tag">
                        <strong>Title: </strong> {selectedComplaint.title}
                      </p>
                      <p className="p-tag">
                        <strong>Description: </strong>
                        {selectedComplaint.description}
                      </p>
                      <div>
                        <p>
                          <strong>Status: </strong>
                        </p>
                        <div
                          className={`${
                            selectedComplaint.status === "OPEN"
                              ? "status-open"
                              : "status-closed"
                          }`}
                        >
                          {selectedComplaint.status}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
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

  return (
    <div className="apartment-container">
      <SideNavbar />
      <div className="apartment-right-sec">
        <TopNavbar heading="Complaints" full={false} />
        {getView()}
      </div>
    </div>
  );
};

export default Complaints;
