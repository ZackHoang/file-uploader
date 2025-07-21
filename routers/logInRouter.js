const { Router } = require("express");
const { displayLogIn, logIn } = require("../controllers/logInController");
const { authenticate } = require("../auth/passportConfig");
const logInRouter = Router();

logInRouter.get("/", displayLogIn);
logInRouter.post("/", logIn);

module.exports = logInRouter;