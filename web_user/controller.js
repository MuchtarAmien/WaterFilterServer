const { resError, resSuccess } = require("../services/responseHandler");

exports.signup = async (req, res) => {
    try {
        const data = {
            scripts: [
                "util/alertify.min.js",
                "util/httpRequest.js",
                "user_register.js",
            ],
        };
        return res.render("register", data);
    } catch (error) {
        return resError({ res, errors: error });
    }
};

exports.login = async (req, res) => {
    try {
        const data = {
            scripts: [
                "util/alertify.min.js",
                "util/httpRequest.js",
                "user_login.js",
            ],
        };
        return res.render("login", data);
    } catch (error) {
        return resError({ res, errors: error });
    }
};

exports.setting = async (req, res) => {
    try {
        return res.render("setting");
    } catch (error) {
        return resError({ res, errors: error });
    }
};

exports.logout = (req, res) => {
    res.cookie("Authorization", "", { maxAge: 1 }).redirect("/user/login");
};
