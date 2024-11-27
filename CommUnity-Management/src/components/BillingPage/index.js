import React, { useState, useEffect } from "react";
import SideNavbar from "../SideNavbar";
import TopNavbar from "../TopNavbar";
import Cookies from "js-cookie";
import { RotatingLines } from "react-loader-spinner";
import "./index.css";
import { useLocation } from "react-router-dom";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const BillingPage = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const location = useLocation();
  const [payments, setPayments] = useState([]); // list to store all the payments of a particular society
  const data = JSON.parse(localStorage.getItem("data")); //accessing data from the local storage

  // fetching the payment status of a particular society
  const fetchPaymentsBySociety = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/payment/by-society/${data.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const paymentsData = await response.json();
        console.log(paymentsData);
        setPayments(paymentsData);
        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  // fetching the payment status of a particular flat
  const fetchPaymentStatus = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    // const data = JSON.parse(localStorage.getItem("data")); //accessing data from the local storage

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/payment/${data.flatNo}/${data.societyId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      console.log(response);

      if (response.ok) {
        const paymentData = await response.json();
        setPaymentStatus(paymentData.status);
        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching payment status:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const updatePaymentStatus = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    // const data = JSON.parse(localStorage.getItem("data")); //accessing data from the local storage

    try {
      const updateResponse = await fetch(
        `http://localhost:9999/api/community/payment/update/${data.flatNo}/${data.societyId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (updateResponse.ok) {
        console.log("Payment status updated to PAID for " + data.flatNo);
        setPaymentStatus("PAID");
      } else {
        console.error("Failed to update payment status for " + data.flatNo);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  // Fetch the payment when the component loads
  useEffect(() => {
    data.role === "RESIDENT" ? fetchPaymentStatus() : fetchPaymentsBySociety();
  }, []);

  // Add the useEffect hook to check the payment status from the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paidParam = queryParams.get("razorpay_payment_link_status");
    if (paidParam === "paid") {
      updatePaymentStatus();
    }
  }, [location]);

  const handlePayment = async () => {
    const jwtToken = Cookies.get("jwt_token");

    try {
      const data = JSON.parse(localStorage.getItem("data"));

      const newPayment = {
        amount: 3500,
        description: `Maintenance bill for flat ${data.flatNo}`,
        email: data.email,
        name: data.name,
        phoneNo: data.phoneNo,
      };

      const createPaymentResponse = await fetch(
        "http://localhost:9999/api/community/payment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(newPayment),
        }
      );
      console.log(createPaymentResponse);

      if (createPaymentResponse.ok) {
        const paymentLink = await createPaymentResponse.text();
        console.log(paymentLink);
        console.log("Payment link created successfully");

        // Redirect to the payment link
        window.location.href = paymentLink;
        if (paymentStatus === "paid") {
          console.log("payment paid");
        }
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
    const role = Cookies.get("role");
    return (
      <div className="apartment-right-main-sec full-height">
        {role === "RESIDENT" && (
          <div className="billing-sec">
            <h1 className="ap-head1">Monthly Maintenance Bill: 3500/-</h1>
            {paymentStatus === "PAID" ? (
              <button
                className="red-btn"
                style={{
                  backgroundColor: "lightgrey",
                  color: "darkgrey",
                  border: "2px solid darkgrey",
                }}
                disabled
              >
                Payment Completed
              </button>
            ) : (
              <button className="red-btn" onClick={handlePayment}>
                Pay Now
              </button>
            )}
          </div>
        )}
        {role === "ADMIN" && (
          <div className="billing-sec">
            <h1>Payment status of the residents</h1>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Flat No</th>
                  <th>Amount</th>
                  <th>Payment ID</th>
                  <th>Payment Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.flatNo}</td>
                    <td>{data.amount}</td>
                    <td>{data.paymentId}</td>
                    <td>{data.paymentDate}</td>
                    <td
                      className={
                        data.status === "PENDING"
                          ? "pending-status"
                          : "paid-status"
                      }
                    >
                      {data.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        <TopNavbar heading="Billings " full={false} />
        {getView()}
      </div>
    </div>
  );
};

export default BillingPage;
