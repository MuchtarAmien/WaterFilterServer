const router = require("express").Router()
const { deviceList, generateDeviceId, generateRecord } = require("./controller")

router.get("/", deviceList)
router.post("/record", generateRecord)
router.post("/", generateDeviceId)

module.exports = router;