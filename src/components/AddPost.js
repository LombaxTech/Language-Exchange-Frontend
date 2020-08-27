import React, { useState, useEffect } from "react";
import AddCommentOutlinedIcon from "@material-ui/icons/AddCommentOutlined";
import { IconButton } from "@material-ui/core";
import { Modal, Button } from "react-bootstrap";

import "../styles/addpost.scss";

export default function AddPost() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [postText, setPostText] = useState("");

    return (
        <div style={{ display: "inline" }}>
            <IconButton style={{ display: "inline", color: "white" }}>
                <AddCommentOutlinedIcon onClick={handleShow} />
            </IconButton>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header style={{ textAlign: "center" }} closeButton>
                    <Modal.Title>Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea className="post-text" value="dkdk"></textarea>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
