import React from "react";
import client from "../feathers";

export default function Signout() {
    const signout = async () => {
        window.location = "/";
        await client.logout();
    };

    return (
        <div>
            <button onClick={signout}>Sign out</button>
        </div>
    );
}
