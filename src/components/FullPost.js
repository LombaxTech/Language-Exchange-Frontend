import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { Avatar, MenuItem } from "@material-ui/core";
import { ChatBubbleOutline, FavoriteBorder } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { Dialog, Transition } from "@headlessui/react";

import client from "../feathers";
// import "../styles/post.scss";
import Modal from "./Modal";

import io from "socket.io-client";

// import "../styles/post.scss";

const socket = io(process.env.REACT_APP_API_BASE_URL);

const CommentModal = ({
    show,
    setShow,
    commentText,
    handleCommentTextChange,
    comment,
}) => (
    <Modal show={show} setShow={setShow}>
        <div className=" p-4 text-center">
            <h1 className="text-2xl">Add Comment</h1>
        </div>
        {/* Post Body */}
        <div className="flex flex-col flex-1">
            <div className="p-4 bg-white text-black flex-1">
                <textarea
                    className="post-text overflow-hidden"
                    value={commentText}
                    onChange={handleCommentTextChange}
                    maxLength="1000"
                ></textarea>
            </div>

            {/* submit comment */}
            <div className="p-4 text-white">
                <button className="submit-post font-bold" onClick={comment}>
                    Comment
                </button>
            </div>
        </div>
    </Modal>
);

export default function FullPost({ match }) {
    const [post, setPost] = useState({});
    const [postUser, setPostUser] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    async function init() {
        try {
            socket.on("comment", ({ currentUser, result }) => {
                if (post._id === result._id) {
                    setComments(result.comments);
                }
            });

            let currentUser = await client.authenticate();
            setCurrentUser(currentUser.user);

            let post = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/custom-post/${match.params.postId}`
            );
            post = await post.json();
            setPost(post);
            setPostUser(post.user);
            setComments(post.comments);
            console.log(post);
            // console.log(post.user);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        init();
    }, []);

    const postsService = client.service("posts");

    const deletePost = async () => {
        try {
            let result = await postsService.remove(post._id);
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    const like = async () => {
        try {
            let result = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/custom-post/${post._id}/like`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        likerId: currentUser._id,
                        // likerId: "5f4c068adeaf644ddc017f16",
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

    const [show, setShow] = useState(false);
    const [commentText, setCommentText] = useState("");
    const handleCommentTextChange = (e) => setCommentText(e.target.value);

    const comment = async () => {
        // console.log("comment");
        try {
            let result = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/custom-post/${post._id}/comment`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: currentUser._id,
                        text: commentText,
                    }),
                }
            );
            result = await result.json();
            socket.emit("comment", { currentUser, result });
            console.log(result);
            // socket.emit("like", { roomName: postId, result });
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) return <h2>Loading...</h2>;

    const Comment = ({ comment }) => (
        <div className=" w-full flex p-4 gap-4 border border-gray-400">
            <div className="flex flex-col justify-center items-center cursor-pointer ">
                <Avatar
                    src={comment.user.profilePictureId}
                    onClick={() =>
                        (window.location = `/user/${comment.user._id}`)
                    }
                    className="profile-pic"
                />
                <h4 className="">{comment.user.name}</h4>
            </div>

            <div className="font-normal w-full flex p-4">
                <Typography variant="body">{comment.text}</Typography>
            </div>
        </div>
    );
    const Comments = () => (
        <div className="comments flex flex-col gap-1 ">
            <h1 className="text-center text-2xl mb-5">Comments</h1>
            {comments.map((comment) => (
                <Comment comment={comment} />
            ))}
        </div>
    );

    return (
        <div className="full-post">
            <div className="border border-gray-500 m-0 shadow-none flex gap-6 p-4 rounded-xl bg-light">
                <div className="flex flex-col justify-center items-center cursor-pointer">
                    <Avatar
                        src={postUser.profilePictureId}
                        onClick={() =>
                            (window.location = `/user/${postUser._id}`)
                        }
                    />
                    <h4 className="">{postUser.name}</h4>
                </div>
                <div className="flex-1 p-2 flex flex-col gap-6">
                    <div className="post-time text-center ">
                        <h4 className="font-light">
                            {new Date(post.createdAt).getDate().toString()}/
                            {new Date(post.createdAt).getMonth().toString()}
                        </h4>
                    </div>
                    <div className="p-4  my-2 border border-gray-200 bg-white rounded-xl font-bold cursor-pointer">
                        <Typography variant="body">{post.text}</Typography>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex  flex-1  justify-center">
                            <MenuItem className="comments">
                                <ChatBubbleOutline
                                    onClick={() => setShow(true)}
                                />
                                {comments.length}
                            </MenuItem>{" "}
                            <MenuItem className="likes" onClick={like}>
                                <FavoriteBorder /> {post.likes.length}
                            </MenuItem>
                        </div>

                        {currentUser._id === postUser._id && (
                            <button onClick={deletePost}>Delete</button>
                        )}
                    </div>
                </div>
            </div>

            {Comments()}
            {/* {CommentInput()}/ */}
            <CommentModal
                show={show}
                setShow={setShow}
                commentText={commentText}
                handleCommentTextChange={handleCommentTextChange}
                comment={comment}
            />
        </div>
    );
}
