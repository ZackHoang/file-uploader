require("dotenv").config()
const express = require("express");
const signupRouter = require("./routers/signupRouter");
const app = express();
const path = require("node:path");
const session = require("express-session");
const prismaSession = require("./auth/sessionConfig");
const passport = require("passport");
const logInRouter = require("./routers/logInRouter");
const port = parseInt(process.env.PORT) || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session(prismaSession));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use("/", logInRouter);
app.use("/sign-up", signupRouter);

app.listen(port, () => {
    console.log("listening");
});