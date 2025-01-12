require("dotenv").config();

const jwt = require("jsonwebtoken");
const { generateSignature } = require("../util/paymentAuth");

const serviceAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                EC: 1,
                EM: "Service token required",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_PAYMENT_SECRET);

        const allowedServices = process.env.ALLOWED_SERVICES.split(",");
        if (!allowedServices.includes(decoded.serviceId)) {
            return res.status(403).json({
                EC: 1,
                EM: "Service not authorized",
            });
        }

        const requestTimestamp = req.headers["x-timestamp"];
        if (!requestTimestamp || Math.abs(Date.now() - parseInt(requestTimestamp)) > 300000) {
            return res.status(401).json({
                EC: 1,
                EM: "Invalid timestamp",
            });
        }

        const signature = req.headers["x-signature"];

        let payload = req.body;

        if (JSON.stringify(payload) === "{}") {
            payload = null;
        }

        const calculatedSignature = generateSignature(payload, requestTimestamp);

        if (signature !== calculatedSignature) {
            return res.status(401).json({
                EC: 1,
                EM: "Invalid signature",
            });
        }

        req.service = {
            id: decoded.serviceId,
            timestamp: decoded.timestamp,
        };

        return next();
    } catch (error) {
        console.log(">>> serviceAuth:", error);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                EC: 1,
                EM: "Invalid token",
            });
        }

        return res.status(500).json({
            EC: 1,
            EM: "Authentication error",
        });
    }
};

module.exports = serviceAuth;
