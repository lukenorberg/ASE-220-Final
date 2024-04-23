const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const CRED_FILE = path.join(__dirname, "..", "blobs", "credentials.csv");
const fcn = require("../utils/functions.js");

app.use(cookieParser());
app.use(express.json());

app.post("/auth/signin", (req, res) => {
    const { email, password } = req.body;
    const userLoginInfo = { email, password };

    const login = fcn.loginUser(userLoginInfo);
    console.log(login)

    if (!login.success) {
        res.status(401).send({
            success: false,
            data: "Incorrect login info. Please try again or sign up.",
        });
        return;
    } else {
        const token = jwt.sign({ email, fullName: login.fullName }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.cookie("token", "Bearer " + token, {
            httpOnly: true,
            secure: true,
        });
        res.status(200).send({
            success: true,
            message: "User successfully logged in.",
            jwt: token,
        });
    }
});

app.post("/auth/signup", (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const userInfo = { firstName, lastName, email, password };

    if (fcn.checkEmailExists(email)) {
        res.status(400).send({
            success: false,
            data: "An account with that email already exists."
        });
        return;
    }
    if (!fcn.validateEmail(email)) {
        res.status(400).send({
            success: false,
            data: "Email doesn't fit the requirements."
        });
        return;
    }
    if (!fcn.validatePassword(password)) {
        res.status(400).send({
            success: false,
            data: "Password doesn't fit the requirements."
        });
        return;
    }
    success = fcn.appendUser(CRED_FILE, userInfo)
    if (!success) {
        res.status(500).send({
            success: false,
            data: "Error saving signup information."
        });
        return;
    }
    res.send({
        success: true,
        data: "Account created successfully."
    });
});

app.get("/auth/signout", (req, res) => {
    res.cookie("token", "", { httpOnly: true, secure: true });
});

module.exports = app;
