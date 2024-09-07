const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = "4E0VK7BnkdeUuh1vegAt808v2IUjzUR6lxcvBMT2";

app.use(cors());

// Endpoint to fetch conversion rates
app.get("/api/rates", async (req, res) => {
  const { from, to, amount } = req.query;

  try {
    const response = await axios.get(
      `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&base_currency=${from}`
    );

    const rate = response.data.data[to];
    const convertedAmount = rate * amount;

    return res.status(200).json({
      success: true,
      convertedAmount,
      rate,
    });
  } catch (error) {
    console.error("Error fetching conversion rate:", error.message);
    res.status(500).json({ error: "Error fetching conversion rate" });
  }
});

// New endpoint to fetch supported currencies
app.get("/api/currencies", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.freecurrencyapi.com/v1/currencies?apikey=${API_KEY}`
    );

    const currencies = response.data.data; // This will return an object with currency codes and their names
    return res.status(200).json({
      success: true,
      currencies: Object.keys(currencies), // Return an array of currency codes
    });
  } catch (error) {
    console.error("Error fetching currencies:", error.message);
    res.status(500).json({ error: "Error fetching currencies" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
