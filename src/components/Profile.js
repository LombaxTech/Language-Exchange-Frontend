import React, { useState, useEffect } from "react";
import client from "../feathers";

import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Input,
} from "@material-ui/core";

const cloudName = "dhrowvziz";

export default function Profile() {
    const usersService = client.service("users");

    const [user, setUser] = useState({});

    async function init() {
        let user = await client.authenticate();
        user = user.user;
        setUser(user);
    }

    useEffect(() => {
        init();
    }, []);

    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [file, setFile] = useState({});

    const [newValues, setNewValues] = useState({});

    const updatePasswordValue = (e) => {
        setPassword(e.target.value);
        setNewValues({
            ...newValues,
            password: e.target.value,
        });
    };

    const updateNameValue = (e) => {
        setName(e.target.value);
        setNewValues({
            ...newValues,
            name: e.target.value,
        });
    };

    const handleFileUpload = (e) => {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
    };

    const updateProfile = async (e) => {
        e.preventDefault();

        let valuesToChange = {};

        const keys = Object.keys(newValues);

        keys.forEach((key) => {
            if (newValues[key] !== "") {
                valuesToChange[key] = newValues[key];
            }
        });

        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "testpreset");

            try {
                let result = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );
                result = await result.json();
                const { secure_url } = result;
                if (secure_url) {
                    valuesToChange = {
                        ...valuesToChange,
                        profilePictureId: secure_url,
                    };
                }
            } catch (error) {
                console.log(error);
            }
        }

        // console.log(valuesToChange);
        if (Object.keys(valuesToChange).length === 0) {
            return console.log("nothing to change");
        }

        try {
            let result = await usersService.patch(user._id, valuesToChange);
            console.log(result);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Profile</h1>
            <form onSubmit={updateProfile}>
                <div style={{ display: "block" }}>Email: {user.email}</div>
                <TextField
                    label="New Name"
                    value={name}
                    onChange={updateNameValue}
                    placeholder={user.name}
                />
                <TextField
                    label="New Password"
                    value={password}
                    onChange={updatePasswordValue}
                />

                <Input type="file" onChange={handleFileUpload} />

                <button
                    type="submit"
                    style={{ display: "block", margin: "10px" }}
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}
