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

export default function Signup() {
    const usersService = client.service("users");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [file, setFile] = useState({});

    const updateEmailValue = (e) => {
        setEmail(e.target.value);
    };

    const updatePasswordValue = (e) => {
        setPassword(e.target.value);
    };

    const updateNameValue = (e) => setName(e.target.value);

    const [nativeLanguage, setNativeLanguage] = useState("English");
    const [targetLanguage, setTargetLanguage] = useState("English");

    const handleNativeLanguageChange = (e) => {
        console.log(e.target.value);
        setNativeLanguage(e.target.value);
    };

    const handleTargetLanguageChange = (e) => {
        console.log(e.target.value);
        setTargetLanguage(e.target.value);
    };

    const handleFileUpload = (e) => {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
    };

    const signup = async (e) => {
        e.preventDefault();
        // return console.log({ email, password, file });
        try {
            let user = await usersService.create({
                email,
                password,
                name,
                nativeLanguage,
                targetLanguage,
            });

            // console.log(user);
            await client.authenticate({ strategy: "local", email, password });

            // * GET USER PROFILE IMAGE
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "testpreset");

            let result = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            result = await result.json();
            const { secure_url } = result;
            user = await usersService.patch(user._id, {
                profilePictureId: secure_url,
            });
            console.log(user);

            // * END OF GET USER PROFILE IMAGE
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={signup}>
                <TextField
                    label="Email"
                    value={email}
                    onChange={updateEmailValue}
                />
                <TextField
                    style={{ display: "block" }}
                    type="password"
                    label="Password"
                    value={password}
                    onChange={updatePasswordValue}
                />
                <TextField
                    label="Name"
                    value={name}
                    onChange={updateNameValue}
                />

                <InputLabel>Native Language</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={nativeLanguage}
                    onChange={handleNativeLanguageChange}
                >
                    <MenuItem value={"Eng"}>English</MenuItem>
                    <MenuItem value={"Jpn"}>Japanese</MenuItem>
                    <MenuItem value={"Fr"}>French</MenuItem>
                </Select>

                <InputLabel>Target Language</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={targetLanguage}
                    onChange={handleTargetLanguageChange}
                >
                    <MenuItem value={"Eng"}>English</MenuItem>
                    <MenuItem value={"Jpn"}>Japanese</MenuItem>
                    <MenuItem value={"Fr"}>French</MenuItem>
                </Select>

                <Input type="file" onChange={handleFileUpload} />

                <button
                    type="submit"
                    style={{ display: "block", margin: "10px" }}
                >
                    Sign Up
                </button>
            </form>

            {/* <FormControl> */}
            {/* </FormControl>s */}
        </div>
    );
}
