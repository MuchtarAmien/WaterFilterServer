const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expbs = require("express-handlebars");
const { MqttServer } = require("./services/mqttserver");
const { router: ROUTER, mqttTopic } = require("./router");
const { sendTelegramMessageByKodeUnik, sendTelegramMessageByUsername } = require("./services/telegramServices"); // Import fungsi dari telegramServices.js
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 8080;

// Inisialisasi MQTT Server
MqttServer.createConnection();
MqttServer.setSocket(io);
MqttServer.use(mqttTopic);

// Event handler ketika socket terkoneksi
io.on("connection", (socket) => {
    console.log("A socket client connected => ", socket.id);
});

// Konfigurasi Express Handlebars sebagai view engine
app.engine("handlebars", expbs.engine({ extname: ".handlebars", defaultLayout: "" }));
app.set("views", "views");
app.set("view engine", "handlebars");

// Middleware untuk parsing body dari request
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware untuk CORS dan Cookie Parser
app.use(cors());
app.use(cookieParser());

// Menggunakan router yang telah di-define
app.use("/", ROUTER);

// Middleware untuk static files
app.use(express.static("public"));
app.use("/static", express.static("public"));

// Menambahkan fungsi untuk mengirim pesan Telegram
app.sendTelegramMessageByKodeUnik = sendTelegramMessageByKodeUnik;
app.sendTelegramMessageByUsername = sendTelegramMessageByUsername;

// Menjalankan server HTTP
http.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING IN PORT ${PORT}`);
});
