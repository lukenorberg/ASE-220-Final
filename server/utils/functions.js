function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
}

function validatePassword(password) {
    return (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password) &&
        password.length >= 8
    );
}

function decodeJwt(bearerHeader) {
    const jwt = require("jsonwebtoken");
    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ")[1];
        try {
            const authData = jwt.verify(bearerToken, process.env.JWT_SECRET);
            return authData;
        } catch (err) {
            return {};
        }
    } else {
        return {};
    }
}

module.exports = {
    validateEmail,
    validatePassword,
    decodeJwt,
};
