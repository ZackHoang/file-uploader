require("dotenv").config();
const { body, validationResult } = require("express-validator");
const { isLoggedIn } = require("../auth/passportConfig");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const cloudinary = require("cloudinary").v2;
cloudinary.config();
const path = require("node:path");

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
                return res.redirect("/home/folder/root");
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

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

exports.displayFileInformation = [
    isLoggedIn,
    async (req, res) => {
        const file = await prisma.file.findUnique({
            where: {
                author: req.user.username, 
                id: req.params.fileID
            }
        });
        const fileDownloadUrl = await cloudinary.url(file.cloudinaryID, {
            flags: `attachment`, 
        });
        res.render("file-info", {
            file: file,
            size: formatBytes(file.size), 
            fileDownloadUrl: fileDownloadUrl
        });
    }
]

exports.displayUpdateFolderForm = [
    isLoggedIn,
    async (req, res) => {
        const folderToUpdate = await prisma.folder.findUnique({
            where: {
                id: req.params.folderID
            }
        })
        res.render("update-folder", {
            parentID: folderToUpdate.parentID,
            folderID: folderToUpdate.id
        });
    }
]

const validateUpdateFolder = [body("folder").trim().notEmpty().withMessage("Folder name cannot be empty")];

exports.updateFolder = [
    isLoggedIn,
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
        if (folder.parentID === "root") {
            res.redirect(`/home/folder/root`); 
        } else {
            res.redirect(`/home/folder/${folder.parentID}`);
        }
    }
]

exports.deleteFolder = [
    isLoggedIn,
    async (req, res) => {
        const { parentID } = await prisma.folder.findFirst({
            where: {
                id: req.params.folderID,
                author: req.user.username,
            }
        });
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
        visitedFoldersID.forEach( async (id) => {
            await prisma.folder.delete({
                where: {
                    id: id,
                    author: req.user.username, 
                }
            });
            const files = await prisma.file.findMany({
                where: {
                    author: req.user.username, 
                    parentID: id
                }
            });
            if (files.length === 0) {
                return;
            } else {
                files.forEach(async (file) => {
                    await cloudinary.uploader.destroy(`${file.cloudinaryID}`);
                });
                await prisma.file.deleteMany({
                    where: {
                        author: req.user.username,
                        parentID: id
                    }
                });
            }
        });
        res.redirect(`/home/folder/${parentID}`);
    }
]

exports.deleteFile = [
    isLoggedIn,
    async (req, res) => {
        const file = await prisma.file.delete({
            where: {
                author: req.user.username, 
                id: req.params.fileID
            }
        });
        await cloudinary.uploader.destroy(`${file.cloudinaryID}`);
        res.redirect(`/home/folder/${file.parentID}`);
    }
]