exports.displayLogIn = (req, res, next) => {
    res.render("log-in");
    delete req.session.messages;
}