require("dotenv").config();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const RefreshToken = require("../app/models/RefreshToken");

const verifyToken = (token) => {
    let key = process.env.JWT_ACCESS_TOKEN_SECRET;
    let decoded = null;

    try {
        decoded = jwt.verify(token, key);
    } catch (err) {
        // if (err instanceof jwt.TokenExpiredError) {
        //     return "TokenExpiredError";
        // }
        console.log(err);
    }
    return decoded;
};
const extractToken = (req) => {
    if (req?.headers?.authorization && req?.headers?.authorization?.split(" ")?.[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];
    }
    return null;
};

const issueAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
    });
};

const createRefreshToken = async (userId) => {
    try {
        let expiryDate = new Date();
        expiryDate.setSeconds(+process.env.JWT_REFRESH_TOKEN_EXPIRE);

        const token = uuidv4();
        const refreshToken = await RefreshToken.create({
            token,
            user: userId,
            expiryDate: expiryDate.getTime(),
        });

        if (!refreshToken) {
            return null;
        }

        return refreshToken.token;
    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = {
    issueAccessToken,
    createRefreshToken,
    extractToken,
    verifyToken,
};
