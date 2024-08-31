require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { startEthereumPriceJob } = require("./services/ethereumPriceService.js");
const transactionRoutes = require("./routes/transactionRoutes.js");
const expenseRoutes = require('./routes/expenseRoutes.js');


const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    startEthereumPriceJob();
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(express.json());

// Routes
app.use("/api", transactionRoutes);
app.use('/api', expenseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});