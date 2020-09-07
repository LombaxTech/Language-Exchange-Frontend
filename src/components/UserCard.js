import React, { useState, useEffect } from "react";
import "../styles/usercard.scss";

import { Link } from "react-router-dom";
import { Image, Transformation } from "cloudinary-react";

const cloudName = "dhrowvziz";

export default function UserCard({
    name,
    profilePictureId,
    nativeLanguage,
    targetLanguage,
    userId,
    isFollowed,
    follow,
    unfollow,
}) {
    const [following, setFollowing] = useState(false);

    return (
        <div className="usercard">
            <div className="profile-pic">
                <Image
                    src={profilePictureId}
                    cloudName={cloudName}
                    width="100"
                    height="100"
                >
                    <Transformation crop="crop" />
                    <Transformation width="200" crop="scale" />
                </Image>
            </div>
            <div className="profile-info">
                <Link to={`/user/${userId}`} style={{ color: "black" }}>
                    <h3>{name}</h3>
                </Link>
                <h6>Learning: {targetLanguage}</h6>
                <h6>Native: {nativeLanguage}</h6>
                <button
                    onClick={() => {
                        console.log(userId);
                    }}
                >
                    user id
                </button>
            </div>
            <div className="follow-related">
                {!isFollowed && <button onClick={follow}>Follow</button>}
                {isFollowed && <button onClick={unfollow}>Unfollow</button>}
            </div>
        </div>
    );
}
