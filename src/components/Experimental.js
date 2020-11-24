import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";

import "../styles/post.scss";

export default function Experimental() {
    const [open, setOpen] = useState(true);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Modal open={open} onClose={handleClose} className="my-modal">
                <div>hello</div>
            </Modal>
        </div>
    );
}
