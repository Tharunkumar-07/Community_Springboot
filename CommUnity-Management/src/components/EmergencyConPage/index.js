import React from "react";
import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import SideNavbar from "../SideNavbar";
import TopNavbar from "../TopNavbar";
import SecurityGPage from "../SecurityGPage";
import { MdModeEdit } from "react-icons/md";
import Cookies from "js-cookie";
import { RotatingLines } from "react-loader-spinner";
import { MdDelete } from "react-icons/md";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

// const contacts = [
//   { id: 1, name: "Kathir", service: "Plumbing", phone: "9626488117" },
//   { id: 2, name: "Murugan", service: "Fire Station", phone: "9445497450" },
//   { id: 3, name: "Iyyappan", service: "Pharmacy", phone: "9888775670" },
//   {
//     id: 4,
//     name: "Paramasivam",
//     service: "Police Station",
//     phone: "9778688794",
//   },
//   { id: 5, name: "Dev", service: "Doctor", phone: "8659434445" },
// ];

const EmergencyContacts = () => {
  const [showModal, setShowModal] = useState(false);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [serviceType, setServiceType] = useState("");

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
        `http://localhost:9999/api/community/management-service/emergency-contacts/get-by-society/${id}`,
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

        setContacts(fetchedData); // Set the fetched data here

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

  const handleAddContacts = async () => {
    const jwtToken = Cookies.get("jwt_token");

    try {
      const data = JSON.parse(localStorage.getItem("data"));

      const newSecurity = {
        personName: name,
        serviceType: serviceType,
        phoneNo: phoneNo,
        societyId: data.id, // Assuming `societyId` is the societyId
      };

      const createNoticeResponse = await fetch(
        "http://localhost:9999/api/community/management-service/emergency-contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(newSecurity),
        }
      );

      console.log("c", createNoticeResponse);

      if (createNoticeResponse.ok) {
        console.log("Notice created successfully");
        setPhoneNo("");
        setName("");
        setServiceType("");
        toggleModal();
        setApiStatus(apiStatusConstants.success);
        await fetchDetails();
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
      console.error("Error creating notice:", error);
    }
  };

  const handleDeleteContacts = async (emergencyId) => {
    const jwtToken = Cookies.get("jwt_token");

    try {
      const data = JSON.parse(localStorage.getItem("data"));

      const createNoticeResponse = await fetch(
        `http://localhost:9999/api/community/management-service/emergency-contacts/delete-emergency-contact/${emergencyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log("c", createNoticeResponse);

      if (createNoticeResponse.ok) {
        console.log("Notice created successfully");

        setApiStatus(apiStatusConstants.success);
        await fetchDetails();
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
      console.error("Error creating notice:", error);
    }
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
    return (
      <div className="apartment-right-main-sec">
        <div className="ap-lst">
          <h3 className="ap-head1">Emergency Contacts</h3>
          {role === "ADMIN" && (
            <button className="login-submit-button" onClick={toggleModal}>
              + Add Contact
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
                  <h3 className="ap-head1 space-above">
                    Add Emergency Contact
                  </h3>
                  <div className="vendor-form">
                    <input
                      type="text"
                      className="n-inp"
                      placeholder="Enter the service here..."
                      onChange={(e) => setServiceType(e.target.value)}
                    />

                    <input
                      type="text"
                      className="n-inp"
                      placeholder="Enter the Name here..."
                      onChange={(e) => setName(e.target.value)}
                    />

                    <input
                      type="text"
                      className="n-inp"
                      placeholder="Enter the Phone Number here..."
                      onChange={(e) => setPhoneNo(e.target.value)}
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
                        onClick={handleAddContacts}
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

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Service</th>
              <th>Phone no</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={contact.id}>
                <td>{index + 1}</td>
                <td>{contact.personName}</td>
                <td>{contact.serviceType}</td>
                <td>{contact.phoneNo}</td>
                {role === "ADMIN" && (
                  <td>
                    <button
                      onClick={() => handleDeleteContacts(contact.emergencyId)}
                      style={{ backgroundColor: "transparent", border: "none" }}
                    >
                      <MdDelete
                        className="em-ic"
                        style={{ color: "#1a4258" }}
                      />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <SecurityGPage />
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

  const role = Cookies.get("role");
  return (
    <div className="apartment-container">
      <SideNavbar />
      <div className="apartment-right-sec">
        <TopNavbar heading="Emergency Contacts" full={false} />
        {getView()}
      </div>
    </div>
  );
};

export default EmergencyContacts;
