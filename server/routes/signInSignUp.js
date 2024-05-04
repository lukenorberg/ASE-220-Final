const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const { loginUser, createUser } = require("../utils/mongodb.js");

app.use(cookieParser());
app.use(express.json());

app.post("/auth/signin", async (req, res) => {
    const { email, password } = req.body;
    const { code, success, data } = await loginUser(email, password);
    let token;

    if (success) {
        token = jwt.sign({ email, id: data._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.cookie("token", "Bearer " + token, {
            httpOnly: true,
            secure: true,
        });
    }
    res.status(code).json({
        success,
        data,
        jwt: token,
    });
});

app.post("/auth/signup", async (req, res) => {
    const { code, success, data } = await createUser(req.body);
    res.status(code).json({
        success,
        data,
    });
});

app.get("/auth/signout", (req, res) => {
    res.cookie("token", "", { httpOnly: true, secure: true });
});

module.exports = app;
