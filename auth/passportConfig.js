const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

passport.use(
    new LocalStrategy({passReqToCallback: true}, async (req, username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    username: username
                }
            });
            if (!user) {
                return done(null, false, { message: "Incorrect username and/or password" });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: "Incorrect username and/or password" });
            }
            return done(null, user);
        } catch(e) {
            return done(e);
        }
    })
); 

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    try {
        const user = prisma.user.findUnique({
            where: {
                id: id
            }
        });
        done(null, user);
    } catch(err) {
        done(err);
    }
});

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } 

    res.redirect("/");
}

exports.authenticate = passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureMessage: true
});