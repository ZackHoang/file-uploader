const { isLoggedIn } = require("../auth/passportConfig");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

exports.displayHome = [
    isLoggedIn,
    async(req, res) => {
        const isFolderExist = await prisma.folder.findUnique({
            where: {
                id: req.params.parentID
            }
        }).length > 0 || req.params.parentID === "root"; 
        if (isFolderExist === false) {
            return res.redirect("/home/root");
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