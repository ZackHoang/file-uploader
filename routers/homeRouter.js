const { Router } = require("express");
const { displayHome } = require("../controllers/homeController");
const homeRouter = Router();

homeRouter.get("/", displayHome);

module.exports = homeRouter;