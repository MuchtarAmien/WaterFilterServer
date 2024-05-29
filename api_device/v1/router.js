const router = require("express").Router();
const { loginRequired } = require("../../middlewares/userMiddlewares");
const {
    deviceList,
    generateDeviceId,
    generateRecord,
    linkDeviceToUser,
    userDeviceList,
    deviceHistory,
} = require("./controller");

router.get("/", deviceList);
router.get("/user", loginRequired, userDeviceList);
router.get("/history", loginRequired, deviceHistory);
router.post("/link", loginRequired, linkDeviceToUser);
router.post("/record", generateRecord);
router.post("/", generateDeviceId);

module.exports = router;
