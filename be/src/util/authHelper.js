require("dotenv").config();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { OAuth2Client } = require("google-auth-library");

const RefreshToken = require("../app/models/RefreshToken");

const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
);

const getGoogleUserData = async (code) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);

        const { data } = await oauth2Client.request({
            url: "https://www.googleapis.com/oauth2/v2/userinfo",
        });

        if (!data) {
            return null;
        }

        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const verifyToken = (token) => {
    let key = process.env.JWT_ACCESS_TOKEN_SECRET;
    let decoded = null;

    try {
        decoded = jwt.verify(token, key);
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return "TokenExpiredError";
        }
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

const deleteRefreshTokenOfUser = async (userId) => {
    try {
        await RefreshToken.deleteMany({ user: userId });
    } catch (error) {
        console.log(error);
    }
};

const verifyRefreshTokenExpiration = async (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
};

module.exports = {
    getGoogleUserData,
    issueAccessToken,
    createRefreshToken,
    extractToken,
    verifyToken,
    deleteRefreshTokenOfUser,
    verifyRefreshTokenExpiration,
};
