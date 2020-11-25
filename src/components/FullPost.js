import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, MenuItem } from "@material-ui/core";
import { ChatBubbleOutline, FavoriteBorder } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { Modal } from "react-bootstrap";

import client from "../feathers";
import "../styles/post.scss";
import io from "socket.io-client";
import "../styles/post.scss";

const socket = io("http://localhost:3030");

export default function FullPost({ match }) {
    const [post, setPost] = useState({});
    const [postUser, setPostUser] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    async function init() {
        try {
            socket.on("comment", (e) => {
                if (post._id === e._id) {
                    setComments(e.comments);
                }
            });

            let currentUser = await client.authenticate();
            setCurrentUser(currentUser.user);

            let post = await fetch(
                `http://localhost:3030/custom-post/${match.params.postId}`
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
                `http://localhost:3030/custom-post/${post._id}/like`,
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
        } catch (error) {
            console.log(error);
        }
    };

    const [commentText, setCommentText] = useState("");
    const handleCommentTextChange = (e) => setCommentText(e.target.value);

    const comment = async () => {
        // console.log("comment");
        try {
            let result = await fetch(
                `http://localhost:3030/custom-post/${post._id}/comment`,
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
            socket.emit("comment", result);
            console.log(result);
            // socket.emit("like", { roomName: postId, result });
        } catch (error) {
            console.log(error);
        }
    };

    const [show, setShow] = useState(false);

    if (loading) return <h2>Loading...</h2>;

    const CommentInput = () => (
        <div className="comment-input">
            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header style={{ textAlign: "center" }} closeButton>
                    <Modal.Title>Add Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TextField
                        variant="outlined"
                        className="post-text"
                        value={commentText}
                        onChange={handleCommentTextChange}
                        multiline
                        rowsMax={5}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="post-comment"
                        onClick={comment}
                        variant="contained"
                        fullWidth={true}
                        color="primary"
                    >
                        Post Comment
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

    const Comment = ({ comment }) => (
        <div className="comment">
            <div className="comment-user">
                <Avatar
                    src={comment.user.profilePictureId}
                    className="comment-profile-pic"
                    onClick={() =>
                        (window.location = `/user/${comment.user._id}`)
                    }
                />
                <Typography variant="h5">{comment.user.name}</Typography>
            </div>
            <Typography variant="body1" className="comment-text">
                {comment.text}
            </Typography>
        </div>
    );
    const Comments = () => (
        <div className="comments">
            {comments.map((comment) => (
                <Comment comment={comment} />
            ))}
        </div>
    );

    return (
        <div className="full-post">
            <div className="post">
                <div className="user-info">
                    <Avatar
                        src={postUser.profilePictureId}
                        onClick={() =>
                            (window.location = `/user/${postUser._id}`)
                        }
                        className="profile-pic"
                    />
                    <Typography variant="h5">{postUser.name}</Typography>

                    <div className="post-time">
                        <Typography variant="h6">
                            {new Date(post.createdAt).getDate().toString()}/
                            {new Date(post.createdAt).getMonth().toString()}
                        </Typography>
                    </div>
                </div>
                <div className="post-info">
                    <div className="post-text">
                        <Typography variant="body">{post.text}</Typography>
                    </div>
                    <div className="comments-likes">
                        <MenuItem className="comments">
                            <ChatBubbleOutline onClick={() => setShow(true)} />
                            {comments.length}
                        </MenuItem>{" "}
                        <MenuItem className="likes" onClick={like}>
                            <FavoriteBorder /> {post.likes.length}
                        </MenuItem>
                    </div>
                    {currentUser._id === postUser._id && (
                        <button onClick={deletePost}>Delete</button>
                    )}
                </div>{" "}
            </div>
            {Comments()}
            {CommentInput()}
        </div>
    );
}
