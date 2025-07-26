const { isLoggedIn } = require("../auth/passportConfig");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

exports.displayHome = [
    isLoggedIn,
    async(req, res, next) => {
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
        // console.log(folders);
        // console.log(files);
        res.render("home", {
            parentID: req.params.parentID,
            folders: folders,
            files: files
        });
    }
]