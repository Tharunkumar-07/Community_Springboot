import React, { useState } from "react";
import { MdMiscellaneousServices } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCirclePlus } from "react-icons/fa6";
import { useEffect } from "react";
import "./index.css";
import VendorSummaryCard from "../VendorSummaryCard";
import Cookies from "js-cookie";

const randomColors = ["#00A3FF", "#7C00C9", "#1974D9", "#EA7200", "#01E032"];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * randomColors.length);
  return randomColors[randomIndex];
};

const calculateVendorSummary = (vendors) => {
  const uniqueServices = new Set(vendors.map((vendor) => vendor.service));
  const totalVendors = vendors.length;

  return [
    {
      title: "Total No of Services",
      value: uniqueServices.size,
      icon: <MdMiscellaneousServices />,
    },
  ];
};

const VendorList = (props) => {
  const { role, vendors } = props;
  const [showModal, setShowModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [formDetails, setFormDetails] = useState({
    name: "",
    company: "",
    service: "",
    phoneNo: "",
    email: "",
    societyId: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      setFormDetails((prevDetails) => ({
        ...prevDetails,
        societyId: data.id || "", // Set the societyId from data
      }));
    }
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    setFormDetails({
      ...formDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const jwtToken = Cookies.get("jwt_token");
      const response = await fetch(
        `http://localhost:9999/api/community/complaint-service/vendor/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(formDetails),
        }
      );

      if (response.ok) {
        // Optionally, you can refresh the vendor list or close the modal here
        toggleModal();
      } else {
        setErrorMessage("Failed to add the vendor. Try again later!");
        console.error("Failed to update vendor");
      }
    } catch (error) {
      setErrorMessage(`Error updating vendor:, ${error}`);
    }
  };

  const vendorSummary = calculateVendorSummary(vendors);
  console.log(vendors);

  return (
    <div className="vendor-list">
      <h2 className="ap-head1">Vendor Services</h2>
      <div className="vendor-services-summary">
        {vendorSummary.map((summary, index) => {
          const randomColor = getRandomColor();
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
      <div className="vendors-header">
        <h3>Vendors List</h3>
        {role === "ADMIN" && (
          <button className="login-submit-button" onClick={toggleModal}>
            Add Vendor
          </button>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={toggleModal}>
            <div
              className="v-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={toggleModal}>
                <MdClose />
              </button>
              <div className="modal">
                <div className="vendor-form">
                  <div className="image-upload-container">
                    <input
                      type="file"
                      id="imageUploadInput"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                  </div>

                  <input
                    type="text"
                    className="n-inp"
                    placeholder="Enter Vendor Name here..."
                    name="name"
                    value={formDetails.name}
                    onChange={handleInputChange}
                  />

                  <input
                    type="text"
                    className="n-inp"
                    placeholder="Enter Company here..."
                    name="company"
                    value={formDetails.company}
                    onChange={handleInputChange}
                  />

                  <input
                    type="text"
                    className="n-inp"
                    placeholder="Enter Service here..."
                    name="service"
                    value={formDetails.service}
                    onChange={handleInputChange}
                  />

                  <input
                    type="text"
                    className="n-inp"
                    placeholder="Enter Phone Number here..."
                    name="phoneNo"
                    value={formDetails.phoneNo}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    className="n-inp"
                    placeholder="Enter email here..."
                    name="email"
                    value={formDetails.email}
                    onChange={handleInputChange}
                  />
                  <div className="modal-actions">
                    <button
                      className="login-submit-button outline no-space size-less"
                      onClick={toggleModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="login-submit-button no-space size-less"
                      onClick={handleSubmit}
                    >
                      Save
                    </button>
                  </div>
                  {errorMessage !== "" && (
                    <p className="error-message">*{errorMessage}</p>
                  )}
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
            <th>Company</th>
            <th>Phone No</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor, index) => (
            <tr key={vendor.id}>
              <td>{index + 1}</td>
              <td>{vendor.name}</td>
              <td>{vendor.service}</td>
              <td>{vendor.company}</td>
              <td>{vendor.phoneNo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorList;
