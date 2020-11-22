import React from "react";
import { Avatar } from "@material-ui/core";
import "../styles/message.scss";
import Typography from "@material-ui/core/Typography";

export default function Message({ message }) {
    console.log({ message });

    return (
        <div className="message">
            <Avatar alt="Remy Sharp" src={message.sender.profilePictureId} />
            <div className="message-text">
                <Typography variant="body1">{message.text}</Typography>
            </div>
        </div>
    );
}
