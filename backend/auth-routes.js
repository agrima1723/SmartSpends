import express from 'express'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { User } from './models.js'
import { asyncHandler } from './middleware.js'

const router = express.Router()

const createToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      displayName: user.displayName,
    },
    process.env.JWT_SECRET || 'budget_tracker_secret',
    { expiresIn: '7d' }
  )
}

router.post('/signup', asyncHandler(async (req, res) => {
  const { email, password, displayName, baseCurrency } = req.body

  if (!email || !password || !displayName) {
    return res.status(400).json({ error: 'Email, password and displayName are required' })
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    return res.status(409).json({ error: 'Email is already registered' })
  }

  const passwordHash = await argon2.hash(password)
  const user = new User({
    email: email.toLowerCase(),
    displayName,
    passwordHash,
    baseCurrency: baseCurrency || 'USD',
  })

  await user.save()

  const token = createToken(user)
  res.status(201).json({
    token,
    user: {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      baseCurrency: user.baseCurrency,
      privacyMode: user.privacyMode,
    },
  })
}))

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const isValid = await argon2.verify(user.passwordHash, password)
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = createToken(user)
  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      baseCurrency: user.baseCurrency,
      privacyMode: user.privacyMode,
    },
  })
}))

router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    return res.status(404).json({ error: 'Email not found in our system' })
  }

  const resetToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || 'budget_tracker_secret',
    { expiresIn: '15m' }
  )

  res.json({
    message: 'Password reset token generated. Use this token to reset your password.',
    resetToken,
    expiresIn: '15 minutes',
  })
}))

router.post('/reset-password', asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body

  if (!resetToken || !newPassword) {
    return res.status(400).json({ error: 'Reset token and new password are required' })
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }

  let decoded
  try {
    decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'budget_tracker_secret')
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired reset token' })
  }

  const user = await User.findById(decoded.userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const newPasswordHash = await argon2.hash(newPassword)
  await User.findByIdAndUpdate(decoded.userId, { passwordHash: newPasswordHash })

  res.json({ message: 'Password reset successfully. You can now login with your new password.' })
}))

export default router
