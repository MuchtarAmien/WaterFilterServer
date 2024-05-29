const { resError, resSuccess } = require("../services/responseHandler");

exports.signup = async (req, res) => {
    try {
        const data = {
            scripts: ["user_register.js"],
        };
        return res.render("register", data);
    } catch (error) {
        return resError({ res, errors: error });
    }
};

exports.login = async (req, res) => {
    try {
        return res.render("login");
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
