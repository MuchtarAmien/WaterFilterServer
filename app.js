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

http.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING IN PORT ${PORT}`);
});
