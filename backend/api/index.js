require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const API_KEY = process.env.FREE_CURRENCY_API_KEY;

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

    const currencies = response.data.data;
    return res.status(200).json({
      success: true,
      currencies: Object.keys(currencies),
    });
  } catch (error) {
    console.error("Error fetching currencies:", error.message);
    res.status(500).json({ error: "Error fetching currencies" });
  }
});

module.exports = app;
