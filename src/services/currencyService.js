export async function convertCurrency(amount, fromCurrency, toCurrency) {
  try {
    const response = await fetch(
      `https://open.er-api.com/v6/latest/${fromCurrency}`
    );

    const data = await response.json();

    if (!data || !data.rates || !data.rates[toCurrency]) {
      return null;
    }

    return amount * data.rates[toCurrency];
  } catch (error) {
    console.error("Currency API error:", error);
    return null;
  }
}
