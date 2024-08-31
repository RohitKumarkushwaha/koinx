const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    index: true,
  },
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  from: String,
  to: String,
  value: String,
  gas: Number,
  gasPrice: String,
  gasUsed: Number,
  blockNumber: Number,
  timeStamp: Number,
});

module.exports = mongoose.model('Transaction', transactionSchema);