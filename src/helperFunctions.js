export const test = () => console.log("test");

export const test2 = () => console.log("test2");

export const smallBigString = (string1, string2) => {
    if (string1 > string2) return string2 + string1;
    return string1 + string2;
};
