require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
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
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true,
    })
);

// app.use(
//     session({
//         secret: process.env.JWT_ACCESS_TOKEN_SECRET,
//         resave: false,
//         saveUninitialized: true,
//         cookie: { secure: true }, // Bật chế độ bảo mật cho cookie
//     })
// );

app.use(
    session({
        secret: process.env.JWT_ACCESS_TOKEN_SECRET, // Thay bằng secret an toàn của bạn
        resave: true, // Ngăn lưu lại session nếu không thay đổi
        saveUninitialized: true, // Ngăn tạo session mới nếu không có dữ liệu
        store: MongoStore.create({
            mongoUrl:
                process.env.MONGO_URI ||
                "mongodb+srv://hoanglenam0905:22120217@cluster0.5queg.mongodb.net/ManzyStoreDB?retryWrites=true&w=majority&appName=Cluster0", // Kết nối MongoDB
            collectionName: "sessions", // Tên collection lưu trữ session
            ttl: 14 * 24 * 60 * 60, // Thời gian hết hạn session (14 ngày)
            autoRemove: "native", // Sử dụng cơ chế xóa tự động của MongoDB
        }),
        cookie: {
            httpOnly: true, // Ngăn JavaScript truy cập cookie
            secure: process.env.NODE_ENV === "production", // Chỉ gửi cookie qua HTTPS trong môi trường production
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie hết hạn sau 7 ngày
            sameSite: "none", // Chỉ cho phép gửi cookie trong cùng domain
        },
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
        console.log(`App listening on port (production):${process.env.PORT}`);
    });
} else {
    // Tạo HTTPS server
    https.createServer(options, app).listen(port, () => {
        console.log(`App listening securely on port https://localhost:${port}`);
    });
}
