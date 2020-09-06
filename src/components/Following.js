import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";

export default function Following({ userId }) {
    const [following, setFollowing] = useState([]);

    async function init() {
        try {
            console.log(userId);
            let user = await fetch(
                `http://localhost:3030/custom-user/${userId}`
            );
            user = await user.json();
            setFollowing(user.following);
            console.log(user);
        } catch (error) {
            console.log(error);
        }
    }

    const unfollow = async () => {
        try {
            let result = await fetch(`http://localhost:3030/unfollow`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });
            result = await result.json();
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
                        userId={user.userId}
                        key={user._id}
                        isFollowed={true}
                        follow={}
                        unfollow={}
                    />
                ))}
            </ul>
        </div>
    );
}
