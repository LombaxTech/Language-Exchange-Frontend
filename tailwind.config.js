const colors = require("tailwindcss/colors");

module.exports = {
    purge: [],
    // mode: "jit",
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                light: "#e2f3f5",
                teal: "#22d1ee",
                blue: "#3d5af1",
                dark: "#0e153a",
            },
            width: {
                fitContent: "fit-content",
            },
            maxHeight: {
                0: "0",
                "1/4": "25%",
                "1/2": "50%",
                "3/4": "75%",
                full: "100%",
            },
            screens: {
                sm: { max: "640px" },
                // => @media (min-width: 640px) { ... }

                md: { max: "768px" },
                // => @media (min-width: 768px) { ... }

                lg: { max: "1024px" },
                // => @media (min-width: 1024px) { ... }
            },
            zIndex: {
                "-100": "-100",
            },
        },
    },
    variants: {
        extend: {
            fontSize: ["hover", "focus"],
            backgroundOpacity: ["active"],
            borderWidth: ["hover", "focus"],
        },
    },
    plugins: [],
};
