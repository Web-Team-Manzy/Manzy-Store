const { processGetTransactions } = require('../../services/paymentService');
class TransactionC {

  async getTransactions(req, res) {
    try {
      const transaction = await processGetTransactions();
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

}

module.exports = new TransactionC();