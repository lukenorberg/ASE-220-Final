const express = require("express");
const postDelete = express();

const {
    getRecipeIndexById,
    isUniqueId,
    getRandomId,
    decodeJwt,
} = require("../utils/functions");

const { createRecipe, deleteRecipe } = require("../utils/mongodb");
const { ObjectId } = require("mongodb");

postDelete.post("/recipes", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let bearerHeader = req.headers["authorization"];
    const jwtBody = decodeJwt(bearerHeader);
    if (jwtBody) {
        req.body.author_id = new ObjectId(jwtBody.id);
    }
    delete req.body._id;
    delete req.body.id;
    const { code, success, data } = await createRecipe(req.body);

    res.status(code).send({
        success,
        data,
    });
});

postDelete.delete("/recipes/:id", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const id = req.params.id;
    const objId = new ObjectId(id);
    const { code, success, data } = await deleteRecipe(objId);
    res.status(code).send({
        success,
        data,
    });
});

module.exports = postDelete;
