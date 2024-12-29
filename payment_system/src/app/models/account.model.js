const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        balance: {
            type: Number,
            default: 0,
            min: 0,
        },
        isMainAccount: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);
