import React, { useState, useEffect } from "react";
import client from "../feathers";
import { Link } from "react-router-dom";

export default function AllUsers() {
    const usersService = client.service("users");

    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});

    async function init() {
        try {
            let result = await usersService.find();
            // console.log(result.data);
            setUsers(result.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div>
            <h1>All Users</h1>
            <ul>
                {users.map((user) => (
                    <li key={user._id} style={{ margin: "10px" }}>
                        <Link to={`/user/${user._id}`}>
                            Name: {user.name} <br />
                            Native Language: {user.nativeLanguage} <br />
                            Target Language: {user.targetLanguage}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
