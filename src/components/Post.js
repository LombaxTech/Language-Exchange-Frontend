import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, MenuItem } from "@material-ui/core";
import { ChatBubbleOutline, FavoriteBorder } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";

import client from "../feathers";
// import "../styles/post.scss";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_API_BASE_URL);

export default function Post({
    profilePictureId,
    name,
    createdAt,
    postText,
    numberOfComments,
    numberOfLikes,
    isOwnPost,
    postId,
    user,
    currentUserId,
}) {
    const postsService = client.service("posts");
    const [noOfLikes, setNoOfLikes] = useState(numberOfLikes);
    // createdAt = new Date(createdAt);
    // console.log(typeof new Date(createdAt).getDate());
    const init = async () => {
        socket.emit("join room", postId);

        socket.on("like", (e) => {
            if (postId === e.roomName) {
                setNoOfLikes(e.result.likes.length);
            }
        });
    };
    useEffect(() => {
        init();
    }, []);

    const deletePost = async () => {
        try {
            let result = await postsService.remove(postId);
            console.log(result);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const like = async () => {
        try {
            let result = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/custom-post/${postId}/like`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        likerId: user._id,
                        // likerId: "5f4c068adeaf644ddc017f16",
                    }),
                }
            );
            result = await result.json();
            console.log(result);
            socket.emit("like", { roomName: postId, result });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className=" border border-gray-500 m-0 shadow-none flex gap-6 p-4  bg-gray-200">
            {/* Name and Profile Pic */}
            <div
                className="flex flex-col justify-center items-center cursor-pointer"
                style={{ minWidth: "110px" }}
            >
                <Avatar
                    src={profilePictureId}
                    onClick={() => (window.location = `/user/${user._id}`)}
                    className="profile-pic"
                />
                <h4 className="">{name}</h4>
            </div>

            {/* Rest of Info */}

            <div className="flex-1 p-2 flex flex-col gap-6">
                <div className="post-time text-center ">
                    <h4 className="font-light">
                        {new Date(createdAt).getDate().toString()}/
                        {new Date(createdAt).getMonth().toString()}
                    </h4>
                </div>

                <div
                    className="p-4  my-2 border border-gray-200 bg-white rounded-xl font-semibold cursor-pointer"
                    onClick={() => (window.location = `/post/${postId}`)}
                >
                    <Typography variant="body">{postText}</Typography>
                </div>
                <div className=" flex justify-center ">
                    <div className="flex opacity-50">
                        <MenuItem
                            className="comments hover:bg-red-500"
                            onClick={() =>
                                (window.location = `/post/${postId}`)
                            }
                        >
                            <ChatBubbleOutline />
                            {numberOfComments}
                        </MenuItem>{" "}
                        <MenuItem className="likes" onClick={like}>
                            <FavoriteBorder /> {noOfLikes}
                        </MenuItem>
                    </div>
                    {isOwnPost && (
                        <button
                            className="px-6 py-1 rounded-lg  bg-teal text-white hover:bg-white  hover:border-2 hover:border-teal hover:text-teal"
                            onClick={deletePost}
                        >
                            Delete Post
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
