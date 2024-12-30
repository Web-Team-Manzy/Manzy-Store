require("dotenv").config();

const { processCreateAccount } = require("../../services/paymentService");
const {
    createUserService,
    loginService,
    loginGoogleService,
} = require("../../services/userService");
const { deleteRefreshTokenOfUser } = require("../../util/authHelper");
const User = require("../models/userM");

class AuthController {
    // [GET] /account
    async getUserAccount(req, res) {
        return res.status(200).json({
            EC: 0,
            EM: "Get user account successfully",
            DT: {
                user: req.user,
                accessToken: req.accessToken,
                refreshToken: req.refreshToken,
            },
        });
    }

    // [POST] /register
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

            const paymentAccount = await processCreateAccount(result.DT.id, {
                balance: 500000,
            });

            console.log(">>> paymentAccount:", paymentAccount);

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
                    refreshToken,
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

    // [POST] /login/google
    async handleLoginGoogle(req, res) {
        try {
            const { code } = req?.body;

            if (!code) {
                return res.status(401).json({
                    EC: 2,
                    EM: "Unauthorized",
                });
            }

            const data = await loginGoogleService(code);

            const { user, accessToken, refreshToken } = data.DT;

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
                    refreshToken,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: 3,
                EM: "Internal server error",
            });
        }
    }

    // [POST] /logout
    async handleLogout(req, res) {
        try {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            // delete refresh token in database
            const email = req.user.email;
            const user = await User.findOne({
                email,
            });

            if (user) {
                await deleteRefreshTokenOfUser(user._id);
            }

            return res.status(200).json({
                EC: 0,
                EM: "Logout successfully",
                DT: {},
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
