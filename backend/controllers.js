export const ensureOwner = (resource, userId) => {
  return resource && resource.userId?.toString() === userId?.toString()
}

export const safeNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export const notFoundResponse = (res, name = 'Resource') => {
  return res.status(404).json({ error: `${name} not found` })
}
