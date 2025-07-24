const { isLoggedIn } = require("../auth/passportConfig");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const fs = require("node:fs");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

exports.displayNewFileForm = [
    isLoggedIn,
    (req, res, next) => {
        res.render("new-file");
    }
];

exports.uploadFile = [
    upload.single("file"), 
    async (req, res, next) => {
        if (req.file.mimetype.includes("image") || req.file.mimetype.includes("video")) {
            fs.writeFile(`./files/${req.file.originalname}`, req.file.buffer, async err => {
                if (err) {
                    console.error(err);
                } else {
                    await prisma.file.create({
                        data: {
                            name: req.file.originalname, 
                            size: req.file.size, 
                            url: "something",
                            author: req.user.username
                        }
                    });
                    res.redirect("/home");
                }
            });
        } else {
            res.render("new-file", {
                error: "Unappropriate file. Please upload only image or video."
            });
        }
    }
];