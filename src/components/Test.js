import React, { useState } from "react";

function Test() {
    const [name, setName] = useState("");

    return (
        <div>
            <h1>test</h1>

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </div>
    );
}

export default Test;
