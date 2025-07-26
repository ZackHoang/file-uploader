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
        res.render("new-file", {
            parentID: req.params.parentID
        });
    }
];

exports.uploadFile = [
    upload.single("file"), 
    async (req, res) => {
        if (req.file.mimetype.includes("image") || req.file.mimetype.includes("video")) {
            fs.writeFile(`./files/${req.file.originalname}`, req.file.buffer, async err => {
                if (err) {
                    console.error(err);
                } else {
                    await prisma.file.create({
                        data: {
                            name: req.file.originalname, 
                            size: req.file.size, 
                            author: req.user.username,
                            parentID: req.params.parentID,
                            url: "something"
                        }
                    });
                    res.redirect(`/home/${req.params.parentID}`);
                }
            });
        } else {
            res.render("new-file", {
                error: "Unappropriate file. Please upload only image or video."
            });
        }
    }
];