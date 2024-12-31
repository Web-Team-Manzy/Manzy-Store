const { createAccount } = require("../../services/accountService");
const Account = require("../models/account.model");

class AccountController {
    // [POST] /payment/create-account
    async createAccount(req, res, next) {
        try {
            const { userId, options } = req.body;

            console.log(">>> AccountController.createAccount", userId, options);

            if (!userId) {
                return res.status(400).json({
                    EC: 1,
                    EM: "Missing userId",
                });
            }

            const newAccount = await createAccount(userId, options);

            if (newAccount.EC === 1) {
                return res.status(400).json(newAccount);
            }

            return res.status(200).json(newAccount);
        } catch (error) {
            console.log(">>> AccountController.createAccount", error);
            return res.status(500).json({
                EC: 1,
                EM: "Internal Server Error",
            });
        }
    }
}

module.exports = new AccountController();
