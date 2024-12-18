const { createUserService, loginService } = require("../../services/userService");

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

            const result = await loginService(email, password);

            if (result.EC === 1) {
                return res.status(400).json(result);
            }

            const { user, accessToken, refreshToken } = result.DT;

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false, // set true if your using https
                sameSite: "strict",
                maxAge: +process.env.COOKIE_REFRESH_TOKEN_MAX_AGE, // 1 day
            });

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false, // set true if your using https
                sameSite: "strict",
                maxAge: +process.env.COOKIE_ACCESS_TOKEN_MAX_AGE, // 15 minutes
            });

            return res.status(200).json({
                EC: 0,
                EM: "Login successfully",
                DT: {
                    user,
                    accessToken,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: 1,
                EM: error.message,
                DT: {},
            });
        }
    }
}

module.exports = new AuthController();
