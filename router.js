const router = require("express").Router();
const APP_ROUTER_V1 = require("./app/router");
const ROLE_V1 = require("./api_role/v1/router");
const USER_V1 = require("./api_user/v1/router");
const DEVICE_V1 = require("./api_device/v1/router");
const WEB_USER = require("./web_user/router");
const WEB_DEVICE = require("./web_device/router");

router.use("/", APP_ROUTER_V1);
router.use("/api/v1/role", ROLE_V1);
router.use("/api/v1/user", USER_V1);
router.use("/api/v1/device", DEVICE_V1);
router.use("/user",WEB_USER);
router.use("/device",WEB_DEVICE);

module.exports = router;
