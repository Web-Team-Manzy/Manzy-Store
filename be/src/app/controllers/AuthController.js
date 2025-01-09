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
    async sendEmailConfirmationPin(req, res) {
        try {
            const { email } = req.body;

            if (!email)
                return res.status(400).json({
                    EC: 1,
                    EM: "Missing required fields",
                    DT: {},
                });

            // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chính thức hay chưa
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    EC: 1,
                    EM: "Email already exists",
                    DT: {},
                });
            }

            // Generate a random PIN for email confirmation
            const transactionPin = Math.floor(100000 + Math.random() * 900000).toString();

            // Hash the PIN
            const hashedPin = await bcrypt.hash(transactionPin, 10);

            // Ensure only one PIN record per email and purpose
            await pinM.deleteMany({ email, purpose: "email_confirmation" });

            // Save the hashed PIN and expiration time to the pin collection
            const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
            const pinData = {
                email,
                pin: hashedPin,
                purpose: "email_confirmation",
                expirationTime,
            };
            const newPin = new pinM(pinData);
            await newPin.save();

            // Send email confirmation PIN
            await sendTransactionPinEmail(email, transactionPin, "email_confirmation");

            return res.status(200).json({
                EC: 0,
                EM: "Please check your email for the confirmation PIN.",
                DT: { email },
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

    // [POST] /register
    async register(req, res) {
        try {
            const { email, transactionPin, password, ...otherData } = req.body;

            // Find the pin by email and purpose
            const pinData = await pinM.findOne({ email, purpose: "email_confirmation" });
            if (!pinData || new Date() > pinData.expirationTime) {
                return res.status(400).json({ EC: 1, EM: "Invalid or expired transaction PIN" });
            }

            // Compare the provided PIN with the hashed PIN
            const isMatch = await bcrypt.compare(transactionPin, pinData.pin);
            if (!isMatch) {
                return res.status(400).json({ EC: 1, EM: "Invalid transaction PIN" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Lưu thông tin người dùng vào cơ sở dữ liệu chính thức
            const newUser = new User({
                email,
                password: hashedPassword,
                ...otherData
            });
            await newUser.save();

            // Xóa mã PIN sau khi xác nhận
            await pinM.findByIdAndDelete(pinData._id);

            return res.status(200).json({ EC: 0, EM: "Email confirmed and user registered successfully" });
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

            const paymentAccount = await processCreateAccount(result?.DT?.user?.id, {
                balance: 500000,
            });

            console.log(">>> paymentAccount:", paymentAccount);

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

            const paymentAccount = await processCreateAccount(user?.id, {
                balance: 500000,
            });

            console.log(">>> paymentAccount:", paymentAccount);

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
