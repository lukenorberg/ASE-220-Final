const express = require("express");
const postDelete = express();
const path = require("path");
const fs = require("fs");
const RECIPES = path.join(__dirname, "..", "blobs", "recipes.json");
const CREDS = path.join(__dirname, "..", "blobs", "credentials.csv");

const {
    getRecipeIndexById,
    isUniqueId,
    getRandomId,
} = require("../utils/functions");

postDelete.post("/recipes", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (!fs.existsSync(RECIPES)) {
        res.send({ success: false, message: "Error reading file" });
        return;
    }

    const content = fs.readFileSync(RECIPES, "utf8");
    let recipes = JSON.parse(content);
    const id = getRandomId(recipes);

    if (isUniqueId(id, recipes)) {
        const newRecipe = req.body;
        newRecipe.id = id;
        recipes.push(newRecipe);

        fs.writeFileSync(RECIPES, JSON.stringify(recipes, null, 2));
        console.log(`Recipe added successfully with id ${id}`);
        res.send({
            success: true,
            message: `Recipe added successfully with id ${id}`,
            data: recipes,
        });
    } else {
        console.log(`Error generating unique id`);
        res.send({ success: false, message: `Error generating unique id` });
    }
});

postDelete.post("/api/auth/signup", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (!fs.existsSync(CREDS)) {
        res.send({ success: false, message: "Error reading file" });
        return;
    }

    const content = fs.readFileSync(CREDS, "utf8");
    let recipes = JSON.parse(content);

    const newUser = req.body;
    recipes.push(newUser);

    fs.writeFileSync(CREDS, JSON.stringify(recipes, null, 2));
    console.log("User added successfully");
    res.send({
        success: true,
        message: "User added successfully",
        data: recipes,
    });
});

postDelete.post("/api/auth/signin", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (!fs.existsSync(CREDS)) {
        res.send({ success: false, message: "Error reading file" });
        return;
    }

    const content = fs.readFileSync(CREDS, "utf8");
    let recipes = JSON.parse(content);

    const newUser = req.body;
    recipes.push(newUser);

    fs.writeFileSync(CREDS, JSON.stringify(recipes, null, 2));
    console.log("User added successfully");
    res.send({
        success: true,
        message: "User added successfully",
        data: recipes,
    });
});

postDelete.delete("/recipes/:id", function(req, res) {
    res.setHeader("Content-Type", "application/json");

    if (!fs.existsSync(RECIPES)) {
        res.send({ success: false, message: "Error reading file" });
        return;
    }

    const content = fs.readFileSync(RECIPES, "utf8");
    let recipes = JSON.parse(content);
    const ID = parseInt(req.params.id);
    const arrId = getRecipeIndexById(ID, recipes);

    if (arrId != -1) {
        recipes.splice(arrId, 1);
        fs.writeFileSync(RECIPES, JSON.stringify(recipes, null, 2));
        console.log(`Recipe with id ${ID} deleted successfully`);

        res.send({
            success: true,
            message: `Recipe with id ${ID} deleted successfully`,
            data: recipes,
        });
    } else {
        console.log(`Recipe with id ${ID} not found`);
        res.send({ success: false, message: `Recipe with id ${ID} not found` });
    }
});

module.exports = postDelete;
