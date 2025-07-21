const { isLoggedIn } = require("../auth/passportConfig");

exports.displayHome = [
    isLoggedIn,
    (req, res, next) => {
        res.render("home");
    }
]