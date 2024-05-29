const router = require("express").Router();
const { loginRequired } = require("../../middlewares/userMiddlewares");
const {
    deviceList,
    generateDeviceId,
    generateRecord,
    linkDeviceToUser,
    userDeviceList,
} = require("./controller");

router.get("/", deviceList);
router.get("/user", loginRequired, userDeviceList);
router.post("/link", loginRequired, linkDeviceToUser);
router.post("/record", generateRecord);
router.post("/", generateDeviceId);

module.exports = router;
