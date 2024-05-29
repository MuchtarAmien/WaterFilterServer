const { resError, ErrorException } = require("../services/responseHandler");
const prisma = require("../prisma/client");
const jwt = require("jsonwebtoken");
const {
    getAuthorizationToken,
    getUser,
    getResetUrlPayload,
    hashValidator,
} = require("../services/auth");
const crypto = require("crypto");

const appLoginRequired = async (req, res, next) => {
    const jwtToken = await getAuthorizationToken(req);
    try {
        // check if token exits
        if (!jwtToken) return res.redirect("/user/login");

        // find user
        const user = await prisma.user.findUnique({
            where: {
                id: jwtToken.userID,
            },
            select: {
                id: true,
                username: true,
                updatedAt: true,
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (
            new Date(Number(jwtToken.iat * 1000)) <
            new Date(user.passwordUpdatedAt)
        )
            throw new res.redirect("/user/login");

        if (!user) res.redirect("/user/login");

        req.username = user.username;
        req.role = user.role.name;
        req.userId = user.id;
        if (user) return next();
    } catch (error) {
        return resError({
            res,
            title: "Cant find the user",
            errors: error,
            code: 401,
        });
    }
};

const appLogoutRequired = async (req, res, next) => {
    const jwtToken = await getAuthorizationToken(req);
    // check if token exits
    if (jwtToken) res.redirect("/");
    next();
};

module.exports = {
    appLoginRequired,
    appLogoutRequired,
};
