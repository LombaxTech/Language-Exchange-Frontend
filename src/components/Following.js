import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";

export default function Following({ userId }) {
    const [following, setFollowing] = useState([]);

    async function init() {
        try {
            console.log(userId);
            let user = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/custom-user/${userId}`
            );
            user = await user.json();
            setFollowing(user.following);
            console.log(user);
        } catch (error) {
            console.log(error);
        }
    }

    const unfollow = async (partnerId) => {
        try {
            let result = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/unfollow`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                        partnerId,
                    }),
                }
            );
            result = await result.json();
            console.log(result);
            setFollowing(following.filter((user) => user._id !== partnerId));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <div>
            <h1>Following</h1>
            <ul className="following">
                {following.map((user) => (
                    <UserCard
                        name={user.name}
                        profilePictureId={user.profilePictureId}
                        nativeLanguage={user.nativeLanguage}
                        targetLanguage={user.targetLanguage}
                        userId={user._id}
                        key={user._id}
                        isFollowed={true}
                        unfollow={() => {
                            unfollow(user._id);
                        }}
                    />
                ))}
            </ul>
        </div>
    );
}
