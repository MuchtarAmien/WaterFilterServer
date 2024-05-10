const router = require ("express").Router()
const {signup} = require ("./controller")
const {login} = require ("./controller")
const {setting} = require ("./controller")


router.get("/signup", signup)
router.get("/login", login)
router.get("/setting", setting)

module.exports = router;