require("dotenv").config();

const { SERVICES } = require("../config/constants");
const { makeServiceRequest } = require("../util/paymentAuth");

const processCreateAccount = async (userId, options) => {
    try {
        const serviceId = SERVICES.MAIN_SYSTEM;
        const baseUrl = process.env.PAYMENT_SERVICE_URL;
        const endpoint = "/payment/create-account";

        const res = await makeServiceRequest(baseUrl, serviceId, "POST", endpoint, {
            userId,
            options,
        });

        return res;
    } catch (error) {
        console.log(">>> processCreateAccount:", error);
        return {
            EC: 1,
            EM: error.message,
            DT: {},
        };
    }
};

module.exports = {
    processCreateAccount,
};
