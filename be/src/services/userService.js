const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../app/models/userM");

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
            role: "admin",
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

module.exports = {
    createUserService,
};
