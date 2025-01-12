const {
    processGetTransactions,
    processGetReconciliation,
    processGetReconciliationDiscrepancy,
} = require("../../services/paymentService");
class TransactionC {
    async getTransactions(req, res) {
        try {
            let { page, limit } = req.query;

            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;

            const transaction = await processGetTransactions(page, limit);
            res.status(201).json(transaction);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getReconciliation(req, res) {
        try {
            let { startDate, endDate } = req.body;

            startDate = new Date(startDate).toISOString();
            endDate = new Date(endDate).toISOString();

            const reconciliation = await processGetReconciliation(startDate, endDate);

            res.status(201).json(reconciliation);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getReconciliationDiscrepancy(req, res) {
        try {
            let { date } = req.params;
            date = new Date(date).toISOString();

            const reconciliationDiscrepancy = await processGetReconciliationDiscrepancy(date);

            res.status(201).json(reconciliationDiscrepancy);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new TransactionC();
