const mongoose = require("mongoose");

const reconciliationLogSchema = new mongoose.Schema(
    {
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
        discrepancyAmount: {
            type: Number,
            default: function () {
                return Math.abs(this.mainSystemAmount - this.paymentSystemAmount);
            },
        },
        reconciliationDate: {
            type: Date,
            default: Date.now,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        processedBy: {
            type: String,
            required: true,
        },
        notes: String,
        lastModified: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Tạo index để tối ưu query
reconciliationLogSchema.index({ reconciliationDate: 1 });
reconciliationLogSchema.index({ status: 1 });
reconciliationLogSchema.index({ orderId: 1 });

module.exports = mongoose.model("ReconciliationLog", reconciliationLogSchema);
