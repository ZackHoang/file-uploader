const { Router } = require("express");
const { displayHome, updateFolder, displayUpdateFolderForm } = require("../controllers/homeController");
const homeRouter = Router();

homeRouter.get("/:parentID", displayHome);
homeRouter.get("/update/folder/:folderID", displayUpdateFolderForm);
homeRouter.post("/update/folder/:folderID", updateFolder);

module.exports = homeRouter;