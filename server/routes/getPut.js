const express = require("express");
const getPut = express();
const { decodeJwt } = require("../utils/functions.js");
const { getRecipes, getRecipeById, updateRecipe } = require("../utils/mongodb.js");
const { ObjectId } = require("mongodb");

getPut.get("/recipes", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const { code, success, data } = await getRecipes();
    res.status(code).json({ success, data });
});

getPut.get("/recipes/:id", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const id = req.params.id;
    const objId = new ObjectId(id);
    const { code, success, data } = await getRecipeById(objId);

    let bearerHeader = req.headers["authorization"];
    const jwtBody = decodeJwt(bearerHeader);
    let isUser = false;
    if (data && data.author_id && jwtBody && jwtBody.id === data.author_id.toString()) {
        isUser = true;
    }

    res.status(code).send({
        success,
        data,
        isUser,
    });
});

getPut.put("/recipes/:id", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const id = req.params.id;
    const objId = new ObjectId(id);
    delete req.body._id;
    delete req.body.id;

    const { code, success, data } = await updateRecipe(req.body, objId);

    res.status(code).send({
        success,
        data,
    });
});

module.exports = getPut;
