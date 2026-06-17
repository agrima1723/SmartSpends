// Add this right at the top of your utils.js file!
// utils.js
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://smartspends-3hv9.onrender.com';
export const classNames = (...classes) => classes.filter(Boolean).join(' ')

export const formatCurrency = (value, currency = 'USD') => {
  const amount = Number(value) || 0
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    AUD: 'A$',
  }

  const symbol = symbols[currency] || '$'
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}