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

    async function init() {
        try {
            let currentUser = await usersService.get(currentPageUserId);
            setCurrentPageUser(currentUser);

            let user = await client.authenticate();
            user = user.user;
            setUser(user);

            let posts = await fetch(
                `http://localhost:3030/custom-posts/${currentUser._id}`
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

    return (
        <div>
            <h1>{currentPageUser.name}</h1>
            <Image src={currentPageUser.profilePictureId} height={100} />

            <Link to={`/chat/${currentPageUserId}`}>
                <h2>Message</h2>
            </Link>
            <h2>Follow</h2>

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
