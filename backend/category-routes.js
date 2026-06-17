import express from 'express'
import { Category } from './models.js'
import { verifyToken, asyncHandler } from './middleware.js'

const router = express.Router()
router.use(verifyToken)

router.post('/', asyncHandler(async (req, res) => {
  const { name, icon, color, parentCategory, type, isDefault } = req.body
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' })
  }

  const category = new Category({
    userId: req.userId,
    name,
    icon: icon || 'Tag',
    color: color || '#6366F1',
    parentCategory: parentCategory || null,
    type: type || 'expense',
    isDefault: isDefault ?? false,
  })

  await category.save()
  res.status(201).json({ message: 'Category created', category })
}))

router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({ userId: req.userId }).sort({ name: 1 })
  res.json({ categories })
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, userId: req.userId })
  if (!category) return res.status(404).json({ error: 'Category not found' })
  res.json(category)
}))

router.patch('/:id', asyncHandler(async (req, res) => {
  const updates = {}
  const allowedFields = ['name', 'icon', 'color', 'parentCategory', 'type', 'isDefault']
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field]
  })

  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    updates,
    { new: true }
  )

  if (!category) return res.status(404).json({ error: 'Category not found' })
  res.json({ message: 'Category updated', category })
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const category = await Category.findOneAndDelete({ _id: req.params.id, userId: req.userId })
  if (!category) return res.status(404).json({ error: 'Category not found' })
  res.json({ message: 'Category deleted' })
}))

export default router
