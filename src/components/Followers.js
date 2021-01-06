import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";

export default function Followers({ userId }) {
    const [followers, setFollowers] = useState([]);

    async function init() {
        try {
            console.log(userId);
            let user = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/custom-user/${userId}`
            );
            user = await user.json();
            setFollowers(user.followers);
            console.log(user);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    const follow = async (partnerId) => {
        try {
            let result = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/follow`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId, partnerId }),
                }
            );
            result = await result.json();
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

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
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Followers</h1>
            <ul className="follwers">
                {followers.map((follower) => (
                    <UserCard
                        name={follower.name}
                        profilePictureId={follower.profilePictureId}
                        nativeLanguage={follower.nativeLanguage}
                        targetLanguage={follower.targetLanguage}
                        userId={follower._id}
                        key={follower._id}
                        isFollowed={follower.followers.includes(userId)}
                        follow={() => {
                            follow(follower._id);
                        }}
                        unfollow={() => {
                            unfollow(follower._id);
                        }}
                    />
                ))}
            </ul>
        </div>
    );
}
