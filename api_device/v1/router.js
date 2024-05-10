const router = require("express").Router()
const {deviceList} = require("./controller")

router.get("/", deviceList)

module.exports = router;