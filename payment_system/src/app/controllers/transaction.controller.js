const { default: mongoose } = require("mongoose");
const Account = require("../models/account.model");
const Transaction = require("../models/transaction.model");

class TransactionController {
  // [POST] /payment/transaction/create-transaction
  async createTransaction(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { userId, amount, orderId } = req.body;

      const userAccount = await Account.findOne({ userId });

      if (!userAccount) {
        return res.status(404).json({
          EC: 1,
          EM: "User account not found",
        });
      }

      const adminAccount = await Account.findOne({ type: "MAIN" });

      if (!adminAccount) {
        return res.status(404).json({
          EC: 1,
          EM: "Admin account not found",
        });
      }

      if (userAccount.balance < amount) {
        return res.status(400).json({
          EC: 1,
          EM: "Not enough balance",
        });
      }

      const newTransaction = new Transaction({
        fromAccountId: userAccount._id,
        toAccountId: adminAccount._id,
        amount,
        orderId,
        status: "PENDING",
      });

      userAccount.balance -= amount;
      adminAccount.balance += amount;

      // await Promise.all([
      //   newTransaction.save({ session }),
      //   userAccount.save({ session }),
      //   adminAccount.save({ session }),
      // ]);
      await newTransaction.save({ session });
      await userAccount.save({ session });
      await adminAccount.save({ session });

      newTransaction.status = "COMPLETED";
      await newTransaction.save({ session });

      await session.commitTransaction();

      res.status(200).json({
        EC: 0,
        EM: "Success",
        DT: newTransaction,
      });
    } catch (error) {
      console.log(">>> TransactionController.createTransaction", error);

      await session.abortTransaction();

      res.status(500).json({
        EC: 1,
        EM: "Internal Server Error",
      });
    } finally {
      session.endSession();
    }
  }

  // [GET] /payment/transaction
  async getTransactions(req, res, next) {
    try {
      const { userId, startDate, endDate } = req.query;
      const userAccount = await Account.findOne({ userId });

      if (!userAccount) {
        return res.status(404).json({
          EC: 1,
          EM: "User account not found",
        });
      }

      const query = {
        $or: [
          { fromAccountId: userAccount._id },
          { toAccountId: userAccount._id },
        ],
      };

      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const transactions = await Transaction.find(query)
        .populate("fromAccountId")
        .populate("toAccountId")
        .sort({ createdAt: -1 });

      if (!transactions) {
        return res.status(404).json({
          EC: 1,
          EM: "Transactions not found",
        });
      }

      res.status(200).json({
        EC: 0,
        EM: "Success",
        DT: transactions,
      });
    } catch (error) {
      console.log(">>> TransactionController.getTransactions", error);

      res.status(500).json({
        EC: 1,
        EM: "Internal Server Error",
      });
    }
  }

  async getAllTransactions(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const skip = (page - 1) * limit;

      const transactions = await Transaction.find({})
        .populate("fromAccountId")
        .populate("toAccountId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalTransactions = await Transaction.countDocuments();

      res.status(200).json({
        EC: 0,
        EM: "Success",
        DT: {
          transactions,
          pagination: {
            totalTransactions,
            totalPages: Math.ceil(totalTransactions / limit),
            currentPage: page,
            pageSize: limit,
          },
        },
      });
    } catch (error) {
      console.log(">>> TransactionController.getAllTransactions", error);

      res.status(500).json({
        EC: 1,
        EM: "Internal Server Error",
      });
    }
  }
}

module.exports = new TransactionController();
