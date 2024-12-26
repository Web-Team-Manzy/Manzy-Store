const User = require("../models/userM");

class UserController {
    // [GET] /users
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

    // [GET] /users/:id
    async show(req, res, next) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    EC: 1,
                    EM: "Invalid id",
                    DT: [],
                });
            }

            const user = await User.findById(id).select("-password");

            if (!user) {
                return res.status(400).json({
                    EC: 1,
                    EM: "No user found",
                    DT: [],
                });
            }

            return res.status(200).json({
                EC: 0,
                EM: "Success",
                DT: user,
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

    // [PUT] /users/:id
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, email, phone, address } = req.body;

            if (!id) {
                return res.status(400).json({
                    EC: 1,
                    EM: "Invalid id",
                    DT: [],
                });
            }

            if (!name || !email || !phone || !address) {
                return res.status(400).json({
                    EC: 1,
                    EM: "Missing required fields",
                    DT: [],
                });
            }

            const user = await User.findByIdAndUpdate(
                id,
                { name, email, phone, address },
                { new: true }
            ).select("-password");

            if (!user) {
                return res.status(400).json({
                    EC: 1,
                    EM: "No user found",
                    DT: [],
                });
            }

            return res.status(200).json({
                EC: 0,
                EM: "Success",
                DT: user,
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

    // [DELETE] /users/:id
    async destroy(req, res, next) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    EC: 1,
                    EM: "Invalid id",
                    DT: [],
                });
            }

            const user = await User.findByIdAndDelete(id).select("-password");

            if (!user) {
                return res.status(400).json({
                    EC: 1,
                    EM: "No user found",
                    DT: [],
                });
            }

            return res.status(200).json({
                EC: 0,
                EM: "Success",
                DT: user,
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
