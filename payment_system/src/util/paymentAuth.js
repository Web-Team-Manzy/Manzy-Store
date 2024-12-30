require("dotenv").config();

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { SERVICES } = require("../config/constants");

const generateServiceToken = (serviceId) => {
    return jwt.sign(
        {
            serviceId,
            timestamp: Date.now(),
        },
        process.env.JWT_PAYMENT_SECRET,
        {
            expiresIn: process.env.JWT_PAYMENT_EXPIRE,
        }
    );
};

const generateSignature = (payload, timestamp) => {
    const dataToSign = `${JSON.stringify(payload)}|${timestamp}|${process.env.SERVICE_API_KEY}`;

    return crypto
        .createHmac("sha256", process.env.SERVICE_API_SECRET)
        .update(dataToSign)
        .digest("hex");
};

module.exports = {
    generateServiceToken,
    generateSignature,
};
