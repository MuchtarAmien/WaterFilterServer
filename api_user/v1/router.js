const router = require("express").Router();
const { body, query } = require("express-validator");
const { formChacker } = require("../../middlewares/formMiddleware");
const {
    loginRequired,
    logoutRequired,
    usernameIsNotExist,
    emailIsNotExist,
    emailIsExist,
    userIsNotVerify,
    allowedRole,
    tokenIsValid,
    tokenTypeIs,
} = require("../../middlewares/userMiddlewares");
const controllers = require("./controllers");
const { sendTelegramMessageByUsername } = require("../../services/telegramServices"); // Impor layanan Telegram

router.post(
    "/register",
    logoutRequired,
    body("username")
        .isLength({ min: 6 })
        .withMessage("Username minimum 6 character"),
    body("email").isEmail().withMessage("Please enter valid email"),
    body("password")
        .isStrongPassword()
        .withMessage(
            "Password must have at least 8 characters, have a combination of numbers, uppercase, lowercase letters and unique characters"
        ),
    body("telegramId").optional().isString().withMessage("Telegram ID must be a string"),
    formChacker,
    usernameIsNotExist,
    emailIsNotExist,
    controllers.register
);
router.post("/login", logoutRequired, controllers.login);
router.get("/logout", loginRequired, controllers.logout);
router.get(
    "/list",
    loginRequired,
    allowedRole("SUPER ADMIN"),
    controllers.list
);
router.post(
    "/forgot-password",
    logoutRequired,
    body("email").isEmail(),
    formChacker,
    emailIsExist,
    controllers.forgotPassword
);
router.post(
    "/reset-password",
    logoutRequired,
    query("token").notEmpty(),
    body("password").notEmpty(),
    formChacker,
    tokenIsValid,
    tokenTypeIs("RESET_TOKEN"),
    controllers.resetPassword
);
router.post(
    "/send-verification-link/",
    loginRequired,
    userIsNotVerify,
    controllers.sendVerificationEmail
);

router.get(
    "/email-verification-process/",
    query("token").notEmpty().withMessage("Your token is missing"),
    formChacker,
    tokenIsValid,
    tokenTypeIs("VERIFICATION_TOKEN"),
    controllers.verifyingEmail
);

router
    .use(loginRequired)
    .route("/")
    .get(controllers.detail)
    .patch(
        body("oldPassword").notEmpty(),
        body("newPassword").isStrongPassword(),
        formChacker,
        controllers.updatePassword
    );

router.post(
    "/update/profile",
    loginRequired,
    body("username").notEmpty().withMessage("Full name is required"),
    body("email").notEmpty().isEmail().withMessage("Valid email is required"),
    body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("telegramId").optional().isString().withMessage("Telegram ID must be a string"),
    formChacker,
    controllers.profileUpdate
);
router.post(
    '/send_notification_by_username',
    loginRequired, // Middleware untuk otorisasi
    async (req, res) => {
        const { telegramId, message } = req.body; // Ambil telegramId dan message dari req.body

        if (!telegramId || !message) {
            return res.status(400).json({ error: 'TelegramId and message are required' });
        }

        try {
            await sendTelegramMessageByUsername(telegramId, message); // Panggil dengan telegramId
            res.status(200).json({ message: 'Notification sent successfully' });
        } catch (error) {
            console.error('Error sending notification:', error);
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
);
router.post(
    '/send_notification_by_kode_unik',
    loginRequired, // Middleware untuk otorisasi
    async (req, res) => {
        const { message, kode_unik } = req.body; // Pastikan body request mengandung message dan kode_unik

        if (!message || !kode_unik) {
            return res.status(400).json({ error: 'Message and kode_unik are required' });
        }

        try {
            await sendTelegramMessageByKodeUnik(message, { kode_unik });
            res.status(200).json({ message: 'Notification sent successfully' });
        } catch (error) {
            console.error('Error sending notification:', error);
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
);
module.exports = router;
