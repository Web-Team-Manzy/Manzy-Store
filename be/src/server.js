require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8081;

const route = require("./routes");
const db = require("./config/db");

// Connect to DB
db.connect();

// Config cookie
app.use(cookieParser());

// Config CORS
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
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

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
