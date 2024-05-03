const { MongoClient, ServerApiVersion } = require('mongodb');
const { response, validRecipeFields, validUserFields } = require("./mongoHelper.js");
const { validateEmail, validatePassword } = require('./functions.js');

const uri = "mongodb+srv://lukenorberg:0XFxbysPG1s7skDH@cluster0.7age43r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

var recipes;
var users;

async function connect() {
    try {
        const db = client.db("savory_sagas");
        recipes = db.collection("recipes");
        users = db.collection("users");
    } catch (err) {
        console.log(err);
    }
}

async function getRecipes() {
    const res = await recipes.find({}).toArray();
    return response(200, true, res);
}

async function getRecipeById(id) {
    const res = await recipes.findOne({ _id: id });
    // client.close();
    return response(200, true, res);
}

async function createRecipe(recipe) {
    if (!validRecipeFields(recipe)) {
        // client.close();
        return response(400, false, "Not all required fields available.");
    }
    const res = await recipes.insertOne(recipe);
    // client.close();
    return response(201, true, res);
}

async function updateRecipe(recipe, id) {
    if (!validRecipeFields(recipe)) {
        return response(400, false, "Not all required fields available.");
    }
    const res = await recipes.updateOne({ _id: id }, { $set: recipe });
    return response(201, true, res);
}

async function deleteRecipe(id) {
    await recipes.findOneAndDelete({ _id: id });
    // client.close();
    return response(204, false, "");
}

async function getUsers() {
    const res = await users.find({}, { password: 0 }).toArray();
    // client.close();
    return response(200, true, res);
}

async function getUserById(id) {
    const res = await users.findOne({ _id: id }, { password: 0 })
    // client.close();
    return response(200, true, res);
}

async function loginUser(email, password) {
    const res = await users.findOne({ email, password }, { password: 0 });
    // client.close();
    return res ?
        response(200, true, res)
        : response(401, false, "Incorrect login information")
}

async function createUser(user) {
    if (!validUserFields(user)) {
        return response(400, false, "Not all required fields available.");
    }
    if (!validateEmail(user.email)) {
        // client.close();
        return response(400, false, "Bad email request.");
    }
    if (!validatePassword(user.password)) {
        // client.close();
        return response(400, false, "Bad password request. Requires a special character, a lowercase, uppercase, number, and at least 8 characters");
    }
    const countEmail = await users.find({ email: user.email }).count();
    if (countEmail !== 0) {
        // client.close();
        return response(400, false, "Account with email already exists.");
    }
    const res = await users.insertOne(user);
    // client.close();
    return response(201, true, res);
}

module.exports = { connect, getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, createUser, loginUser } 
