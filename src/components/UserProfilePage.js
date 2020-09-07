import React, { useState, useEffect } from "react";
import client from "../feathers";
import { Image, Transformation } from "cloudinary-react";
import Post from "./Post";
import { Link } from "react-router-dom";

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
            console.log(currentUser);

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
            console.log(posts);
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

    const unfollow = async () => {};

    return (
        <div>
            <h1>{currentPageUser.name}</h1>
            <Image src={currentPageUser.profilePictureId} height={100} />

            <Link to={`/chat/${currentPageUserId}`}>
                <h2>Message</h2>
            </Link>

            {!following && <button onClick={follow}>Follow</button>}

            {following && <button onClick={unfollow}>Unfollow</button>}

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
