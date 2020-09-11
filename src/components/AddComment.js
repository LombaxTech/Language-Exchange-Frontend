import React, { useState } from "react";
import { IconButton } from "@material-ui/core";
import { ChatBubbleOutline, FavoriteBorder } from "@material-ui/icons";
import { Modal, Button } from "react-bootstrap";

export default function AddComment({ post, currentUser }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [commentText, setCommentText] = useState("");

    const handleCommentTextChange = (e) => {
        setCommentText(e.target.value);
    };

    const comment = async () => {
        try {
            console.log(commentText);
            console.log({ post, currentUser });

            let result = await fetch(
                `http://localhost:3030/custom-post/${post._id}/comment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        text: commentText,
                        userId: currentUser._id,
                    }),
                }
            );

            result = await result.json();
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <ChatBubbleOutline
                onClick={handleShow}
                style={{ display: "inline !important" }}
            />

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header style={{ textAlign: "center" }} closeButton>
                    <Modal.Title>Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea
                        className="comment-text"
                        value={commentText}
                        onChange={handleCommentTextChange}
                        style={{
                            width: "100%",
                            height: "100%",
                            outline: "none",
                            border: "none",
                        }}
                    ></textarea>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="submit-comment"
                        onClick={comment}
                        style={{ width: "100%" }}
                    >
                        Post Comment
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
