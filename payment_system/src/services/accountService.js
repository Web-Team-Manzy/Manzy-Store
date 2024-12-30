const Account = require("../app/models/account.model");

const initMainAccount = async () => {
    try {
        const existedMainAccount = await Account.findOne({ type: "MAIN" });

        if (existedMainAccount) {
            return {
                EC: 1,
                EM: "Main account existed",
            };
        }

        const newMainAccount = new Account({
            type: "MAIN",
            balance: 0,
            metadata: {
                createdBy: "SYSTEM",
                notes: "Main account",
            },
        });

        await newMainAccount.save();

        return {
            EC: 0,
            EM: "Init main account successfully",
            DT: newMainAccount,
        };
    } catch (error) {
        console.log(">>> accountService.initMainAccount", error);
        return {
            EC: 1,
            EM: "Internal Server Error",
        };
    }
};

const createAccount = async (userId, options = { balance: 0, metadata: {} }) => {
    try {
        const existedAccount = await Account.findOne({ userId });

        if (existedAccount) {
            return {
                EC: 1,
                EM: "Account existed",
            };
        }

        const newAccount = new Account({
            userId,
            balance: options.balance || 0,
            type: "USER",
            metadata: {
                createdBy: "SYSTEM",
                ...options.metadata,
            },
        });

        await newAccount.save();

        return {
            EC: 0,
            EM: "Create account successfully",
            DT: newAccount,
        };
    } catch (error) {
        console.log(">>> accountService.createAccount", error);
        return {
            EC: 1,
            EM: "Internal Server Error",
        };
    }
};

const getAccountByUserId = async (userId) => {
    try {
        const account = await Account.findOne({ userId });

        if (!account) {
            return {
                EC: 1,
                EM: "Account not found",
            };
        }

        return {
            EC: 0,
            EM: "Get account successfully",
            DT: account,
        };
    } catch (error) {
        console.log(">>> accountService.getAccountByUserId", error);
        return {
            EC: 1,
            EM: "Internal Server Error",
        };
    }
};

const getAccountById = async (accountId) => {
    try {
        const account = await Account.findById(accountId);

        if (!account) {
            return {
                EC: 1,
                EM: "Account not found",
            };
        }

        return {
            EC: 0,
            EM: "Get account successfully",
            DT: account,
        };
    } catch (error) {
        console.log(">>> accountService.getAccountById", error);
        return {
            EC: 1,
            EM: "Internal Server Error",
        };
    }
};

const getMainAccount = async () => {
    try {
        const mainAccount = await Account.findOne({ type: "MAIN" });

        if (!mainAccount) {
            return {
                EC: 1,
                EM: "Main account not found",
            };
        }

        return {
            EC: 0,
            EM: "Get main account successfully",
            DT: mainAccount,
        };
    } catch (error) {
        console.log(">>> accountService.getMainAccount", error);
        return {
            EC: 1,
            EM: "Internal Server Error",
        };
    }
};

module.exports = {
    initMainAccount,
    createAccount,
    getAccountByUserId,
    getAccountById,
    getMainAccount,
};
