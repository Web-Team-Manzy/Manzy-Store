const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        fromAccountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
        toAccountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["PENDING", "COMPLETED", "FAILED"],
            default: "PENDING",
        },
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        reference: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
