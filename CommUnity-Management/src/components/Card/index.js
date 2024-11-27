// NoticeCard.jsx

import React from "react";
import { MdEdit, MdDelete, MdDateRange } from "react-icons/md";
import { IoTimerSharp } from "react-icons/io5";
import { FaThumbsUp } from "react-icons/fa6";
import { FaRegThumbsUp } from "react-icons/fa";
import { MdFeedback } from "react-icons/md";
import Cookies from "js-cookie";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import "./index.css";

const Card = ({
  id,
  title,
  description,
  date,
  time,
  type,
  image,
  onDelete,
  onEdit,
  giveFeedback,
}) => {
  const role = Cookies.get("role");

  return (
    <div className="notice-card">
      <img src={image} alt={title} className="notice-image" />
      <div className="notice-content">
        <h3 className="notice-title">{title}</h3>
        <p className="notice-description">{description}</p>
      </div>

      <div className="notice-date">
        <IoTimerSharp className="date-icon" />
        {date} - {time}
      </div>
      <div
        className={`notice-actions ${
          role === "ADMIN"
            ? "admin-class"
            : role === "RESIDENT" && type === "events"
            ? "notice-actions"
            : "no-space-right"
        }`}
        style={{
          right: type === "posts" ? "150px" : "20px",
          width: type === "posts" ? "60px" : "",
        }}
      >
        {type === "posts" && (
          <span className="interested-text">
            <p className="in-p">I am Interested</p>
            <FaRegThumbsUp
              style={{ color: "#1A4258", height: "20px", width: "20px" }}
            />
          </span>
        )}
        {type === "events" && role === "RESIDENT" && (
          <button className="edit-btn" onClick={() => giveFeedback(id)}>
            <MdFeedback style={{ color: "white" }} />
          </button>
        )}
        {role === "ADMIN" && (
          <button className="edit-btn" onClick={() => onEdit(id)}>
            <MdEdit style={{ color: "white" }} />
          </button>
        )}

        {role === "ADMIN" && (
          <Popup
            trigger={
              <button className="edit-btn">
                <MdDelete style={{ color: "white", cursor: "pointer" }} />
              </button>
            }
            modal
          >
            {(close) => (
              <div className="modal">
                <div className="p-header">
                  <MdDelete style={{ color: "#1A4258", fontSize: "40px" }} />
                  <p className="head4"> Are you sure you want to Delete?</p>
                </div>

                <div className="actions">
                  <button
                    className="login-submit-button no-space size-less outline"
                    onClick={() => {
                      console.log("modal closed ");
                      close();
                    }}
                  >
                    cancel
                  </button>
                  <button
                    className="login-submit-button no-space size-less"
                    onClick={() => {
                      onDelete(id);
                      close();
                    }}
                  >
                    Yes
                  </button>
                </div>
              </div>
            )}
          </Popup>
        )}
      </div>
    </div>
  );
};

export default Card;
