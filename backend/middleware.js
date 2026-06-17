import jwt from 'jsonwebtoken'

export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next)
  } catch (error) {
    next(error)
  }
}

export const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'budget_tracker_secret', {
    expiresIn: '7d',
  })
}

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.cookies?.token
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization token missing' })
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'budget_tracker_secret')
    req.userId = decoded.userId
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      displayName: decoded.displayName,
    }
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
