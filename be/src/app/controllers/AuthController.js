const { createUserService } = require("../../services/userService");

require("dotenv").config();

class AuthController {
    // [POST] /login
    async register(req, res) {
        try {
            const userData = req.body;

            if (!userData)
                return res.status(400).json({
                    EC: 1,
                    EM: "Missing required fields",
                    DT: {},
                });

            const result = await createUserService(userData);

            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: 1,
                EM: error.message,
                DT: {},
            });
        }
    }

    // [POST] /login
    async handleLogin(req, res) {
        try {
            const { email, password } = req.body;
        } catch (error) {}
    }
}

module.exports = new AuthController();
