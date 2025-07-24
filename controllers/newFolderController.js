const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const validateFolder = [
    body("folder")
        .trim()
        .notEmpty()
        .withMessage("Folder name must not be empty.")
]

exports.displayNewFolderForm = (req, res, next) => {
    res.render("new-folder");
}

exports.addFolder = (req, res, next) => {

}