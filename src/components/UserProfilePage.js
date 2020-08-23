import React, { useState, useEffect } from "react";
import client from "../feathers";

export default function UserProfilePage({ match }) {
    const currentPageUserId = match.params.userId;

    const usersService = client.service("users");
    const postsService = client.service("posts");

    const [currentPageUser, setCurrentPageUser] = useState({});

    async function init() {
        try {
            let user = await usersService.get({
                _id: currentPageUserId,
            });
            console.log(user);
            setCurrentPageUser(user);
        } catch (error) {
            console.log(error);
        }
    }

    const [posts, setPosts] = useState([]);

    async function fetchUsersPosts() {
        try {
            let posts = await postsService.find({
                query: {
                    userId: currentPageUserId,
                },
            });
            console.log(posts.data);
            setPosts(posts.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        init();
        fetchUsersPosts();
    }, []);

    return (
        <div>
            <h1>{currentPageUser.name}</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post._id} style={{ margin: "20px" }}>
                        {currentPageUser.name} | Created at: {post.createdAt}{" "}
                        <br />
                        {post.text} <br />
                        likes: {post.likes.length} <br />
                        comments:{" "}
                        {post.comments.map((comment) => (
                            <p>{comment}</p>
                        ))}
                    </li>
                ))}
            </ul>
            {posts.length === 0 && <h2>No posts to show...</h2>}
        </div>
    );
}
