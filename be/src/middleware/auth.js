require("dotenv").config();
const jwt = require("jsonwebtoken");

const authHelper = require("../util/authHelper");

const auth = (req, res, next) => {
    const white_lists = ["/", "/register", "/login", "/refresh-token"];

    if (white_lists.find((url) => url === req.originalUrl)) {
        return next();
    } else {
        let cookies = req.cookies;
        let tokenFromHeader = authHelper.extractToken(req);

        if ((cookies && cookies.accessToken) || tokenFromHeader) {
            let token = cookies && cookies.accessToken ? cookies.accessToken : tokenFromHeader;
            // console.log(">>> token", token);

            // verify token
            try {
                const decoded = authHelper.verifyToken(token);

                if (!decoded) {
                    return res.status(401).json({
                        EC: 1,
                        EM: "Unauthorized",
                        DT: {},
                    });
                }

                req.user = {
                    email: decoded.email,
                    firstName: decoded.firstName,
                    lastName: decoded.lastName,
                    role: decoded.role,
                };

                req.accessToken = token;
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
            return res.status(401).json({
                EC: 1,
                EM: "Unauthorized",
                DT: {},
            });
        }
    }

    // console.log(">>> req.originalUrl", req.originalUrl);
};

module.exports = auth;
