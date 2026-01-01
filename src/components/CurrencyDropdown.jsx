import currencyToCountry from "../utils/currencyToCountry";

function CurrencyDropdown({ currency, currencies, onChange }) {
  return (
    <select value={currency} onChange={onChange}>
      {currencies.map((cur) => (
        <option key={cur} value={cur}>
          {cur}
        </option>
      ))}
    </select>
  );
}

export default CurrencyDropdown;
