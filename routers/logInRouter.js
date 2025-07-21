const { Router } = require("express");
const { displayLogIn } = require("../controllers/logInController");
const { authenticate } = require("../auth/passportConfig");
const logInRouter = Router();

logInRouter.get("/", displayLogIn);
logInRouter.post("/", authenticate);

module.exports = logInRouter;