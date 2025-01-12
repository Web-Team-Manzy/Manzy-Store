const Reconciliation = require("../models/reconciliationLog.model");

const {
    reconcileTransaction,
    getDiscrepancyReport,
} = require("../../services/reconciliationService");

class ReconciliationController {
    static async reconcileTransaction(req, res) {
        try {
            let { startDate, endDate, page, limit } = req.query;

            page = parseInt(page) || 1;
            limit = parseInt(limit) || 5;

            const data = await reconcileTransaction(startDate, endDate, page, limit);

            if (!data || +data.EC !== 0) {
                return res.status(500).json({
                    EC: 99,
                    EM: data.EM || "Reconciliation failed",
                });
            }

            console.log(">>> reconcileTransaction:", data);

            return res.status(200).json({
                EC: 0,
                EM: "Reconciliation successful",
                data: data.DT,
            });
        } catch (error) {
            console.log(">>> reconcileTransaction error:", error);
            return res.status(500).json({
                EC: 99,
                EM: "Reconciliation failed",
            });
        }
    }

    static async getDiscrepancyReport(req, res) {
        try {
            const { date } = req.query;

            const data = await getDiscrepancyReport(date);

            console.log(">>> getDiscrepancyReport:", data);

            if (!data) {
                return res.status(500).json({
                    EC: 99,
                    EM: "Failed to get discrepancy report",
                });
            }

            return res.status(200).json({
                EC: 0,
                EM: "Discrepancy report retrieved",
                DT: data,
            });
        } catch (error) {
            console.log(">>> getDiscrepancyReport error:", error);
            return res.status(500).json({
                EC: 99,
                EM: "Failed to get discrepancy report",
            });
        }
    }
}

module.exports = ReconciliationController;
