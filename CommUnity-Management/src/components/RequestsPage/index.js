import React, { useState, useEffect } from "react";
import VendorList from "../VendorList";
import SideNavbar from "../SideNavbar";
import TopNavbar from "../TopNavbar";
import Cookies from "js-cookie";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const RequestsPage = () => {
  const [serviceType, setServiceType] = useState(""); // Initially empty, will be set dynamically
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [vendors, setVendors] = useState([]);
  const [formDetails, setFormDetails] = useState({
    address: "",
    phoneNumber: "",
    description: "",
  });

  useEffect(() => {
    const fetchVendors = async () => {
      setApiStatus(apiStatusConstants.inProgress);
      const jwtToken = Cookies.get("jwt_token");
      const data = JSON.parse(localStorage.getItem("data"));

      try {
        const response = await fetch(
          `http://localhost:9999/api/community/complaint-service/vendor/getBySociety/${data.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`, // Include the JWT token in the header
            },
          }
        );

        if (response.ok) {
          const vendorsData = await response.json();
          setVendors(vendorsData);

          const uniqueServiceTypes = getUniqueServiceTypes(vendorsData);

          // Set the first serviceType dynamically
          if (uniqueServiceTypes.length > 0) {
            setServiceType(uniqueServiceTypes[0]);
          }

          setApiStatus(apiStatusConstants.success);
        } else {
          setApiStatus(apiStatusConstants.failure);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setApiStatus(apiStatusConstants.failure);
      }
    };

    fetchVendors();
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id, residentId } = data;

    const newRequest = {
      serviceType: serviceType,
      address: formDetails.address,
      phoneNo: formDetails.phoneNumber,
      description: formDetails.description,
      societyId: id,
    };

    const response = await fetch(
      "http://localhost:9999/api/community/complaint-service/request/create-request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(newRequest),
      }
    );
    if (response.ok) {
      setApiStatus(apiStatusConstants.success);
      setFormDetails({ address: "", phoneNumber: "", description: "" });
      toast.success("Request sent successfully!");
    } else {
      setApiStatus(apiStatusConstants.failure);
      console.error("Failed to create the complaint.");
    }
  };

  const getUniqueServiceTypes = (vendorsList) => {
    const serviceTypes = vendorsList.map((vendor) => vendor.service);
    return [...new Set(serviceTypes)];
  };

  const handleServiceTypeChange = (type) => {
    setServiceType(type);
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

  const renderSuccessView = () => {
    const role = Cookies.get("role");
    const uniqueServiceTypes = getUniqueServiceTypes(vendors);
    const filteredVendors = vendors.filter(
      (vendor) => vendor.service === serviceType
    );

    return (
      <div className="apartment-right-main-sec">
        <h2 className="ap-head1">Select Service Type</h2>
        <div className="service-types">
          {uniqueServiceTypes.map((type) => (
            <button
              key={type}
              className={`round-button ${serviceType === type ? "active" : ""}`}
              onClick={() => handleServiceTypeChange(type)}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="req-row">
          <form className="service-request-details" onSubmit={handleRequest}>
            <h3 className="ap-head1">Service Request Details</h3>
            <label className="ap-label">Address</label>
            <input
              type="text"
              placeholder="Enter your Address here"
              name="address"
              value={formDetails.address}
              onChange={handleInputChange}
              className="req-input"
              required
            />
            <label className="ap-label">Phone no</label>
            <input
              type="text"
              placeholder="Enter the Phone no"
              name="phoneNumber"
              value={formDetails.phoneNumber}
              onChange={handleInputChange}
              className="req-input"
              required
            />
            <label className="ap-label">Additional Notes</label>
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
              Send Request
            </button>
          </form>
          <img
            src="https://res.cloudinary.com/digbzwlfx/image/upload/v1725501475/alison_courseware_intro_1221_zlh2kv.jpg"
            alt="request"
            className="image-r"
          />
        </div>

        <VendorList vendors={filteredVendors} role={role} />
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
        <TopNavbar heading="Request Services" full={false} />
        {getView()}
      </div>
    </div>
  );
};

export default RequestsPage;
