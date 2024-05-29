const router = require("express").Router();
const {
    appLogoutRequired,
    appLoginRequired,
} = require("../middlewares/appMiddleware");
const { signup, logout, login, setting } = require("./controller");

router.get("/signup", appLogoutRequired, signup);
router.get("/login", appLogoutRequired, login);
router.get("/setting", appLoginRequired, setting);
router.get("/logout", appLoginRequired, logout);

module.exports = router;
