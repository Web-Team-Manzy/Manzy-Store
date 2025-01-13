require("dotenv").config();

const { SERVICES } = require("../config/constants");
const { makeServiceRequest } = require("../util/paymentAuth");
const userModels = require("../app/models/userM");

const processCreateAccount = async (userId, options) => {
    try {
        const serviceId = SERVICES.MAIN_SYSTEM;
        const baseUrl =
            process.env.NODE_ENV === "production"
                ? process.env.PAYMENT_SERVICE_PRODUCTION_URL
                : process.env.PAYMENT_SERVICE_URL;
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
        const baseUrl =
            process.env.NODE_ENV === "production"
                ? process.env.PAYMENT_SERVICE_PRODUCTION_URL
                : process.env.PAYMENT_SERVICE_URL;
        const endpoint = `/payment/get-balance`;

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
        const baseUrl =
            process.env.NODE_ENV === "production"
                ? process.env.PAYMENT_SERVICE_PRODUCTION_URL
                : process.env.PAYMENT_SERVICE_URL;
        const endpoint = "/payment/transaction/create-transaction";

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

const processGetTransactions = async (page = 1, limit = 10) => {
    try {
        const serviceId = SERVICES.MAIN_SYSTEM;
        const baseUrl =
            process.env.NODE_ENV === "production"
                ? process.env.PAYMENT_SERVICE_PRODUCTION_URL
                : process.env.PAYMENT_SERVICE_URL;
        const endpoint = `/payment/transaction?page=${page}&limit=${limit}`;

        const res = await makeServiceRequest(baseUrl, serviceId, "GET", endpoint);

        if (res.EC === 0 && res.DT.transactions) {
            const userIds = res.DT.transactions
                .map((transaction) => transaction?.fromAccountId?.userId)
                .filter(Boolean);

            const users = await userModels.find({ _id: { $in: userIds } }).lean();
            const userMap = users.reduce((map, user) => {
                map[user._id] = user.displayName;
                return map;
            }, {});

            res.DT.transactions = res.DT.transactions.map((transaction) => {
                const userId = transaction?.fromAccountId?.userId ?? null;
                if (userId) {
                    transaction.fromAccountId.userName = userMap[userId] ?? "Unknown";
                }
                return transaction;
            });
        }

        console.log(">>> processGetTransactions:", res.DT.transactions);

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

const processGetMainAccount = async () => {
    try {
        const serviceId = SERVICES.MAIN_SYSTEM;
        const baseUrl =
            process.env.NODE_ENV === "production"
                ? process.env.PAYMENT_SERVICE_PRODUCTION_URL
                : process.env.PAYMENT_SERVICE_URL;
        const endpoint = "/payment/get-main-account";

        const res = await makeServiceRequest(baseUrl, serviceId, "GET", endpoint);

        return res;
    } catch (error) {
        console.log(">>> processGetMainAccount:", error);
        return {
            EC: 1,
            EM: error.message,
            DT: {},
        };
    }
};

const processGetReconciliation = async (startDate, endDate) => {
    try {
        const serviceId = SERVICES.MAIN_SYSTEM;
        const baseUrl =
            process.env.NODE_ENV === "production"
                ? process.env.PAYMENT_SERVICE_PRODUCTION_URL
                : process.env.PAYMENT_SERVICE_URL;
        const endpoint = `/payment/reconciliation?startDate=${startDate}&endDate=${endDate}`;

        const res = await makeServiceRequest(baseUrl, serviceId, "GET", endpoint);

        console.log(">>> processGetReconciliation:", res);

        return res;
    } catch (error) {
        console.log(">>> processGetReconciliation:", error);
        return {
            EC: 1,
            EM: error.message,
            DT: {},
        };
    }
};

const processGetReconciliationDiscrepancy = async (date) => {
    try {
        const serviceId = SERVICES.MAIN_SYSTEM;
        const baseUrl =
            process.env.NODE_ENV === "production"
                ? process.env.PAYMENT_SERVICE_PRODUCTION_URL
                : process.env.PAYMENT_SERVICE_URL;
        const endpoint = `/payment/reconciliation/discrepancy?date=${date}`;

        const res = await makeServiceRequest(baseUrl, serviceId, "GET", endpoint);

        console.log(">>> processGetReconciliationDiscrepancy:", res);

        return res;
    } catch (error) {
        console.log(">>> processGetReconciliationDiscrepancy:", error);
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
    processGetTransactions,
    processGetMainAccount,
    processGetReconciliation,
    processGetReconciliationDiscrepancy,
};
