const router = require("express").Router();
const { loginRequired } = require("../../middlewares/userMiddlewares");
const {
    deviceList,
    generateDeviceId,
    generateRecord,
    linkDeviceToUser,
} = require("./controller");

router.get("/", deviceList);
router.post("/link", loginRequired, linkDeviceToUser);
router.post("/record", generateRecord);
router.post("/", generateDeviceId);

module.exports = router;
