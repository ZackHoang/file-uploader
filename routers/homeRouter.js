const { Router } = require("express");
const { displayHome, updateFolder, displayUpdateFolderForm, deleteFolder } = require("../controllers/homeController");
const homeRouter = Router();

homeRouter.get("/:parentID", displayHome);
homeRouter.get("/update/folder/:folderID", displayUpdateFolderForm);
homeRouter.post("/update/folder/:folderID", updateFolder);
homeRouter.get("/delete/folder/:folderID", deleteFolder);

module.exports = homeRouter;