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

const processGetAccountBalance = async (userId) => {
    try {
        const serviceId = SERVICES.MAIN_SYSTEM;
        const baseUrl = process.env.PAYMENT_SERVICE_URL;
        const endpoint = `/payment/get-account-balance`;

        const res = await makeServiceRequest(baseUrl, serviceId, "POST", endpoint, {
            userId,
        });

        console.log(">>> processGetAccountBalance:", res);

        return res;
    } catch (error) {
        console.log(">>> processGetAccountBalance:", error);
        return {
            EC: 1,
            EM: error.message,
            DT: {},
        };
    }
};

const processPayment = async (userId, amount, orderId) => {
    try {
        const serviceId = SERVICES.MAIN_SYSTEM;
        const baseUrl = process.env.PAYMENT_SERVICE_URL;
        const endpoint = "/payment/create-transaction";

        const res = await makeServiceRequest(baseUrl, serviceId, "POST", endpoint, {
            userId,
            amount,
            orderId,
        });

        return res;
    } catch (error) {
        console.log(">>> processPayment:", error);
        return {
            EC: 1,
            EM: error.message,
            DT: {},
        };
    }
};

module.exports = {
    processCreateAccount,
    processPayment,
    processGetAccountBalance,
};
