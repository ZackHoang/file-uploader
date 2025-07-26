const { Router } = require("express");
const { displayNewFolderForm, addFolder } = require("../controllers/newFolderController");
const newFolderRouter = Router();

newFolderRouter.get("/:parentID", displayNewFolderForm);
newFolderRouter.post("/:parentID", addFolder);

module.exports = newFolderRouter;