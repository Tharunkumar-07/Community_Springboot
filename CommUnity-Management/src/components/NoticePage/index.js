import React, { useState, useEffect, useRef } from "react";
import SideNavbar from "../SideNavbar";
import TopNavbar from "../TopNavbar";
import Card from "../Card";
import Cookies from "js-cookie";
import { RotatingLines } from "react-loader-spinner";
import { HiPlusCircle } from "react-icons/hi2";
import { MdClose } from "react-icons/md";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const formatDateTime = (dateTime) => {
  console.log("Date Time Received:", dateTime);
  const date = new Date(dateTime);
  console.log("Date Object:", date);
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", dateTime);
    return ""; // or return a default value
  }
  return date.toISOString();
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

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [showModal, setShowModal] = useState(false);
  const [newNoticeName, setNewNoticeName] = useState("");
  const [newNoticeDate, setNewNoticeDate] = useState("");
  const [newNoticeDescription, setNewNoticeDescription] = useState("");
  const [newNoticeImage, setNewNoticeImage] = useState(null);
  const [noticeFormattedData, setNoticeFormattedData] = useState([]);
  const [newNoticeImagePreview, setNewNoticeImagePreview] = useState(null);

  // Edit state
  const [editNoticeId, setEditNoticeId] = useState(null);
  const [editNoticeName, setEditNoticeName] = useState("");
  const [editNoticeDate, setEditNoticeDate] = useState("");
  const [editNoticeDescription, setEditNoticeDescription] = useState("");
  const [editNoticeImage, setEditNoticeImage] = useState(null);
  const [editNoticeImagePreview, setEditNoticeImagePreview] = useState(null);

  const toggleModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  const fetchNotices = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data; // Assuming `id` is the societyId

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/event-service/notice/notice-by-society/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        const noticesData = await response.json();
        console.log("notices", noticesData);

        // Format the notices data as needed
        const formattedNotices = noticesData.map((notice) => ({
          id: notice.noticeId,
          title: notice.heading,
          description: notice.content,
          date: formatDateTime(notice.datePosted),
          image: notice.noticeImage,
        }));

        const noticeFormattedData = noticesData.map((notice) => {
          const { formattedDate, formattedTime } = formatDateAndTime(
            notice.datePosted
          );
          return {
            id: notice.noticeId,
            title: notice.heading,
            description: notice.content,
            date: formattedDate,
            time: formattedTime,
            image: notice.noticeImage,
          };
        });

        setNotices(formattedNotices);
        setNoticeFormattedData(noticeFormattedData);

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
    fetchNotices();
  }, []);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // Append the file
    formData.append("upload_preset", "nd6vm7fo"); // Append the preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/digbzwlfx/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        setApiStatus(apiStatusConstants.failure);
      }

      const result = await response.json();
      await fetchNotices();
      return result.url; // Return the uploaded image URL
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
      alert("There was a problem with the image upload.");
    }
  };

  const handleAddNotice = async () => {
    const jwtToken = Cookies.get("jwt_token");

    if (!newNoticeImage) {
      alert("Please select an image to upload.");
      return;
    }

    try {
      const imageUrl = await handleImageUpload(newNoticeImage);
      if (!imageUrl) {
        alert("Failed to upload image.");
        return;
      }

      const data = JSON.parse(localStorage.getItem("data"));

      const newNotice = {
        heading: newNoticeName,
        content: newNoticeDescription,
        noticeImage: imageUrl,
        societyId: data.id, // Assuming `societyId` is the societyId
      };

      const createNoticeResponse = await fetch(
        "http://localhost:9999/api/community/event-service/notice/create-notice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(newNotice),
        }
      );

      if (createNoticeResponse.ok) {
        console.log("Notice created successfully");
        setNewNoticeName("");
        setNewNoticeDate("");
        setNewNoticeDescription("");
        setNewNoticeImage(null);
        setNewNoticeImagePreview(null);
        toggleModal();
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
      console.error("Error creating notice:", error);
    }
  };

  const handleEditNotice = async () => {
    const data = JSON.parse(localStorage.getItem("data"));
    if (!editNoticeImage && !editNoticeImagePreview) {
      alert("Please select an image to upload.");
      return;
    }

    const jwtToken = Cookies.get("jwt_token");

    try {
      const imageUrl = editNoticeImage
        ? await handleImageUpload(editNoticeImage)
        : editNoticeImagePreview; // Use existing image if no new image

      const updatedNotice = {
        noticeId: editNoticeId,
        heading: editNoticeName,
        content: editNoticeDescription,
        noticeDate: editNoticeDate,
        noticeImage: imageUrl || "", // Use existing image URL if no new image is uploaded
        societyId: data.id, // Assuming `societyId` is the societyId
      };

      const response = await fetch(
        `http://localhost:9999/api/community/event-service/notice/update-notices/${editNoticeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(updatedNotice),
        }
      );

      if (response.ok) {
        console.log("Notice updated successfully");
        setEditNoticeId(null);
        setEditNoticeName("");
        setEditNoticeDate("");
        setEditNoticeDescription("");
        setEditNoticeImage(null);
        setEditNoticeImagePreview(null);
        toggleModal();
        fetchNotices();
      } else {
        console.error("Failed to update the notice");
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error updating notice:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };
  const handleDeleteNotice = async (noticeId) => {
    const jwtToken = Cookies.get("jwt_token");

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/event-service/notice/delete-notices/${noticeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        console.log("Event deleted successfully");
        fetchNotices(); // Refresh the event list
      } else {
        console.error("Failed to delete event");
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const handleEditButtonClick = (notice) => {
    setEditNoticeId(notice.id);
    setEditNoticeName(notice.title);
    setEditNoticeDate(notice.date);
    setEditNoticeDescription(notice.description);
    setEditNoticeImagePreview(notice.image);
    toggleModal();
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

  const handleFileChange = (event, isEdit) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isEdit) {
          setEditNoticeImage(file);
          setEditNoticeImagePreview(e.target.result);
        } else {
          setNewNoticeImage(file);
          setNewNoticeImagePreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderSuccessView = () => {
    const role = Cookies.get("role");
    return (
      <div className="apartment-right-main-sec">
        <div className="notice-board">
          {role === "ADMIN" && (
            <button className="add-notice-btn" onClick={toggleModal}>
              <span>
                <HiPlusCircle />
              </span>{" "}
              Create Notice
            </button>
          )}

          <h2 className="notice-title big">Notices</h2>
          <div className="posts-list">
            {noticeFormattedData.map((notice) => (
              <Card
                key={notice.id}
                id={notice.id}
                title={notice.title}
                description={notice.description}
                image={notice.image}
                date={notice.date}
                time={notice.time}
                onEdit={() => handleEditButtonClick(notice)}
                onDelete={() => handleDeleteNotice(notice.id)}
                type="notices"
              />
            ))}
          </div>
        </div>
        {showModal && (
          <div className="modal-overlay" onClick={toggleModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={toggleModal}>
                <MdClose />
              </button>
              <div className="modal">
                <p className="head4 n-no-space">
                  {editNoticeId ? "Edit Notice" : "Add Notice"}
                </p>
                <div className="notice-form">
                  <div className="notice-upper-sec">
                    <div className="n-img-upload">
                      {editNoticeImagePreview ? (
                        <img
                          src={editNoticeImagePreview || newNoticeImagePreview}
                          alt="Preview"
                          className="image-preview"
                        />
                      ) : (
                        <span>
                          <HiPlusCircle /> Add Image
                        </span>
                      )}
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        className="n-img-up-in"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (editNoticeId) {
                            setEditNoticeImage(file);
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setEditNoticeImagePreview(e.target.result);
                            };
                            reader.readAsDataURL(file);
                          } else {
                            setNewNoticeImage(file);
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setEditNoticeImagePreview(e.target.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                    <div className="right-sec">
                      <input
                        type="text"
                        id="title"
                        name="title"
                        className="n-inp extra"
                        placeholder="Enter the event name here..."
                        value={editNoticeId ? editNoticeName : newNoticeName}
                        onChange={(e) => {
                          if (editNoticeId) {
                            setEditNoticeName(e.target.value);
                          } else {
                            setNewNoticeName(e.target.value);
                          }
                        }}
                      />
                      {/* <input
                      type="datetime-local"
                      id="date"
                      name="date"
                      className="n-inp extra"
                      value={
                        editNoticeId
                          ? formatDateTime(editNoticeDate)
                          : formatDateTime(newNoticeDate)
                      }
                      onChange={(e) => {
                        if (editNoticeId) {
                          setEditNoticeDate(e.target.value);
                        } else {
                          setNewNoticeDate(e.target.value);
                        }
                      }}
                    /> */}
                    </div>
                  </div>
                  <textarea
                    className="n-textarea"
                    placeholder="Enter the description here..."
                    rows={5}
                    value={
                      editNoticeId
                        ? editNoticeDescription
                        : newNoticeDescription
                    }
                    onChange={(e) => {
                      if (editNoticeId) {
                        setEditNoticeDescription(e.target.value);
                      } else {
                        setNewNoticeDescription(e.target.value);
                      }
                    }}
                  />
                  <button
                    className="login-submit-button no-space right-align"
                    onClick={editNoticeId ? handleEditNotice : handleAddNotice}
                  >
                    {editNoticeId ? "Save Changes" : "Add Notice"}
                  </button>
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
        <TopNavbar heading="Notices" full={false} />
        {getView()}
      </div>
    </div>
  );
};

export default Notices;
