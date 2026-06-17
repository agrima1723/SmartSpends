import express from 'express'
import { Account } from './models.js'
import { verifyToken, asyncHandler } from './middleware.js'

const router = express.Router()
router.use(verifyToken)

router.post('/', asyncHandler(async (req, res) => {
  const { accountName, accountType, icon, color, initialBalance, currency, isActive } = req.body
  const normalizedCurrency = (currency || 'USD').toString().toUpperCase()
  if (!accountName) {
    return res.status(400).json({ error: 'Account name is required' })
  }

  const account = new Account({
    userId: req.userId,
    accountName,
    accountType: accountType || 'Bank',
    icon: icon || 'Wallet',
    color: color || '#3B82F6',
    initialBalance: initialBalance ?? 0,
    currency: normalizedCurrency || 'USD',
    isActive: isActive ?? true,
  })

  await account.save()
  res.status(201).json({ message: 'Account created', account })
}))

router.get('/', asyncHandler(async (req, res) => {
  const accounts = await Account.find({ userId: req.userId }).sort({ accountName: 1 })
  res.json({ accounts })
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const account = await Account.findOne({ _id: req.params.id, userId: req.userId })
  if (!account) return res.status(404).json({ error: 'Account not found' })
  res.json(account)
}))

router.patch('/:id', asyncHandler(async (req, res) => {
  const { accountName, accountType, icon, color, initialBalance, currency, isActive } = req.body
  const updates = {}
  if (accountName !== undefined) updates.accountName = accountName
  if (accountType !== undefined) updates.accountType = accountType
  if (icon !== undefined) updates.icon = icon
  if (color !== undefined) updates.color = color
  if (initialBalance !== undefined) updates.initialBalance = initialBalance
  if (currency !== undefined) updates.currency = currency.toString().toUpperCase()
  if (isActive !== undefined) updates.isActive = isActive

  const account = await Account.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    updates,
    { new: true }
  )

  if (!account) return res.status(404).json({ error: 'Account not found' })
  res.json({ message: 'Account updated', account })
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const account = await Account.findOneAndDelete({ _id: req.params.id, userId: req.userId })
  if (!account) return res.status(404).json({ error: 'Account not found' })
  res.json({ message: 'Account deleted' })
}))

export default router
