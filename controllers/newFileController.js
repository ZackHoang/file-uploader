require("dotenv").config();
const { isLoggedIn } = require("../auth/passportConfig");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const cloudinary = require('cloudinary').v2;
cloudinary.config();

exports.displayNewFileForm = [
    isLoggedIn,
    (req, res, next) => {
        res.render("new-file", {
            parentID: req.params.parentID
        });
    }
];

exports.uploadFile = [
    isLoggedIn,
    upload.single("file"), 
    async (req, res) => {
        if (req.file.mimetype.includes("image")) {
            if (req.file.size > 1_000_000) {
                res.render("new-file", {
                    error: "Your image is too big. Please upload images with under 1 megabytes",
                    parentID: req.params.parentID
                })
            }
            try {
                const result = await new Promise((resolve) => {
                    cloudinary.uploader.upload_stream((error, uploadResult) => {
                        return resolve(uploadResult);
                    }).end(req.file.buffer)
                });
                await prisma.file.create({
                    data: {
                        name: req.file.originalname, 
                        cloudinaryID: result.public_id,
                        size: req.file.size, 
                        author: req.user.username,
                        parentID: req.params.parentID,
                        url: result.url
                    }
                });
                res.redirect(`/home/folder/${req.params.parentID}`);
            } catch (e) {
                console.error(e);
            }
        } else {
            res.render("new-file", {
                error: "Unappropriate file. Please upload only image", 
                parentID: req.params.parentID
            });
        }
    }
];