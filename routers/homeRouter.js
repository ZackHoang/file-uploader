const { Router } = require("express");
const { displayHome } = require("../controllers/homeController");
const homeRouter = Router();

homeRouter.get("/:parentID", displayHome);

module.exports = homeRouter;