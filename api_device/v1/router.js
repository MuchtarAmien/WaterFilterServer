const router = require("express").Router();
const { MqttTopic } = require("../../services/mqttserver");
const mqttTopic = new MqttTopic();
const { loginRequired } = require("../../middlewares/userMiddlewares");
const {
    deviceList,
    generateDeviceId,
    generateRecord,
    linkDeviceToUser,
    userDeviceList,
    deviceHistory,
    generateRecordMqtt,
    toggleDevice,
    deviceDetail,
} = require("./controller");

router.get("/", deviceList);
router.get("/info/:kode_unik", deviceDetail);
router.get("/user", loginRequired, userDeviceList);
router.get("/history", loginRequired, deviceHistory);
router.post("/link", loginRequired, linkDeviceToUser);
router.post("/record", generateRecord);
router.post("/generate", generateDeviceId);
router.post("/toggle", toggleDevice);
mqttTopic.listener("/update/record/", generateRecordMqtt);

module.exports = { router, mqttTopic };
