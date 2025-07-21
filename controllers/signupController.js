const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

exports.displaySignUp = (req, res, next) => {
    res.render("sign-up");
}

const validateSignup = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("username cannot be empty"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password cannot be empty")
]

exports.signup = [
    validateSignup,
    async (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).render("sign-up", {
                errors: error.array()
            });
        }
        try {
            await prisma.user.create({
                data: {
                    username: req.body.username,
                    password: await bcrypt.hash(req.body.password, 10)
                }
            });
        } catch {
            res.render("sign-up", {
                usernameTaken: "This username is taken, please choose another one."
            });
        }
    }
]

