const router = require("express").Router();
const {
    appLogoutRequired,
    appLoginRequired,
} = require("../middlewares/appMiddleware");
const { signup } = require("./controller");
const { login } = require("./controller");
const { setting } = require("./controller");

router.get("/signup", appLogoutRequired, signup);
router.get("/login", appLogoutRequired, login);
router.get("/setting", appLoginRequired, setting);

module.exports = router;
