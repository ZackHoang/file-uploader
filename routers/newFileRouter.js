const { Router } = require("express");
const { displayNewFileForm, uploadFile } = require("../controllers/newFileController");
const newFileRouter = Router();

newFileRouter.get("/:parentID", displayNewFileForm);
newFileRouter.post("/:parentID", uploadFile);

module.exports = newFileRouter;