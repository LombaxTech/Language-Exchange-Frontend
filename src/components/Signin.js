// TODO: MAKE PROTECTED ROUTE FOR ONLY NON SIGNED IN USERS

import React, { useState, useEffect } from "react";
import client from "../feathers";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import "../styles/home.scss";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://material-ui.com/">
                RK Language Learning
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const ErrorMessage = ({ setLoginError }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 mt-4 px-4 py-3 rounded relative w-full ">
        <span className="">Incorrect Login Details</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
                className="fill-current h-6 w-6 text-red-500 cursor-pointer"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                onClick={() => {
                    console.log(setLoginError(false));
                }}
            >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
        </span>
    </div>
);

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Signin() {
    const classes = useStyles();
    const usersService = client.service("users");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(false);

    const [test, setTest] = useState("");

    const updateEmailValue = (e) => setEmail(e.target.value);
    const updatePasswordValue = (e) => setPassword(e.target.value);

    const signin = async (e) => {
        e.preventDefault();
        // console.log("attempted sign up");
        try {
            let user = await client.authenticate({
                strategy: "local",
                email,
                password,
            });
            console.log(user);
            window.location = "./";
        } catch (error) {
            console.log(error);

            if (error.code === 401) {
                setLoginError(true);
            }

            console.log("there has been error");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar style={{ background: "#3d5af1" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate onSubmit={signin}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        className="white-bg"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {loginError && (
                        <ErrorMessage setLoginError={setLoginError} />
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        style={{ background: "#3d5af1", padding: "0.5rem " }}
                    >
                        Sign In
                    </Button>

                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}

{
    /* <div class="mb-4">
                        <label class="block text-gray-700 text-lg font-bold mb-2">
                            Email
                        </label>
                        <input
                            className="shadow  border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input onChange={(e) => console.log(e.target.value)} />
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-lg font-bold mb-2">
                            Password
                        </label>
                        <input
                            className="shadow  border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-lg flex items-center"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={updatePasswordValue}
                        />
                    </div> */
}
