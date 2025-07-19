const passport = require("passport");
const LocalStrategy = require("passport-local");
const { PrismaClient } = require("./generated/prisma");

const prisma = new PrismaClient();