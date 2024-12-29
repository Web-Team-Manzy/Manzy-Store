require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 8082;

const route = require("./routes");
const db = require("./config/db");

// Connect to DB
db.connect();

// Config cookie
app.use(cookieParser());

// Config CORS
app.use(
    cors({
        origin: [process.env.FRONTEND_URL, process.env.ADMIN_PANEL_URL],
        credentials: true,
    })
);

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

route(app);

const options = {
    key: fs.readFileSync("./sslkeys/key.pem"),
    cert: fs.readFileSync("./sslkeys/cert.pem"),
};

const server = https.createServer(options, app);

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
