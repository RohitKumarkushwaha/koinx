const axios = require("axios");
const cron = require("node-cron");
const EthereumPriceModel = require("../models/ethereumPrice");

const fetchAndStoreEthereumPrice = async () => {
  try {
    const ethApiResponse = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr"
    );

    if (
      !ethApiResponse.data ||
      !ethApiResponse.data.ethereum ||
      !ethApiResponse.data.ethereum.inr
    ) {
      throw new Error("Invalid response from CoinGecko API");
    }

    const ethCurrentPrice = ethApiResponse.data.ethereum.inr;

    // Fetch the last stored price from the database
    const lastPriceRecord = await EthereumPriceModel.findOne().sort({
      createdAt: -1,
    });

    if (lastPriceRecord) {
      // Check if the new price is different from the last stored price
      if (lastPriceRecord.price !== ethCurrentPrice) {
        // Update the existing record with the new price
        lastPriceRecord.price = ethCurrentPrice;
        await lastPriceRecord.save();
        console.log(`Ethereum price updated: ₹${ethCurrentPrice}`);
      } else {
        console.log("Price has not changed, no need to update.");
      }
    } else {
      // If no previous price exists, create a new record
      const newPriceRecord = new EthereumPriceModel({ price: ethCurrentPrice });
      await newPriceRecord.save();
      console.log(`Ethereum price stored: ₹${ethCurrentPrice}`);
    }
  } catch (err) {
    console.error("Error fetching and storing Ethereum price:", err);
  }
};

const startEthereumPriceJob = () => {
  // Schedule the job to run every 10 minutes
  cron.schedule("*/10 * * * *", fetchAndStoreEthereumPrice);
  console.log("Ethereum price fetching job scheduled");
};

module.exports = {
  fetchAndStoreEthereumPrice,
  startEthereumPriceJob,
};
