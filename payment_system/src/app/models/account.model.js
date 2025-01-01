const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const accountSchema = new mongoose.Schema(
    {
        accountId: {
            type: String,
            default: () => `ACC_${uuidv4()}`,
            unique: true,
        },
        userId: {
            type: String,
            unique: true,
            sparse: true,
        },
        type: {
            type: String,
            enum: ["MAIN", "USER"],
            required: true,
        },
        balance: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "SUSPENDED", "CLOSED"],
            default: "ACTIVE",
        },
        metadata: {
            createdBy: String,
            lastModifiedBy: String,
            notes: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Account", accountSchema);
