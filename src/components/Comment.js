import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";

// import "../styles/comment.scs"

export default function Comment({
    profilePictureId,
    name,
    text,
    createdAt,
    userId,
}) {
    return (
        <div style={{ display: "flex" }}>
            <div className="profile-picture">
                <Avatar alt="Remy Sharp" src={profilePictureId} />
            </div>
            <div className="name-and-text">
                <Link to={`/user/${userId}`}>
                    <h3>{name}</h3>
                </Link>
                {text}
            </div>
            {/* <div className="createdAt">{createdAt}</div> */}
        </div>
    );
}
