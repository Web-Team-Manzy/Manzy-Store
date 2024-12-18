require("dotenv").config();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const RefreshToken = require("../app/models/RefreshToken");

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
};
