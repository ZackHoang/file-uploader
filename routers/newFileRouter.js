const { Router } = require("express");
const { displayNewFileForm, uploadFile } = require("../controllers/newFileController");
const newFileRouter = Router();

newFileRouter.get("/", displayNewFileForm);
newFileRouter.post("/", uploadFile);

module.exports = newFileRouter;