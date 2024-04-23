const express = require("express");
const getPut = express();
const path = require("path");
const fs = require("fs");
const { getRecipeIndexById, decodeJwt } = require("../utils/functions.js");

const FILE = path.join(__dirname, "..", "blobs", "recipes.json");

getPut.get("/recipes", function(req, res) {
    res.setHeader("Content-Type", "application/json");
    if (!fs.existsSync(FILE)) {
        res.send({
            success: false,
            data: "Error reading file",
        });
        return;
    }
    const content = fs.readFileSync(FILE, "utf8");
    res.send({ success: true, data: JSON.parse(content) });
});

getPut.get("/recipes/:id", function(req, res) {
    res.setHeader("Content-Type", "application/json");
    const id = parseInt(req.params.id);
    if (!fs.existsSync(FILE)) {
        res.send({
            success: false,
            data: "Error reading file",
        });
        return;
    }
    const content = fs.readFileSync(FILE, "utf8");
    const recipes = JSON.parse(content);
    const arrId = getRecipeIndexById(id, recipes);

    if (!recipes[arrId]) {
        res.send({
            success: false,
            data: "user not found",
        });
        return;
    }

    let bearerHeader = req.headers["authorization"];
    const jwtBody = decodeJwt(bearerHeader);
    let isUser = false;
    if (jwtBody && jwtBody.fullName === recipes[arrId].author) {
        isUser = true;
    }

    res.send({
        success: true,
        data: recipes[arrId],
        isUser,
    });
});

getPut.put("/recipes/:id", function(req, res) {
    res.setHeader("Content-Type", "application/json");

    const id = parseInt(req.params.id);
    if (!fs.existsSync(FILE)) {
        res.send({ success: false, message: "Error reading file" });
        return;
    }
    const content = fs.readFileSync(FILE, "utf8");
    const recipes = JSON.parse(content);
    const arrId = getRecipeIndexById(id, recipes);

    for (let key of Object.keys(recipes[arrId])) {
        if (req.body[key]) {
            recipes[arrId][key] = req.body[key];
        }
    }

    fs.writeFileSync(FILE, JSON.stringify(recipes, null, 2));
    res.send({ success: true, data: recipes[arrId] });
});

module.exports = getPut;
