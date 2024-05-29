const router = require("express").Router();
const { appLoginRequired } = require("../middlewares/appMiddleware");
const { pairing } = require("./controller");
const { dashboard } = require("./controller");

router.get("/pairing", appLoginRequired, pairing);
router.get("/dashboard", appLoginRequired, dashboard);

module.exports = router;
