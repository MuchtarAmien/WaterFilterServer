const router = require ("express").Router()
const {pairing} = require ("./controller")
const {dashboard} = require ("./controller")

router.get("/pairing", pairing)
router.get("/dashboard", dashboard)

module.exports = router;