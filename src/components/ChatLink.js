import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";

import "../styles/chatlink.scss";

export default function ChatLink({ partner, lastMessage }) {
    return (
        <div
            className="chat-link-container"
            onClick={() => (window.location = `/chat/${partner._id}`)}
        >
            <div className="profile-pic">
                <Avatar alt="Remy Sharp" src={partner.profilePictureId} />
            </div>
            <div className="name-and-last-message">
                <h5 className="name">{partner.name}</h5>
                <p className="message">
                    Lorem ipsum dolor sit amet consectetur adipisicing...
                </p>
            </div>
            <div className="time-of-last-message">9:55pm</div>
        </div>
    );
}
