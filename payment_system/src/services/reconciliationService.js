const Transaction = require("../app/models/transaction.model");
const ReconciliationLog = require("../app/models/reconciliationLog.model");

const { SERVICES } = require("../config/constants");

const { makeServiceRequest } = require("../util/paymentAuth");

const reconcileTransaction = async (startDate, endDate, page = 1, limit = 5) => {
    try {
        const paymentTransactions = await Transaction.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        });

        startDate = new Date(startDate.setHours(0, 0, 0, 0));
        endDate = new Date(endDate.setHours(23, 59, 59, 999));

        const res = await makeServiceRequest(
            SERVICES.MAIN_SYSTEM.BASE_URL,
            SERVICES.MAIN_SYSTEM.SERVICE_ID,
            "GET",
            `/order/${startDate}/${endDate}?page=${page}&limit=${limit}`
        );

        if (!res || +res.EC !== 0) {
            return {
                EC: 99,
                EM: res.EM || "Service request failed",
            };
        }

        const mainSystemOrders = res.DT;

        for (const transaction of paymentTransactions) {
            const matchingOrder = mainSystemOrders.find(
                (order) => order._id === transaction.orderId
            );

            // find existing reconciliation log for this transaction
            const existingLog = await ReconciliationLog.findOne({
                transactionId: transaction._id,
            });

            if (existingLog) {
                // update existing log
                existingLog.paymentSystemAmount = transaction.amount;
                existingLog.mainSystemAmount = matchingOrder ? matchingOrder.amount : 0;

                // Kiểm tra khớp lệch
                if (!matchingOrder) {
                    existingLog.status = "MISMATCHED";
                    existingLog.discrepancyReason = "Order not found in main system";
                } else if (transaction.amount !== matchingOrder.amount) {
                    existingLog.status = "MISMATCHED";
                    existingLog.discrepancyReason = "Amount mismatch";
                } else {
                    existingLog.status = "MATCHED";
                }

                await existingLog.save();
                continue;
            }

            const reconciliationLog = new ReconciliationLog({
                transactionId: transaction._id,
                orderId: transaction.orderId,
                paymentSystemAmount: transaction.amount,
                mainSystemAmount: matchingOrder ? matchingOrder.amount : 0,
            });

            // Kiểm tra khớp lệch
            if (!matchingOrder) {
                reconciliationLog.status = "MISMATCHED";
                reconciliationLog.discrepancyReason = "Order not found in main system";
            } else if (transaction.amount !== matchingOrder.amount) {
                reconciliationLog.status = "MISMATCHED";
                reconciliationLog.discrepancyReason = "Amount mismatch";
            } else {
                reconciliationLog.status = "MATCHED";
            }

            await reconciliationLog.save();
        }

        const summary = await ReconciliationLog.aggregate([
            {
                $match: {
                    reconciliationDate: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$paymentSystemAmount" },
                },
            },
        ]);

        if (!summary) {
            return {
                EC: 99,
                EM: "Reconciliation failed",
            };
        }

        console.log(">>> summary:", summary);

        return {
            EC: 0,
            EM: "Reconciliation successful",
            DT: summary,
        };
    } catch (error) {
        console.log(">>> reconcileTransaction error:", error);
        return {
            EC: 99,
            EM: "Reconciliation failed",
        };
    }
};

const getDiscrepancyReport = async (date) => {
    //MISMATCHED
    //MATCHED
    return ReconciliationLog.find({
        status: "MISMATCHED",
        reconciliationDate: {
            $gte: new Date(date),
            $lt: new Date(date).setDate(new Date(date).getDate() + 1),
        },
    }).populate("transactionId");
};

module.exports = {
    reconcileTransaction,
    getDiscrepancyReport,
};
