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

const generateSignature = (timestamp, payload = "genSignature") => {
    const dataToSign = `${JSON.stringify(payload)}|${timestamp}|${process.env.SERVICE_API_KEY}`;

    // console.log(">>> generateSignature:", dataToSign);

    return crypto
        .createHmac("sha256", process.env.SERVICE_API_KEY)
        .update(dataToSign)
        .digest("hex");
};

const makeServiceRequest = async (baseUrl, serviceId, method, endpoint, data = null) => {
    try {
        console.log(">>> makeServiceRequest:", baseUrl, serviceId, method, endpoint, data);

        const timestamp = Date.now().toString();
        const signature = generateSignature(timestamp, data);
        const token = generateServiceToken(serviceId);

        const response = await fetch(`${baseUrl}${endpoint}`, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "X-Timestamp": timestamp,
                "X-Signature": signature,
                "X-Service-ID": serviceId,
            },
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            const error = await response.json();

            throw new Error(`Service request failed: ${error.EM}`);
        }

        return response.json();
    } catch (error) {
        console.log(">>> makeServiceRequest");
        throw error;
    }
};

module.exports = {
    generateServiceToken,
    generateSignature,
    makeServiceRequest,
};
