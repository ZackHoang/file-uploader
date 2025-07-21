require("dotenv").config()
const express = require("express");
const signupRouter = require("./routers/signupRouter");
const app = express();
const path = require("node:path");
const session = require("express-session");
const prismaSession = require("./auth/sessionConfig");
const passport = require("passport");
const logInRouter = require("./routers/logInRouter");
const homeRouter = require("./routers/homeRouter");
const logOutRouter = require("./routers/logOutRouter");
const port = parseInt(process.env.PORT) || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session(prismaSession));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use( async (req, res, next) => {
    console.log( await req.user);
    console.log(req.session);
    res.locals.session = req.session;
    return next();
});

app.use("/", logInRouter);
app.use("/sign-up", signupRouter);
app.use("/home", homeRouter);
app.use("/log-out", logOutRouter);
app.use("/{*splat}", (req, res) => {
    res.render("404");
})

app.listen(port, () => {
    console.log("listening");
});