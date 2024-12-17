const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../app/models/userM");
const { issueAccessToken, createRefreshToken } = require("../util/authHelper");

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

module.exports = {
    createUserService,
    loginService,
};
