require("dotenv").config();
const jwt = require("jsonwebtoken");

const authHelper = require("../util/authHelper");
const { refreshTokenService } = require("../services/userService");

const auth = async (req, res, next) => {
    const white_lists = ["/", "/register", "/login", "/refresh-token"];

    if (white_lists.find((url) => url === req.originalUrl)) {
        return next();
    } else {
        let cookies = req.cookies;
        let tokenFromHeader = authHelper.extractToken(req);

        if ((cookies && cookies.accessToken) || tokenFromHeader) {
            let accessToken =
                cookies && cookies.accessToken ? cookies.accessToken : tokenFromHeader;
            // console.log(">>> token", token);

            // verify token
            try {
                const decoded = authHelper.verifyToken(accessToken);

                if (!decoded) {
                    return res.status(401).json({
                        EC: 1,
                        EM: "Unauthorized",
                        DT: {},
                    });
                }

                if (decoded && decoded === "TokenExpiredError") {
                    // refresh token
                    const refreshToken = req?.cookies?.refreshToken || "";
                    if (!refreshToken) {
                        return res.status(401).json({
                            EC: 1,
                            EM: "Unauthorized",
                            DT: {},
                        });
                    }

                    const result = await refreshTokenService(refreshToken);

                    if (result.EC === 1) {
                        return res.status(401).json({
                            EC: 1,
                            EM: "Unauthorized",
                            DT: {},
                        });
                    }

                    res.cookie("refreshToken", result.DT.refresh_token, {
                        httpOnly: true,
                        secure: false, // set true if your using https
                        sameSite: "strict",
                        maxAge: +process.env.COOKIE_REFRESH_TOKEN_MAX_AGE, // 1 day
                    });

                    res.cookie("accessToken", result.DT.access_token, {
                        httpOnly: true,
                        secure: false, // set true if your using https
                        sameSite: "strict",
                        maxAge: +process.env.COOKIE_ACCESS_TOKEN_MAX_AGE, // 15 minutes
                    });

                    // req.user = {
                    //     email: result.DT.user.email,
                    //     firstName: result.DT.user.firstName,
                    //     lastName: result.DT.user.lastName,
                    //     role: result.DT.user.role,
                    // };

                    // req.accessToken = result.DT.accessToken;
                    // req.refreshToken = result.DT.refreshToken;

                    // return next();

                    return res.status(419).json({
                        EC: 1,
                        EM: "Need to refresh token",
                        DT: {},
                    });
                }

                req.user = {
                    email: decoded.email,
                    firstName: decoded.firstName,
                    lastName: decoded.lastName,
                    role: decoded.role,
                };

                req.accessToken = accessToken;
                req.refreshToken = req?.cookies?.refreshToken || "";
                // console.log(">>> decoded", decoded);

                return next();
            } catch (error) {
                return res.status(401).json({
                    EC: 1,
                    EM: "Unauthorized",
                    DT: {},
                });
            }
        } else {
            // return exception
            const refreshToken = req?.cookies?.refreshToken || "";
            if (!refreshToken) {
                return res.status(401).json({
                    EC: 1,
                    EM: "Unauthorized",
                    DT: {},
                });
            }

            const result = await refreshTokenService(refreshToken);

            if (result.EC === 1) {
                res.clearCookie("refreshToken");
                return res.status(401).json({
                    EC: 1,
                    EM: "Unauthorized",
                    DT: {},
                });
            }

            res.cookie("refreshToken", result.DT.refresh_token, {
                httpOnly: true,
                secure: false, // set true if your using https
                sameSite: "strict",
                maxAge: +process.env.COOKIE_REFRESH_TOKEN_MAX_AGE, // 1 day
            });

            res.cookie("accessToken", result.DT.access_token, {
                httpOnly: true,
                secure: false, // set true if your using https
                sameSite: "strict",
                maxAge: +process.env.COOKIE_ACCESS_TOKEN_MAX_AGE, // 15 minutes
            });

            // req.user = {
            //     email: result.DT.user.email,
            //     firstName: result.DT.user.firstName,
            //     lastName: result.DT.user.lastName,
            //     role: result.DT.user.role,
            // };

            // req.accessToken = result.DT.accessToken;
            // req.refreshToken = result.DT.refreshToken;

            // return next();

            return res.status(419).json({
                EC: 1,
                EM: "Need to refresh token",
                DT: {},
            });
        }
    }

    // console.log(">>> req.originalUrl", req.originalUrl);
};

module.exports = auth;
