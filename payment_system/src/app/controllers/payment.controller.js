const Account = require("../models/account.model");

class PaymentController {
    // [POST] /payment/create-account
    async createAccount(req, res, next) {
        try {
            const { userId } = req.body;

            const existedAccount = await Account.findOne({ userId });

            if (existedAccount) {
                return res.status(400).json({
                    EC: 1,
                    EM: "Account existed",
                });
            }

            const newAccount = new Account({
                userId,
                balance: 0,
                isMainAccount: true,
            });

            await newAccount.save();

            return res.status(200).json({
                EC: 0,
                EM: "Create account successfully",
            });
        } catch (error) {
            console.log(">>> PaymentController.createAccount", error);
            return res.status(500).json({
                EC: 1,
                EM: "Internal Server Error",
            });
        }
    }
}

module.exports = new PaymentController();
