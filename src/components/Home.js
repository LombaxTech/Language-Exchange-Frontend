import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import client from "../feathers";
import TargetLanguagePosts from "./TargetLanguagePosts";
// import "../styles/home.scss";
import Camera from "../images/testImage.png";
import AroundWorld from "../images/AroundWorld.png";
import svgTest from "../images/SVG_test.svg";

export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});

    console.log(process.env.REACT_APP_API_BASE_URL);

    async function init() {
        try {
            let result = await client.authenticate();
            setUser(result.user);
            setLoggedIn(true);
        } catch (err) {
            console.log(err);
            setLoggedIn(false);
        }
    }
    useEffect(() => {
        init();
    }, []);

    const Welcome = () => (
        <div className="welcome ">
            <div className="bg-image"></div>
            <div className="call-to-action">
                <Typography variant="h1" className="welcome-title">
                    Start <br /> Learning <br /> NOW!
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className="sign-up-button"
                    fullWidth={true}
                    onClick={() => (window.location = "/signup")}
                >
                    Sign Up
                </Button>
            </div>
        </div>
    );

    const NewHome = () => (
        <div className="px-4   w-full flex justify-center mt-20">
            <div className=" flex flex-col justify-center ">
                <h2 className="text-8xl font-light text-center">
                    Start <br />
                    Learning
                    <br />
                    <span className="font-medium">Now</span>
                </h2>
                <button
                    onClick={() => {
                        window.location = "./signup";
                    }}
                    className="button text-light bg-blue shadow-2xl mt-8 uppercase font-bold text-2xl hover:bg-light hover:border-2 hover:border-blue hover:text-blue"
                >
                    Sign Up
                </button>
            </div>
            <div className="w-2/5 bg-green-500">
                <img src={AroundWorld} className="h-full w-full" />
            </div>
        </div>
    );

    return (
        <div>
            {loggedIn && <TargetLanguagePosts />}
            {!loggedIn && <NewHome />}
        </div>
    );
}

// const Welcome = () => (
//         <div className="welcome">
//             <div className="bg-image"></div>
//             <div className="call-to-action">
//                 <Typography variant="h3">Start Learning NOW!</Typography>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     size="large"
//                     className="sign-up-button"
//                     fullWidth={true}
//                     onClick={() => (window.location = "/signup")}
//                 >
//                     Sign Up
//                 </Button>
//             </div>
//         </div>
//     );
