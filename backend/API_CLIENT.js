export const fetchJson = async (url, options = {}) => {
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available in this Node runtime.')
  }

  const response = await fetch(url, options)
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(data?.error || response.statusText || 'API request failed')
  }

  return data
}
