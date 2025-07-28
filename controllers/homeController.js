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
            where: { id: req.params.folderID },
            data: { name: req.body.folder }
        }); 
        res.redirect(`/home/${folder.parentID}`);
    }
]