const { body, validationResult } = require("express-validator");
const { isLoggedIn } = require("../auth/passportConfig");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const checkRootFolder = async (req, res, next) => {
    const isRootExist = await prisma.folder.findFirst({
        where: {
            author: req.user.username, 
            name: "root"
        }
    });
    if (isRootExist === null) {
        await prisma.folder.create({
            data: {
                name: "root",
                author: req.user.username,
            }
        });
    }
    return next();
}

exports.displayHome = [
    isLoggedIn,
    checkRootFolder,
    async(req, res) => {
        if (req.params.parentID !== "root") {
            const isFolderExist = await prisma.folder.findUnique({
                where: {
                    id: req.params.parentID,
                    author: req.user.username
                }
            }); 
            if (isFolderExist === null) {
                return res.redirect("/home/root");
            }
        }
        const folders = await prisma.folder.findMany({
            where: {
                author: req.user.username,
                parentID: req.params.parentID
            }
        });
        const files = await prisma.file.findMany({
            where: {
                author: req.user.username, 
                parentID: req.params.parentID
            }, 
        });
        res.render("home", {
            parentID: req.params.parentID,
            folders: folders,
            files: files
        });
    }
]

exports.displayUpdateFolderForm = (req, res) => {
    res.render("update-folder", {
        folderID: req.params.folderID
    });
}

const validateUpdateFolder = [body("folder").trim().notEmpty().withMessage("Folder name cannot be empty")];

exports.updateFolder = [
    validateUpdateFolder,
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).render("update-folder", {
                folderID: req.params.folderID, 
                error: error.array()[0].msg
            })
        }
        const folder = await prisma.folder.update({
            where: { 
                id: req.params.folderID,
                author: req.user.username
            },
            data: { 
                name: req.body.folder 
            }
        }); 
        res.redirect(`/home/${folder.parentID}`);
    }
]

exports.deleteFolder = async (req, res) => {
    let visitedFoldersID = [];
    let queue = [req.params.folderID];
    while (queue.length > 0) {
        const parentID = queue.shift();
        const childFolders = await prisma.folder.findMany({
            where: {
                author: req.user.username,
                parentID: parentID
            }
        });
        if (childFolders.length > 0) {
            childFolders.forEach((folder) => {
                queue.push(folder.id);
            })
        }
        visitedFoldersID.push(parentID);
    };
    // console.log(visitedFoldersID);
    visitedFoldersID.forEach( async (id) => {
        await prisma.folder.delete({
            where: {
                id: id,
                author: req.user.username, 
            }
        });
        await prisma.file.deleteMany({
            where: {
                author: req.user.username,
                parentID: id
            }
        });
    });
    const { parentID } = await prisma.folder.findFirst({
        where: {
            author: req.user.username,
            parentID: req.params.parentID
        }
    });
    res.redirect(`/home/${parentID}`);
}