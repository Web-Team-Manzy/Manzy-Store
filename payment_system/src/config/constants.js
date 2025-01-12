require("dotenv").config();

const SERVICES = {
    MAIN_SYSTEM: {
        BASE_URL: process.env.MAIN_SERVICE_URL,
        SERVICE_ID: "MAIN_SYSTEM",
    },
    PAYMENT_SYSTEM: "PAYMENT_SYSTEM",
};

module.exports = {
    SERVICES,
};
