import React, { useState, useEffect } from "react";
import SideNavbar from "../SideNavbar";
import TopNavbar from "../TopNavbar";
import Cookies from "js-cookie";
import { RotatingLines } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import { MdClose } from "react-icons/md";
import Card from "../Card";

import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};
const formatDateAndTime = (dateTime) => {
  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString(); // Format as 'MM/DD/YYYY'
  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }); // Format as 'HH:MM AM/PM'
  return { formattedDate, formattedTime };
};

const FeedbackPage = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [feedback, setFeedback] = useState("");
  const [event, setEvent] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const { eventId } = useParams();

  const toggleModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  const fetchEventDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const role = Cookies.get("role");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data;

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/event-service/event/get-events/${eventId}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        const eventData = await response.json();
        console.log("c", eventData);
        setEvent(eventData);
        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const fetchFeedbacks = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const role = Cookies.get("role");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data;

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/event-service/feedback/by-event/${eventId}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        const feedbackData = await response.json();
        console.log("c", feedbackData);
        setFeedbackData(feedbackData);
        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const handleAddFeedback = async () => {
    const jwtToken = Cookies.get("jwt_token");

    try {
      const newFeedback = {
        content: feedback,
        eventId: eventId, // Assuming `societyId` is the societyId
      };

      const createEventResponse = await fetch(
        "http://localhost:9999/api/community/event-service/feedback/create-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(newFeedback),
        }
      );

      if (createEventResponse.ok) {
        console.log("Feedback Submitted successfully");
        setFeedback("");
        toggleModal();
        await fetchFeedbacks();
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
      console.error("Error creating event:", error);
    }
  };

  useEffect(() => {
    fetchEventDetails();
    fetchFeedbacks();
  }, []);

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
      <div className="user-main-sec">
        <div className="feedback-details width">
          <div className="col-cont">
            <Card
              key={event.eventId}
              id={event.eventId}
              image={event.eventImage}
              title={event.eventName}
              description={event.eventDetails}
              date={formatDateAndTime(event.eventDate).formattedDate}
              time={formatDateAndTime(event.eventDate).formattedTime}
              type="feedback"
            />
            <button
              className="login-submit-button no-space right-aligns"
              onClick={toggleModal}
            >
              Give Feedback
            </button>
            {showModal && (
              <div className="modal-overlay" onClick={toggleModal}>
                <div
                  className="modal-content less-width"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="close-btn" onClick={toggleModal}>
                    <MdClose />
                  </button>
                  <div className="modal">
                    <p className="head4 n-no-space">Give Feedback</p>
                    <div className="notice-form center">
                      <textarea
                        className="n-textarea"
                        placeholder="Enter the description here..."
                        rows={5}
                        value={feedback}
                        onChange={(e) => {
                          setFeedback(e.target.value);
                        }}
                      />
                      <button
                        className="login-submit-button no-space right-align"
                        onClick={handleAddFeedback}
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <h3 className="head-f-center">Feedbacks by the Residents</h3>
            <ul className="feedback-list">
              {feedbackData.map((each, index) => (
                <li key={each.id} className="feedback-item">
                  <span className="feedback-index">{index + 1}.</span>
                  <span className="feedback-content">{each.content}</span>
                </li>
              ))}
            </ul>
          </div>
          <img
            src="https://res.cloudinary.com/digbzwlfx/image/upload/v1725501028/feedback-loop-concept-illustration_114360-17629_f1rgnj.avif"
            alt="feedback"
            style={{ height: "400px", width: "500px" }}
          />
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
  return (
    <div className="user-container">
      <TopNavbar heading="Feedback" full={true} />
      {getView()}
    </div>
  );
};

export default FeedbackPage;
