import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";

export default function Followers({ userId }) {
    const [followers, setFollowers] = useState([]);

    async function init() {
        try {
            console.log(userId);
            let user = await fetch(
                `http://localhost:3030/custom-user/${userId}`
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
                        userId={follower.userId}
                        key={follower._id}
                        isFollowed={}
                        follow={}
                        unfollow={}
                    />
                ))}
            </ul>
        </div>
    );
}
