import React, { useState, useEffect } from "react";
import client from "../feathers";
import { Image, Transformation } from "cloudinary-react";
import Post from "./Post";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

// import "../styles/userprofilepage.scss";

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
                `${process.env.REACT_APP_API_BASE_URL}/custom-posts/user/${currentUser._id}`
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
            let result = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/follow`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: user._id,
                        partnerId: currentPageUser._id,
                    }),
                }
            );
            result = await result.json();
            console.log(result);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const unfollow = async () => {
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
                        userId: user._id,
                        partnerId: currentPageUser._id,
                    }),
                }
            );
            result = await result.json();
            console.log(result);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="user-profile-page  px-4 mt-20 flex flex-col items-center gap-10">
            <h4 className="text-5xl">{currentPageUser.name}</h4>
            <div className="w-48 h-48">
                <Avatar
                    src={currentPageUser.profilePictureId}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
            <div className="flex gap-6">
                <button
                    className="px-6 py-1 rounded-lg  bg-teal text-white hover:bg-white  hover:border-2 hover:border-teal hover:text-teal"
                    variant="contained"
                    onClick={() =>
                        (window.location = `/chat/${currentPageUserId}`)
                    }
                >
                    <Typography variant="h5">Message</Typography>
                </button>

                {!following && (
                    <button
                        variant="contained"
                        onClick={follow}
                        className="px-6 py-1 rounded-lg  bg-teal text-white hover:bg-white  hover:border-2 hover:border-teal hover:text-teal"
                    >
                        <Typography variant="h5">Follow</Typography>
                    </button>
                )}
                {following && (
                    <button
                        variant="outlined"
                        onClick={unfollow}
                        className="px-6 py-1 rounded-lg  bg-teal text-white hover:bg-white  hover:border-2 hover:border-teal hover:text-teal"
                    >
                        <Typography variant="h5">Unfollow</Typography>
                    </button>
                )}
            </div>
            <div className="flex flex-col justify-center items-center w-3/4">
                <h4 className="text-4xl my-10">Posts</h4>
                <div className="w-full flex flex-col gap-8">
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
            </div>
        </div>
    );
}
