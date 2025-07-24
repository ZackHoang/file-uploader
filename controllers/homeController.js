const { isLoggedIn } = require("../auth/passportConfig");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

exports.displayHome = [
    isLoggedIn,
    async(req, res, next) => {
        const files = await prisma.file.findMany({
            where: {
                author: req.user.username, 
            }, 
        });
        res.render("home", {
            files: files
        });
    }
]