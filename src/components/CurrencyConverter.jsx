import { useState } from "react";
import { FaMoneyBillWave, FaExchangeAlt } from "react-icons/fa";
import { MdCurrencyExchange } from "react-icons/md";
import CurrencyDropdown from "./CurrencyDropdown";
import { convertCurrency } from "../services/currencyService";
import "../styles/converter.css";

function CurrencyConverter({ darkMode, setDarkMode }) {
  const [inputAmount, setInputAmount] = useState(1);
  const [confirmedAmount, setConfirmedAmount] = useState(null);

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");

  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currencies = ["USD", "INR", "EUR", "GBP", "JPY"];

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setRate(null);
    setConfirmedAmount(null);
  };

  const handleConvert = async () => {
    if (!inputAmount || inputAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const convertedValue = await convertCurrency(
      inputAmount,
      fromCurrency,
      toCurrency
    );

    if (convertedValue !== null) {
      const calculatedRate = convertedValue / inputAmount;

      setResult(convertedValue);
      setRate(calculatedRate);
      setConfirmedAmount(inputAmount);

      localStorage.setItem(
        `${fromCurrency}_${toCurrency}_rate`,
        calculatedRate
      );

      setHistory((prev) => {
        const entry = `${inputAmount} ${fromCurrency} → ${convertedValue.toFixed(
          2
        )} ${toCurrency}`;
        return [entry, ...prev].slice(0, 5);
      });
    } else {
      const savedRate = localStorage.getItem(
        `${fromCurrency}_${toCurrency}_rate`
      );

      if (savedRate) {
        setRate(Number(savedRate));
        setResult(inputAmount * Number(savedRate));
        setConfirmedAmount(inputAmount);
        setError("Offline mode: using last saved rate");
      } else {
        setError("API unavailable and no saved data");
      }
    }

    setLoading(false);
  };

  return (
    <div className="converter-container">
      {/* Theme toggle */}
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <h2>
        <MdCurrencyExchange className="icon-title" />
        Currency Converter
      </h2>

      <div className="input-group">
        <FaMoneyBillWave className="input-icon" />
        <input
          type="number"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>

      <div className="dropdown-group">
        <label>From</label>
        <div className="flag-select">
          <img
            src={`https://flagcdn.com/w40/${currencyToCountry[fromCurrency]}.png`}
            alt={fromCurrency}
          />
          <CurrencyDropdown
            currency={fromCurrency}
            currencies={currencies}
            onChange={(e) => setFromCurrency(e.target.value)}
          />
        </div>
      </div>

      <FaExchangeAlt className="swap-icon" onClick={swapCurrencies} />

      <div className="dropdown-group">
        <label>To</label>
        <div className="flag-select">
          <img
            src={`https://flagcdn.com/w40/${currencyToCountry[toCurrency]}.png`}
            alt={toCurrency}
          />
          <CurrencyDropdown
            currency={toCurrency}
            currencies={currencies}
            onChange={(e) => setToCurrency(e.target.value)}
          />
        </div>
      </div>

      <button className="convert-btn" onClick={handleConvert}>
        Convert
      </button>

      {loading && <p className="loading">Converting...</p>}
      {error && <p className="error">{error}</p>}

      {rate && (
        <p className="rate-text">
          1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
        </p>
      )}

      {result && confirmedAmount && !loading && (
        <div className="result-box">
          {confirmedAmount} {fromCurrency} = <span>{result.toFixed(2)}</span>{" "}
          {toCurrency}
        </div>
      )}

      {history.length > 0 && (
        <div className="history-box">
          <h4>Conversion History</h4>
          <ul>
            {history.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CurrencyConverter;
