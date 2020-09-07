import React, { useState, useEffect } from "react";
import client from "../feathers";
import Post from "./Post";

export default function FollowingPosts() {
    const [user, setUser] = useState({});
    const [following, setFollowing] = useState([]);
    const [posts, setPosts] = useState([]);

    async function init() {
        try {
            let user = await client.authenticate();
            user = user.user;
            setUser(user);
            setFollowing(user.following);

            // loop through following users and get posts for each
            let _posts = [];
            for (let userId of user.following) {
                try {
                    let result = await fetch(
                        `http://localhost:3030/custom-posts/user/${userId}`
                    );
                    result = await result.json();
                    console.log(result);
                    _posts = [..._posts, ...result];
                    console.log(typeof result[0].createdAt);
                } catch (error) {
                    console.log(error);
                }
            }
            _posts = _posts.map((post) => ({
                ...post,
                createdAt: new Date(post.createdAt),
            }));
            _posts.sort((a, b) => b.createdAt - a.createdAt);
            _posts = _posts.map((post) => ({
                ...post,
                createdAt: post.createdAt.toString(),
            }));

            setPosts(_posts);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div>
            <h1>Following Posts</h1>
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
        </div>
    );
}
