import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import SideNavbar from "../SideNavbar";
import TopNavbar from "../TopNavbar";
import Card from "../Card";
import Cookies from "js-cookie";
import { RotatingLines } from "react-loader-spinner";
import { HiPlusCircle } from "react-icons/hi2";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./index.css";

const getRandomImage = () => {
  const randomId = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
  return `https://picsum.photos/200?random=${randomId}`; // Random image URL
};

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  return date.toISOString(); // Converts to 'YYYY-MM-DDTHH:MM:SSZ' format
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

const Events = () => {
  const [activeFilter, setActiveFilter] = useState("Upcoming");
  const filters = ["Upcoming", "Earlier"];
  const [events, setEvents] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const calendarComponentRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventImage, setNewEventImage] = useState(null);
  const [calenderFormattedEvents, setCalenderFormattedEvents] = useState([]);
  const [newEventImagePreview, setNewEventImagePreview] = useState(null);

  // Edit state
  const [editEventId, setEditEventId] = useState(null);
  const [editEventName, setEditEventName] = useState("");
  const [editEventDate, setEditEventDate] = useState("");
  const [editEventDescription, setEditEventDescription] = useState("");
  const [editEventImage, setEditEventImage] = useState(null);
  const [editEventImagePreview, setEditEventImagePreview] = useState(null);
  const navigate = useNavigate();

  const toggleModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  const fetchEvents = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data; // Assuming `id` is the societyId

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/event-service/event/event-by-society/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        const eventsData = await response.json();
        console.log("events", eventsData);

        // Format the events data as needed
        const formattedEvents = eventsData.map((event) => ({
          id: event.eventId,
          title: event.eventName,
          description: event.eventDetails,
          date: formatDateTime(event.eventDate),
          image: event.eventImage,
        }));

        const calenderFormattedEvents = eventsData.map((event) => {
          const { formattedDate, formattedTime } = formatDateAndTime(
            event.eventDate
          );
          return {
            id: event.eventId,
            title: event.eventName,
            description: event.eventDetails,
            date: formattedDate,
            time: formattedTime,
            image: event.eventImage,
          };
        });

        setEvents(formattedEvents);
        setCalenderFormattedEvents(calenderFormattedEvents);

        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = (arg) => {
    alert(arg.dateStr);
  };

  const handleSelectedDates = (info) => {
    const title = prompt("What's the name of the title?");
    if (title != null) {
      const newEvent = {
        title,
        start: info.startStr,
        end: info.endStr,
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // Append the file
    formData.append("upload_preset", "nd6vm7fo"); // Append the preset
    console.log("f", formData);

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/digbzwlfx/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      console.log("h", response);

      if (!response.ok) {
        setApiStatus(apiStatusConstants.failure);
      }

      const result = await response.json();
      console.log("res", result);
      return result.url; // Return the uploaded image URL
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
      alert("There was a problem with the image upload.");
    }
  };

  const handleAddEvent = async () => {
    const jwtToken = Cookies.get("jwt_token");

    if (!newEventImage) {
      alert("Please select an image to upload.");
      return;
    }

    try {
      console.log("before", newEventImage);
      const imageUrl = await handleImageUpload(newEventImage);
      console.log("after", imageUrl);
      if (!imageUrl) {
        alert("Failed to upload image.");
        return;
      }

      const data = JSON.parse(localStorage.getItem("data"));

      const newNotice = {
        eventName: newEventName,
        eventDetails: newEventDescription,
        eventDate: newEventDate,
        eventImage: imageUrl,
        societyId: data.id, // Assuming `societyId` is the societyId
      };

      const createEventResponse = await fetch(
        "http://localhost:9999/api/community/event-service/event/create-event",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(newNotice),
        }
      );

      if (createEventResponse.ok) {
        toast.success("Event created successfully");
        setNewEventName("");
        setNewEventDate("");
        setNewEventDescription("");
        setNewEventImage(null);
        setNewEventImagePreview(null);
        toggleModal();
        await fetchEvents();
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
      console.error("Error creating event:", error);
    }
  };

  const feedback = (id) => {
    navigate(`/feedback/${id}`);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewEventImage(file);

    // Optional: If you want to show a preview of the uploaded image
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewEventImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEditEvent = async () => {
    const data = JSON.parse(localStorage.getItem("data"));
    const { id } = data; // Assuming `id` is the societyId
    if (!editEventImage && !editEventImagePreview) {
      alert("Please select an image to upload.");
      return;
    }

    const jwtToken = Cookies.get("jwt_token");

    try {
      const imageUrl = editEventImage
        ? await handleImageUpload(editEventImage)
        : editEventImagePreview; // Use existing image if no new image

      const updatedEvent = {
        eventId: editEventId,
        eventName: editEventName,
        eventDetails: editEventDescription,
        eventDate: editEventDate,
        eventImage: imageUrl || "", // Use existing image URL if no new image is uploaded
        societyId: id,
      };
      console.log("edit", updatedEvent);

      const response = await fetch(
        `http://localhost:9999/api/community/event-service/event/update-events/${editEventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(updatedEvent),
        }
      );

      console.log(response);
      if (response.ok) {
        toast.success("Event updated successfully");
        setEditEventId(null);
        setEditEventName("");
        setEditEventDate("");
        setEditEventDescription("");
        setEditEventImage(null);
        setEditEventImagePreview(null);
        toggleModal(); // Assuming toggleModal is used to show/hide modal
        fetchEvents(); // Refresh events list
      } else {
        console.error("Failed to update the event");
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const handleEditClick = (id) => {
    const eventToEdit = events.find((event) => event.id === id);
    if (eventToEdit) {
      setEditEventId(eventToEdit.id);
      setEditEventName(eventToEdit.title);
      setEditEventDate(eventToEdit.date);
      setEditEventDescription(eventToEdit.description);
      setEditEventImagePreview(eventToEdit.image);
      setShowModal(true);
    }
  };

  const formatDateForInput = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDeleteEvent = async (eventId) => {
    const jwtToken = Cookies.get("jwt_token");

    try {
      const response = await fetch(
        `http://localhost:9999/api/community/event-service/event/delete-events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      console.log(response);

      if (response.ok) {
        console.log("Event deleted successfully");
        fetchEvents(); // Refresh the event list
      } else {
        console.error("Failed to delete event");
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setApiStatus(apiStatusConstants.failure);
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

  const filterEvents = () => {
    const today = new Date();
    return calenderFormattedEvents.filter((event) => {
      const eventDate = new Date(event.date);
      if (activeFilter === "Upcoming") {
        return eventDate >= today;
      } else if (activeFilter === "Earlier") {
        return eventDate < today;
      }
      return true;
    });
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

  const renderSuccessView = () => {
    const role = Cookies.get("role");
    return (
      <>
        <div className="apartment-right-main-sec space-below">
          {role === "ADMIN" && (
            <div className="event-sec">
              <button
                className="login-submit-button background no-space"
                onClick={toggleModal}
              >
                <HiPlusCircle /> Add Event
              </button>
            </div>
          )}

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            ref={calendarComponentRef}
            events={events}
            dateClick={handleDateClick}
            selectable
            select={handleSelectedDates}
          />
          <div className="event-main-sec">
            <div className="event-filter-container">
              {filters.map((filter) => (
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
            </div>
            <div className="notice-list full">
              {filterEvents().map((event) => (
                <Card
                  key={event.id}
                  id={event.id}
                  image={event.image}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  time={event.time}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteEvent}
                  giveFeedback={feedback}
                  type="events"
                />
              ))}
            </div>
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
                  {editEventId ? "Edit Event" : "Add Event"}
                </p>
                <div className="notice-form">
                  <div className="notice-upper-sec">
                    <div className="n-img-upload">
                      {editEventImagePreview ? (
                        <img
                          src={editEventImagePreview}
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
                          if (editEventId) {
                            setEditEventImage(file);
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setEditEventImagePreview(e.target.result);
                            };
                            reader.readAsDataURL(file);
                          } else {
                            setNewEventImage(file);
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setEditEventImagePreview(e.target.result);
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
                        value={editEventId ? editEventName : newEventName}
                        onChange={(e) => {
                          if (editEventId) {
                            setEditEventName(e.target.value);
                          } else {
                            setNewEventName(e.target.value);
                          }
                        }}
                      />
                      <input
                        type="datetime-local"
                        id="date"
                        name="date"
                        className="n-inp extra"
                        value={
                          editEventId
                            ? formatDateForInput(editEventDate)
                            : formatDateForInput(newEventDate)
                        }
                        onChange={(e) => {
                          if (editEventId) {
                            setEditEventDate(e.target.value);
                          } else {
                            setNewEventDate(e.target.value);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <textarea
                    className="n-textarea"
                    placeholder="Enter the description here..."
                    rows={5}
                    value={
                      editEventId ? editEventDescription : newEventDescription
                    }
                    onChange={(e) => {
                      if (editEventId) {
                        setEditEventDescription(e.target.value);
                      } else {
                        setNewEventDescription(e.target.value);
                      }
                    }}
                  />
                  <button
                    className="login-submit-button no-space right-align"
                    onClick={editEventId ? handleEditEvent : handleAddEvent}
                  >
                    {editEventId ? "Save Changes" : "Add Event"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
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
        <TopNavbar heading="Events" full={false} />

        {getView()}
      </div>
    </div>
  );
};

export default Events;
