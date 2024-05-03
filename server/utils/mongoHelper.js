const { validateEmail } = require("./functions");

function response(code, success, data) {
    return {
        code,
        success,
        data
    }
}

function validRecipeFields(recipe) {
    const reqFields = ["name", "category", "author", "author_id", "prep_time_hrs", "prep_time_mins", "cook_time_hrs", "cook_time_mins", "servings", "ingredients", "steps"];
    for (let i = 0; i < reqFields.length; i++) {
        const reqField = reqFields[i];
        if (!recipe[reqField]) {
            return false;
        }
    }
    const validCategories = ["Entrees", "Desserts", "Sides"];
    if (!validCategories.includes(recipe["category"])) {
        return false;
    }
    return true;
}

function validUserFields(user) {
    const reqFields = ["email", "password", "first_name", "last_name"];
    for (let i = 0; i < reqFields.length; i++) {
        const reqField = reqFields[i];
        if (!user[reqField]) {
            return false;
        }
    }
    return true
}

module.exports = { response, validRecipeFields, validUserFields }

