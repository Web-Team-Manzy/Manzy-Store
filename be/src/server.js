require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const https = require("https");

const app = express();
const port = process.env.APP_PORT || 8081;

const route = require("./routes");
const db = require("./config/db");

// Kết nối cơ sở dữ liệu
db.connect();

// Đường dẫn tới chứng chỉ SSL
const options = {
    key: fs.readFileSync("./sslkeys/key.pem"),
    cert: fs.readFileSync("./sslkeys/cert.pem"),
};

// Cấu hình cookie
app.use(cookieParser());

// Cấu hình CORS
app.use(
    cors({
        origin: [process.env.FRONTEND_URL, process.env.ADMIN_PANEL_URL, "http://localhost:5174"],
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }, // Bật chế độ bảo mật cho cookie
    })
);

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

// Khởi tạo các route
route(app);

if (process.env.NODE_ENV === "production") {
    app.listen(process.env.PORT, () => {
        console.log(`App listening on port http://localhost:${port}`);
    });
} else {
    // Tạo HTTPS server
    https.createServer(options, app).listen(port, () => {
        console.log(`App listening securely on port https://localhost:${port}`);
    });
}
