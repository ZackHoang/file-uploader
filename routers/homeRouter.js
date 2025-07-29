const { Router } = require("express");
const { displayHome, updateFolder, displayUpdateFolderForm, deleteFolder, displayFileInformation, deleteFile } = require("../controllers/homeController");
const homeRouter = Router();

homeRouter.get("/folder/:parentID", displayHome);
homeRouter.get("/folder/update/:folderID", displayUpdateFolderForm);
homeRouter.post("/folder/update/:folderID", updateFolder);
homeRouter.get("/folder/delete/:folderID", deleteFolder);
homeRouter.get("/file/:fileID", displayFileInformation);
homeRouter.get("/file/delete/:fileID", deleteFile);

module.exports = homeRouter;