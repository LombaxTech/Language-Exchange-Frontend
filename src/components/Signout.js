import React from "react";
import client from "../feathers";

export default function Signout() {
    const signout = async () => {
        await client.logout();
        window.location.reload();
    };

    return (
        <div>
            <button onClick={signout}>Sign out</button>
        </div>
    );
}
