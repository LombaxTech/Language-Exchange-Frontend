import React, { useState, useEffect } from "react";
import client from "../feathers";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { Scrollbars } from "react-custom-scrollbars";

// import "../styles/chats.scss";

//  {/* <div className="profile-pic-name-message">
//         <Avatar
//             src={partner.profilePictureId}
//             style={{ width: "75px", height: "75px" }}
//         />
//         <div className="name-message">
//             <Typography variant="h6" className="name">
//                 {partner.name}
//             </Typography>
//             {/* <Typography variant="body1" className="last-message">
//                 Hey when is our next lesson?
//             </Typography> */}
//         </div>
//     </div>
//     <div className="date">16:20 12/01/2020</div> */}

const Chat = ({ partner, lastMessage }) => (
    <div
        className=" flex gap-8 p-8 border-b  border-gray-500 cursor-pointer hover:bg-teal hover:text-light"
        onClick={() => (window.location = `/chat/${partner._id}`)}
    >
        {/* Name and Profile Pic */}
        <div className="flex flex-col justify-center items-center">
            <Avatar src={partner.profilePictureId} className="profile-pic" />
            <h4 className="font-bold">{partner.name}</h4>
        </div>

        <div className=" flex-1 flex flex-col justify-center p-4">
            <div className="post-time ">
                <h4 className="font-light">16:20 12/01/2020</h4>
            </div>
            <div className="   font-semibold">
                <Typography variant="body">Hey, when are you free?</Typography>
            </div>
        </div>
    </div>
);

export default function Chats() {
    const [user, setUser] = useState({});
    const [chats, setChats] = useState([]);

    async function init() {
        try {
            let user = await client.authenticate();
            user = user.user;
            setUser(user);

            let chats = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/custom-chats/${user._id}`
            );
            chats = await chats.json();
            console.log(chats);
            setChats(chats);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div
            className="chats-page flex flex-col w-2/3 m-auto my-10  rounded-lg border border-gray-500 "
            style={{ height: "500px", minHeight: "500px" }}
        >
            {/* Chats */}
            <h4 className=" text-4xl text-center p-4 border-b border-gray-300">
                Chats
            </h4>
            <div className="chats h-full">
                <Scrollbars style={{ height: "100%", width: "100%" }}>
                    {chats.map((chat) => {
                        let partner = chat.members.filter(
                            (member) => member._id !== user._id
                        )[0];

                        return (
                            <>
                                <Chat partner={partner} key={chat._id} />
                            </>
                        );
                    })}
                </Scrollbars>
            </div>
        </div>
    );
}

// {chats.map((chat) => {
//     let partner = chat.members.filter(
//         (member) => member._id !== user._id
//     )[0];

// })}
