require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const https = require("https");
const http = require("http");
const fs = require("fs");
const helmet = require("helmet");

const app = express();

// Ports
const HTTPS_PORT = process.env.APP_PORT || 443; // HTTPS port
const HTTP_PORT = process.env.HTTP_PORT || 80; // HTTP port

const route = require("./routes");
const db = require("./config/db");

// Kết nối DB
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

// Config Helmet để bảo mật
app.use(helmet());
app.use(
    helmet.hsts({
        maxAge: 31536000, // 1 năm
        includeSubDomains: true,
        preload: true,
    })
);

// Chuyển hướng HTTP sang HTTPS
app.use((req, res, next) => {
    if (!req.secure) {
        return res.redirect(`https://${req.get("Host")}${req.url}`);
    }
    next();
});

// Config body parser
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

// Định tuyến
route(app);

//
const setupCronJobs = require("./config/cron");
setupCronJobs();

// const initMainAccount = require("./services/accountService").initMainAccount;
// // Khởi tạo tài khoản chính
// initMainAccount();

if (process.env.NODE_ENV === "production") {
    app.listen(process.env.PORT, () => {
        console.log(`Server (production) is running on port ${process.env.PORT}`);
    });
} else {
    // Cấu hình HTTPS
    const options = {
        key: fs.readFileSync("./sslkeys/key.pem"),
        cert: fs.readFileSync("./sslkeys/cert.pem"),
    };
    const httpsServer = https.createServer(options, app);

    httpsServer.listen(HTTPS_PORT, () => {
        console.log(`HTTPS Server is running on port ${HTTPS_PORT}`);
    });

    // Tạo server HTTP để chuyển hướng sang HTTPS
    http.createServer((req, res) => {
        res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
        res.end();
    }).listen(HTTP_PORT, () => {
        console.log(`HTTP Server is redirecting to HTTPS on port ${HTTP_PORT}`);
    });
}
