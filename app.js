if (process.env.NODE_ENV !== "PRODUCTION") require("dotenv").config();
const cors = require("cors");
const expbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const ROUTER = require("./router");
app.engine(
    "handlebars",
    expbs.engine({ extname: ".handlebars", defaultLayout: "" })
);
app.set("views", "views");
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/", ROUTER);
app.use(express.static("public"));
app.use("/static", express.static("public"));

app.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING IN PORT ${PORT}`);
});
