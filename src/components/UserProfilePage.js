import React, { useState, useEffect } from "react";
import client from "../feathers";
import { Image, Transformation } from "cloudinary-react";
import Post from "./Post";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

import "../styles/userprofilepage.scss";

export default function UserProfilePage({ match }) {
    const currentPageUserId = match.params.userId;

    const usersService = client.service("users");
    const postsService = client.service("posts");

    const [user, setUser] = useState({});
    const [currentPageUser, setCurrentPageUser] = useState({});
    const [posts, setPosts] = useState([]);

    const [following, setFollowing] = useState(false);

    async function init() {
        try {
            let currentUser = await usersService.get(currentPageUserId);
            setCurrentPageUser(currentUser);
            console.log({ currentUser });

            let user = await client.authenticate();
            user = user.user;
            setUser(user);

            if (currentUser.followers.includes(user._id)) {
                setFollowing(true);
                console.log("is following");
            } else {
                setFollowing(false);
                console.log("isnt following");
            }

            let posts = await fetch(
                `http://localhost:3030/custom-posts/user/${currentUser._id}`
            );
            posts = await posts.json();
            setPosts(posts);
            console.log({ posts });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    const follow = async () => {
        try {
            let result = await fetch(`http://localhost:3030/follow`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user._id,
                    partnerId: currentPageUser._id,
                }),
            });
            result = await result.json();
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    const unfollow = async () => {
        try {
            let result = await fetch(`http://localhost:3030/unfollow`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user._id,
                    partnerId: currentPageUser._id,
                }),
            });
            result = await result.json();
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="user-profile-page">
            <Typography variant="h4">{currentPageUser.name}</Typography>
            <Avatar
                src={currentPageUser.profilePictureId}
                className="user-profile-pic"
            />
            <div className="message-follow">
                <Button
                    variant="contained"
                    onClick={() =>
                        (window.location = `/chat/${currentPageUserId}`)
                    }
                >
                    <Typography variant="h5">Message</Typography>
                </Button>

                {!following && (
                    <Button
                        variant="contained"
                        onClick={follow}
                        className="follow-button"
                    >
                        <Typography variant="h5">Follow</Typography>
                    </Button>
                )}
                {following && (
                    <Button
                        variant="outlined"
                        onClick={unfollow}
                        className="unfollow-button"
                    >
                        <Typography variant="h5">Unfollow</Typography>
                    </Button>
                )}
            </div>
            <Typography variant="h4">Posts</Typography>
            {posts.map((post) => (
                <Post
                    key={post._id}
                    profilePictureId={post.user.profilePictureId}
                    name={post.user.name}
                    createdAt={post.createdAt}
                    postText={post.text}
                    numberOfComments={post.comments.length}
                    numberOfLikes={post.likes.length}
                    isOwnPost={post.user._id === user._id}
                    postId={post._id}
                    user={post.user}
                />
            ))}
            {posts.length === 0 && <h2>No posts to show...</h2>}
        </div>
    );
}
