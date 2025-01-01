const mongoose = require("mongoose");

const reconciliationLogSchema = new mongoose.Schema({
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    mainSystemAmount: {
        type: Number,
        required: true,
    },
    paymentSystemAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["MATCHED", "MISMATCHED", "PENDING"],
        default: "PENDING",
    },
    discrepancyReason: String,
    reconciliationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("ReconciliationLog", reconciliationLogSchema);
