import React from "react";
import { Avatar } from "@material-ui/core";
import "../styles/message.scss";

export default function Message({ message }) {
    return (
        <div className="message">
            <Avatar alt="Remy Sharp" src={message.sender.profilePictureId} />
            <p>{message.text}</p>
        </div>
    );
}
