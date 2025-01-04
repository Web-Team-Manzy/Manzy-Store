const { processGetTransactions } = require("../../services/paymentService");
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
}

module.exports = new TransactionC();
