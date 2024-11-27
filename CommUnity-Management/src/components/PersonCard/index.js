import React from "react";
import { FaPhone } from "react-icons/fa6";
import { MdMarkEmailUnread } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import "./index.css"; // Import separate CSS for PersonCard

const PersonCard = ({ name, block, room, phone, email,  }) => {
  return (
    <div className="person-card">
      <div className="person-info">
        <h3 className="person-name">{name}</h3>
        <p className="person-block">Block - {block}</p>
        <p className="person-room">
          <IoMdHome />
          {room}
        </p>
        <p className="person-phone">
          <FaPhone />
          {phone}
        </p>
        <p className="person-email">
          <MdMarkEmailUnread /> {email}
        </p>
      </div>
    </div>
  );
};

export default PersonCard;
