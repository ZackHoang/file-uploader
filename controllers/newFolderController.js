const { validationResult } = require("express-validator");
const { PrismaClient } = require("../generated/prisma");
const { isLoggedIn } = require("../auth/passportConfig");
const { body } = require("express-validator");
const prisma = new PrismaClient();

const validateFolder = [
    body("folder")
        .trim()
        .notEmpty()
        .withMessage("Folder name must not be empty.")
]

exports.displayNewFolderForm = (req, res, next) => {
    res.render("new-folder", {
        parentID: req.params.parentID
    });
}

exports.addFolder = [
    isLoggedIn,
    validateFolder,
    async (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).render("new-folder", {
                error: error.array()
            })
        }
        await prisma.folder.create({
            data: {
                name: req.body.folder, 
                author: req.user.username,
                parentID: req.params.parentID,
            }
        });
        res.redirect(`/home/${req.params.parentID}`);
    }
]