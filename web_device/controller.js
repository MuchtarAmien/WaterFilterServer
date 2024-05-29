const { resError, resSuccess } = require("../services/responseHandler");

exports.pairing = async (req, res) => {
    try {
        const data = {
            scripts: [
                "util/alertify.min.js",
                "util/httpRequest.js",
                "device_pairing.js",
            ],
        };
        return res.render("pairing", data);
    } catch (error) {
        return resError({ res, errors: error });
    }
};
exports.dashboard = async (req, res) => {
    try {
        const data = {
            scripts: [
                "util/alertify.min.js",
                "util/httpRequest.js",
                "device_dashboard_device_list.js",
            ],
        };
        return res.render("dashboard", data);
    } catch (error) {
        return resError({ res, errors: error });
    }
};
