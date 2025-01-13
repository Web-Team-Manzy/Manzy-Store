require("dotenv").config();

const SERVICES = {
    MAIN_SYSTEM: {
        BASE_URL:
            process.env.NODE_ENV === "production"
                ? process.env.MAIN_SERVICE_PRODUCTION_URL
                : process.env.MAIN_SERVICE_URL,
        SERVICE_ID: "MAIN_SYSTEM",
    },
    PAYMENT_SYSTEM: "PAYMENT_SYSTEM",
};

module.exports = {
    SERVICES,
};
