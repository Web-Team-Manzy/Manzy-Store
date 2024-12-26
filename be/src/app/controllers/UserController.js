const User = require("../models/userM");

class UserController {
    async index(req, res, next) {
        try {
            const users = await User.find().select("-password");

            if (!users) {
                return res.status(400).json({
                    EC: 1,
                    EM: "No user found",
                    DT: [],
                });
            }

            return res.status(200).json({
                EC: 0,
                EM: "Success",
                DT: users,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: 1,
                EM: "Internal server error",
                DT: [],
            });
        }
    }
}

module.exports = new UserController();
