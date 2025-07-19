const { Router } = require("express");
const { displaySignUp, signup } = require("../controllers/signupController");
const signupRouter = Router();

signupRouter.get("/", displaySignUp);
signupRouter.post("/", signup);

module.exports = signupRouter;