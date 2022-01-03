import React, { useState, useEffect } from "react";
import client from "../feathers";
import Post from "./Post";
import topography from "../images/topography.svg";

// import "../styles/targetLanguagePosts.scss";

export default function TargetLanguagePosts() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});

    async function init() {
        try {
            let user = await client.authenticate();
            user = user.user;
            setUser(user);

            let result = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/custom-posts/${user.targetLanguage}`
            );
            result = await result.json();
            console.log(result);
            setPosts(result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div className="relative">
            <div
                className="absolute inset-0 w-full h-full bgImage -z-100 bg-cover pointer-events-none  opacity-5"
                style={{ minHeight: "550px" }}
            ></div>
            <div className=" w-3/4 m-auto  relative">
                <div className="main">
                    <h4 className="text-4xl pt-5 mb-10 text-center">
                        Target Language Posts
                    </h4>
                    <div className="w-full flex flex-col gap-4 mb-4">
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
                </div>
            </div>
        </div>
    );
}

{
    /* <div className="sidebar">
                <div className="learning">
                    <Typography variant="h6">Learning</Typography>
                </div>
                <div className="classmates">
                    <Typography variant="h6">Classmates</Typography>
                </div>
                <div className="following">
                    <Typography variant="h6">Following</Typography>
                </div>
            </div> */
}
