const { Router } = require("express");
const { logOut } = require("../controllers/logOutController");
const logOutRouter = Router();

logOutRouter.get("/", logOut);

module.exports = logOutRouter;