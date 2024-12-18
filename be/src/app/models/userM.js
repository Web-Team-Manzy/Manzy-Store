const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        firstName: {
            type: String,
            maxLength: 255,
            default: "",
        },

        lastName: {
            type: String,
            maxLength: 255,
            default: "",
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        source: {
            type: String,
            enum: ["local", "facebook", "google"],
            default: "local",
        },

        googleId: {
            type: String,
            default: null,
        },

        cartData: {
            type: Object,
            default: {},
        },

        address: {
            type: String,
            default: "",
        },

        phone: {
            type: String,
            default: "",
        },

        lastLogin: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        minimize: false,
    }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
