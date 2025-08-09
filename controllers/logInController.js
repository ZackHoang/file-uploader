const { body } = require("express-validator");
const { authenticate } = require("../auth/passportConfig");

const validateLogIn = [
    body("username").trim(),
];

exports.displayLogIn = (req, res, next) => {
    res.render("log-in");
    delete req.session.messages;
}

exports.logIn = [
    validateLogIn,
    authenticate
]