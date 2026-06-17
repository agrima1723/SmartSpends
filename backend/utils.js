// Currency formatting
export const formatCurrency = (amount, currency = 'USD') => {
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    AUD: 'A$',
  }

  const symbol = currencySymbols[currency] || '$'
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// Date formatting
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Calculate percentage
export const calculatePercentage = (value, total) => {
  return total === 0 ? 0 : Math.round((value / total) * 100)
}

// Get category icon
export const getCategoryIcon = (category) => {
  const icons = {
    Food: '🍔',
    Transport: '🚗',
    Entertainment: '🎬',
    Shopping: '🛍️',
    Utilities: '💡',
    Salary: '💰',
    Other: '📦',
  }
  return icons[category] || '📦'
}

// Evaluate math expression safely
export const evaluateExpression = (expression) => {
  try {
    const sanitized = expression
      .replace(/[^0-9+\-*/().\s]/g, '')
      .trim()
    if (!sanitized) return null
    return Function(`"use strict"; return (${sanitized})`)()
  } catch {
    return null
  }
}
