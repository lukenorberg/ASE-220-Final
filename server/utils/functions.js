function getRecipeIndexById(id, recipes) {
    for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].id == id) {
            return i;
        }
    }
    return -1;
}

function isUniqueId(id, recipes) {
    for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].id == id) {
            return false;
        }
    }
    return true;
}

function rand() {
    return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
}

function getRandomId(recipes) {
    let randomId = rand();
    while (!isUniqueId(randomId, recipes)) {
        randomId = rand();
    }
    return randomId;
}

// SIGN-UP VALIDATION

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

function checkEmailExists(email){
	const lineByLine = require("n-readlines");
	const path = require("path");
	const CRED_FILE = path.join(__dirname, "..", "blobs", "credentials.csv"); 
	const liner = new lineByLine(CRED_FILE);
	let line;

	while (line = liner.next()) {
	  lineInfo = line.toString("ascii").split(",");
	  if (email === lineInfo[0]) {
		return true;
	  }
	}
	return false;
}

// SIGN-IN VALIDATION

function loginUser(userInfo) {
    const lineByLine = require("n-readlines");
    const path = require("path");
    const CRED_FILE = path.join(__dirname, "..", "blobs", "credentials.csv");
    const liner = new lineByLine(CRED_FILE);
    let line;

    while ((line = liner.next())) {
        lineInfo = line.toString("ascii").split(",");
        if (
            userInfo.email === lineInfo[0] &&
            userInfo.password === lineInfo[1]
        ) {
            return { fullName: lineInfo[2] + " " + lineInfo[3], success: true };
        }
    }
    return { fullName: null, success: false };
}

function appendUser(credFile, userLoginInfo) {
    const fs = require("fs");
    const csvLine = `${userLoginInfo.email},${userLoginInfo.password},${userLoginInfo.firstName},${userLoginInfo.lastName}\n`;
    fs.appendFile(credFile, csvLine, function(err) {
        if (err) {
            console.log(err);
            return false;
        }
    });
    return true;
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
    getRecipeIndexById,
    isUniqueId,
    getRandomId,
    validateEmail,
    validatePassword,
    checkEmailExists,
	loginUser,
    appendUser,
    decodeJwt,
};
