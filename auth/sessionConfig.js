require("dotenv").config();
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('../generated/prisma');

const prismaSession = {
    store: new PrismaSessionStore(
        new PrismaClient(),
        {
            checkPeriod: 2 * 60 * 1000,  //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
    ),
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: false, 
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}

module.exports = prismaSession;