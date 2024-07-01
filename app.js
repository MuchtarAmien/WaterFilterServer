if (process.env.NODE_ENV !== "PRODUCTION") require("dotenv").config();
const cors = require("cors");
const expbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const express = require("express");
const { MqttServer } = require("./services/mqttserver");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 8080;
const { router: ROUTER, mqttTopic } = require("./router");
const { sendTelegramMessageByKodeUnik, sendTelegramMessageByUsername } = require('./services/telegramServices'); // Sesuaikan path ini dengan lokasi file Anda

MqttServer.createConnection();
MqttServer.setSocket(io);
MqttServer.use(mqttTopic);

io.on("connection", (socket) => {
    console.log("A socket client connected => ", socket.id);
});

app.engine(
    "handlebars",
    expbs.engine({ extname: ".handlebars", defaultLayout: "" })
);
app.io = io;
app.mqttpublish = MqttServer.response;
app.set("views", "views");
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/", ROUTER);
app.use(express.static("public"));
app.use("/static", express.static("public"));
router.post(
    '/send_notification_by_kode_unik',
    loginRequired, // Middleware untuk otorisasi
    async (req, res) => {
        const { message, kode_unik } = req.body; // Pastikan body request mengandung message dan kode_unik

        try {
            await sendTelegramMessageByKodeUnik(message, { kode_unik });
            res.status(200).send('Notification sent successfully');
        } catch (error) {
            console.error('Error sending notification:', error);
            res.status(500).send('Internal Server Error');
        }
    }
);
router.post(
    '/send_notification_by_username',
    loginRequired, // Middleware untuk otorisasi
    async (req, res) => {
        const { message } = req.body;

        try {
            await sendTelegramMessageByUsername(req, message); // Pass req as parameter
            res.status(200).send('Notification sent successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
);
http.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING IN PORT ${PORT}`);
});
