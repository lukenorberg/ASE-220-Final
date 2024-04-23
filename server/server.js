const express = require("express");
const bodyParser = require("body-parser");
const getPut = require("./routes/getPut.js");
const postDelete = require("./routes/postDelete.js");
const signInSignUp = require("./routes/signInSignUp.js");

const app = express();
const port = 3000;

app.use(express.static("client"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", getPut);
app.use("/api", postDelete);
app.use("/api", signInSignUp);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
