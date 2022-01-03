import React from "react";
import { Avatar } from "@material-ui/core";
import "../styles/message.scss";
import Typography from "@material-ui/core/Typography";

export default function Message({ message }) {
    return (
        <div className="flex items-center gap-4 mb-4 bg-gray-100 w-fitContent py-1 px-2 rounded-md">
            <div className="cursor-pointer">
                <Avatar
                    alt="Remy Sharp"
                    src={message.sender.profilePictureId}
                    onClick={() =>
                        (window.location = `/user/${message.sender._id}`)
                    }
                />
            </div>
            <div className="message-text">
                <Typography variant="body1">{message.text}</Typography>
            </div>
        </div>
    );
}
