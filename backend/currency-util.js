const rates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 82.5,
  JPY: 149.5,
  AUD: 1.52,
}

export const convertCurrency = async (amount, fromCurrency = 'USD', toCurrency = 'USD') => {
  if (fromCurrency === toCurrency) {
    return amount
  }

  const fromRate = rates[fromCurrency]
  const toRate = rates[toCurrency]

  if (!fromRate || !toRate) {
    return null
  }

  const converted = (amount / fromRate) * toRate
  return Number(converted.toFixed(2))
}
