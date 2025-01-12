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
        const { email, password, name, phone } = userData;

        if (!email || !password || !name.displayName) {
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
            firstName: name.firstName,
            lastName: name.lastName,
            displayName: name.displayName,
            phone,
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
            DT: {
                id: result._id,
                email,
                phone,
                firstName: name.firstName,
                lastName: name.lastName,
                displayName: name.displayName,
                address: result.address,
                role: result.role,
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

const createGoogleUserService = async (userData) => {
    try {
        const { email, firstName, lastName, displayName } = userData;

        if (!email || !displayName) {
            return {
                EC: 1,
                EM: "Missing required fields",
                DT: {},
            };
        }

        // check if email exists
        const user = await User.findOne({
            email,
            googleId: userData.googleId,
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
            password: userData.googleId,
            firstName,
            lastName,
            displayName,
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
            DT: { email, phone, firstName, lastName, displayName },
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

const createFacebookUserService = async (userData) => {
    try {
        const { id, email, name } = userData;

        if (!id || !email || !name) {
            return {
                EC: 1,
                EM: "Missing required fields",
                DT: {},
            };
        }

        // check if email exists
        const user = await User.findOne({
            email,
            facebookId: id,
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
            password: id,
            firstName: name,
            displayName: name,
            source: "facebook",
            facebookId: id,
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
            DT: { email, phone, firstName, lastName, displayName },
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
            id: user._id,
            email: user.email,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            address: user.address,
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
                    id: user._id,
                    email: user.email,
                    phone: user.phone,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    displayName: user.displayName,
                    address: user.address,
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
                displayName:
                    userData?.name ||
                    userData?.displayName ||
                    userData?.display_name ||
                    userData?.given_name ||
                    userData?.family_name ||
                    "Google User",
                googleId: userData?.id || "",
                source: "google",
            });

            if (result.EC === 1) {
                return {
                    EC: 1,
                    EM: result.EM || "Internal server error",
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
            id: user._id,
            email: user.email,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            address: user.address,
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
                    id: user._id,
                    email: user.email,
                    phone: user.phone,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    displayName: user.displayName,
                    address: user.address,
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

const loginFacebookService = async (userData) => {
    try {
        const { id, email, name } = userData;

        if (!id || !email || !name) {
            return {
                EC: 1,
                EM: "Unauthorized",
            };
        }

        let user = await User.findOne({
            email,
        });

        if (!user) {
            let result = await createFacebookUserService({
                id,
                email,
                name,
            });

            if (result.EC === 1) {
                return {
                    EC: 1,
                    EM: result.EM || "Internal server error",
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
            id: user._id,
            email: user.email,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            address: user.address,
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
                    id: user._id,
                    email: user.email,
                    phone: user.phone,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    displayName: user.displayName,
                    address: user.address,
                    role: user.role,
                },
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: "Internal server error ",
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
            id: token.user._id,
            email: token.user.email,
            phone: token.user.phone,
            firstName: token.user.firstName,
            lastName: token.user.lastName,
            displayName: token.user.displayName,
            address: token.user.address,
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
                    id: token.user._id,
                    email: token.user.email,
                    phone: token.user.phone,
                    firstName: token.user.firstName,
                    lastName: token.user.lastName,
                    displayName: token.user.displayName,
                    address: token.user.address,
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

    createGoogleUserService,

    createFacebookUserService,
    loginFacebookService,
};
