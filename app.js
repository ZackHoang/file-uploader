require("dotenv").config()
const express = require("express");
const signupRouter = require("./routers/signupRouter");
const app = express();
const path = require("node:path");
const port = parseInt(process.env.PORT) || 3000;

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use("/sign-up", signupRouter);

app.listen(port, () => {
    console.log("listening");
})