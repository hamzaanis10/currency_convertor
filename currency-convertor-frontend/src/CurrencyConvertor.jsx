import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Table,
} from "react-bootstrap";

const API_URL = "http://localhost:5000/api";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversionHistory, setConversionHistory] = useState(
    JSON.parse(localStorage.getItem("conversionHistory")) || []
  );

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const response = await axios.get(`${API_URL}/currencies`);
        if (response.data.success && response.data.currencies) {
          setCurrencies(response.data.currencies);
        } else {
          console.error(
            "Invalid response format for currencies",
            response.data
          );
          setCurrencies([]);
        }
      } catch (error) {
        console.error("Error fetching currencies:", error);
        setCurrencies([]);
      }
    }
    fetchCurrencies();
  }, []);

  const handleConvert = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/rates?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
      );
      if (response.data.success) {
        setConvertedAmount(response.data.convertedAmount);
        saveConversionToHistory(response.data.convertedAmount);
      }
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveConversionToHistory = (convertedAmount) => {
    const newRecord = {
      fromCurrency,
      toCurrency,
      amount,
      convertedAmount,
      date: new Date().toLocaleString(),
    };
    const updatedHistory = [newRecord, ...conversionHistory];
    setConversionHistory(updatedHistory);
    localStorage.setItem("conversionHistory", JSON.stringify(updatedHistory));
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={6} className="mx-auto">
          <h2 className="text-center mb-4">Currency Converter</h2>

          {/* Conversion Form */}
          <Form>
            <Form.Group>
              <Form.Label>From Currency</Form.Label>
              <Form.Control
                as="select"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {currencies.map((currencyCode) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>To Currency</Form.Label>
              <Form.Control
                as="select"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {currencies.map((currencyCode) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>

            <Button
              variant="primary"
              className="w-100 mt-3"
              onClick={handleConvert}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Convert"}
            </Button>
          </Form>

          {/* Converted Amount Display */}
          {convertedAmount && (
            <h4 className="text-center mt-4">
              Converted Amount: {convertedAmount.toFixed(2)} {toCurrency}
            </h4>
          )}

          {/* Conversion History */}
          <h3 className="text-center mt-5">Conversion History</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Converted</th>
              </tr>
            </thead>
            <tbody>
              {conversionHistory.map((record, index) => (
                <tr key={index}>
                  <td>{record.date}</td>
                  <td>{record.fromCurrency}</td>
                  <td>{record.toCurrency}</td>
                  <td>{record.amount}</td>
                  <td>{record.convertedAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default CurrencyConverter;
