const TransactionModel = require("../models/transaction");
const EthereumPriceModel = require("../models/ethereumPrice");
const BigNumber = require("bignumber.js");

exports.getUserExpenses = async (req, res) => {
  try {
    const { address } = req.params;

    // Fetch all transactions for the given address
    const userTransactions = await TransactionModel.find({ address });

    // Calculate total expenses
    const totalUserExpenses = userTransactions.reduce((sum, transaction) => {
      const gasUsedBN = new BigNumber(transaction.gasUsed);
      const gasPriceBN = new BigNumber(transaction.gasPrice);
      const transactionExpense = gasUsedBN
        .multipliedBy(gasPriceBN)
        .dividedBy(new BigNumber(10).pow(18));
      return sum.plus(transactionExpense);
    }, new BigNumber(0));

    // Fetch the latest Ethereum price
    const latestEthereumPrice = await EthereumPriceModel.findOne().sort({ timestamp: -1 });

    if (!latestEthereumPrice) {
      throw new Error("No Ethereum price data available");
    }

    res.json({
      address,
      totalExpenses: totalUserExpenses + " ETH",
      currentEtherPrice: latestEthereumPrice.price,
      currency: "INR",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
