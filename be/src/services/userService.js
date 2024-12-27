const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../app/models/userM");
const RefreshToken = require("../app/models/RefreshToken");
const {
    issueAccessToken,
    createRefreshToken,
    verifyRefreshTokenExpiration,
    getGoogleUserData,
} = require("../util/authHelper");

const saltRounds = 10;
const createUserService = async (userData) => {
    try {
        const { email, password, firstName, lastName } = userData;

        if (!email || !password || !firstName || !lastName) {
            return {
                EC: 1,
                EM: "Missing required fields",
                DT: {},
            };
        }

        // Check if email is already in use
        const user = await User.findOne({ email });

        if (user) {
            return {
                EC: 1,
                EM: "Email is already in use",
                DT: {},
            };
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // create new user
        const result = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        if (!result) {
            return {
                EC: 1,
                EM: "Create user failed",
                DT: {},
            };
        }

        return {
            EC: 0,
            EM: "Register successfully",
            DT: { email, firstName, lastName },
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: error.message,
            DT: {},
        };
    }
};

const createGoogleUserService = async (userData) => {
    try {
        const { email, firstName, lastName } = userData;

        if (!email || !firstName || !lastName) {
            return {
                EC: 1,
                EM: "Missing required fields",
                DT: {},
            };
        }

        // check if email exists
        const user = await User.findOne({
            email,
        });

        if (user) {
            return {
                EC: 1,
                EM: "Email is already in use",
                DT: {},
            };
        }

        // save to db
        let result = await User.create({
            email,
            firstName,
            password: userData.googleId,
            lastName,
            source: "google",
            googleId: userData.googleId,
        });

        if (!result) {
            return {
                EC: 1,
                EM: "Create user failed",
                DT: {},
            };
        }

        return {
            EC: 0,
            EM: "Register successfully",
            DT: { email, firstName, lastName },
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: error.message,
            DT: {},
        };
    }
};

const loginService = async (email, password) => {
    try {
        if (!email || !password) {
            return {
                EC: 1,
                EM: "Missing required fields",
                DT: {},
            };
        }

        // find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return {
                EC: 1,
                EM: "Email/Password is incorrect",
                DT: {},
            };
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return {
                EC: 1,
                EM: "Email/Password is incorrect",
                DT: {},
            };
        }

        // generate token
        const payload = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };

        const accessToken = issueAccessToken(payload);

        await RefreshToken.deleteMany({ user: user._id });

        const refreshToken = await createRefreshToken(user._id);

        if (!refreshToken) {
            return {
                EC: 1,
                EM: "Create refresh token failed",
                DT: {},
            };
        }

        return {
            EC: 0,
            EM: "Login successfully",
            DT: {
                accessToken,
                refreshToken,
                user: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: error.message,
            DT: {},
        };
    }
};

const loginGoogleService = async (code) => {
    try {
        // get user data from google
        const userData = await getGoogleUserData(code);

        if (!userData) {
            return {
                EC: 1,
                EM: "Unauthorized",
            };
        }

        const { email } = userData;

        let user = await User.findOne({
            email,
        });

        if (!user) {
            let result = await createGoogleUserService({
                email,
                firstName: userData?.given_name || userData?.family_name || "Google User",
                lastName: userData?.family_name || userData?.given_name || "Google User",
                googleId: userData?.id || "",
                source: "google",
            });

            if (result.EC === 1) {
                return {
                    EC: 1,
                    EM: "Internal server error",
                };
            }

            user = await User.findOne({
                email,
            });

            if (!user) {
                return {
                    EC: 1,
                    EM: "Internal server error",
                };
            }
        }

        // create an access token
        const payload = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };

        const accessToken = issueAccessToken(payload);

        // create a refresh token
        await RefreshToken.deleteMany({ user: user._id });

        const refreshToken = await createRefreshToken(user._id);

        return {
            EC: 0,
            EM: "Login successfully",
            DT: {
                accessToken,
                refreshToken,
                user: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: "Internal server error",
        };
    }
};

const refreshTokenService = async (refreshToken) => {
    try {
        // fetch refresh token
        const token = await RefreshToken.findOne({
            token: refreshToken,
        }).populate("user");

        if (!token) {
            return {
                EC: 1,
                EM: "Unauthorized",
            };
        }

        // verify expiration
        const isExpired = await verifyRefreshTokenExpiration(token);

        if (isExpired) {
            // delete token
            await RefreshToken.findByIdAndDelete(token._id).exec();
            return {
                EC: 1,
                EM: "Unauthorized",
            };
        }

        const payload = {
            email: token.user.email,
            firstName: token.user.firstName,
            lastName: token.user.lastName,
            role: token.user.role,
        };

        await RefreshToken.findByIdAndDelete(token._id).exec();

        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
        });

        const newRefreshToken = await createRefreshToken(token.user._id);

        return {
            EC: 0,
            EM: "Refresh token successfully",
            DT: {
                refresh_token: newRefreshToken,
                access_token: accessToken,
                user: {
                    email: token.user.email,
                    firstName: token.user.firstName,
                    lastName: token.user.lastName,
                    role: token.user.role,
                },
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: "Internal server error",
        };
    }
};

module.exports = {
    createUserService,
    loginService,
    refreshTokenService,
    loginGoogleService,
};
