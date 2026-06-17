// Routes for Transaction Management
import express from 'express';
import { Transaction, Account, Category, User } from './models.js';
import { verifyToken, asyncHandler } from './middleware.js';
import { evaluateExpression } from './calculator-util.js';
import { convertCurrency } from './currency-util.js';

const router = express.Router();

// Create transaction (income, expense, or transfer)
router.post('/', verifyToken, asyncHandler(async (req, res) => {
  const { 
    accountId, 
    categoryId, 
    type, 
    amount, 
    amountExpression,
    currency, 
    description, 
    date,
    transferFromAccountId,
    tags,
    notes,
  } = req.body;

  if (!accountId || !categoryId || !type) {
    return res.status(400).json({ error: 'accountId, categoryId, and type required' });
  }

  if (!['income', 'expense', 'transfer'].includes(type)) {
    return res.status(400).json({ error: 'Invalid transaction type' });
  }

  let finalAmount = amount;

  // Evaluate mathematical expression if provided
  if (amountExpression) {
    finalAmount = evaluateExpression(amountExpression);
    if (finalAmount === null) {
      return res.status(400).json({ error: 'Invalid amount expression' });
    }
  }

  if (!finalAmount || finalAmount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than 0' });
  }

  // Verify account belongs to user
  const account = await Account.findOne({ _id: accountId, userId: req.userId });
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  // Verify category belongs to user
  const category = await Category.findOne({ _id: categoryId, userId: req.userId });
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Get user's base currency
  const user = await User.findById(req.userId);
  const baseCurrency = currency || account.currency || user.baseCurrency;

  // Convert to base currency
  let convertedAmount = finalAmount;
  if (baseCurrency !== user.baseCurrency) {
    convertedAmount = await convertCurrency(finalAmount, baseCurrency, user.baseCurrency);
    if (convertedAmount === null) {
      return res.status(400).json({ error: 'Currency conversion failed' });
    }
  }

  // For transfers, verify transferFromAccountId
  if (type === 'transfer' && transferFromAccountId) {
    const fromAccount = await Account.findOne({ 
      _id: transferFromAccountId, 
      userId: req.userId 
    });
    if (!fromAccount) {
      return res.status(404).json({ error: 'Source account not found' });
    }
  }

  const transaction = new Transaction({
    userId: req.userId,
    accountId,
    categoryId,
    type,
    amount: finalAmount,
    currency: baseCurrency,
    convertedAmount,
    description: description || '',
    date: date ? new Date(date) : new Date(),
    transferFromAccountId: transferFromAccountId || null,
    tags: tags || [],
    notes: notes || '',
  });

  await transaction.save();
  
  // Populate references
  await transaction.populate('categoryId', 'name icon color');
  await transaction.populate('accountId', 'accountName icon color');

  res.status(201).json({ 
    message: 'Transaction created', 
    transaction 
  });
}));

// Get all transactions for user (with filters)
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const { 
    accountId, 
    categoryId, 
    type, 
    startDate, 
    endDate, 
    search,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = { userId: req.userId };

  if (accountId) filter.accountId = accountId;
  if (categoryId) filter.categoryId = categoryId;
  if (type) filter.type = type;
  if (search) {
    filter.$or = [
      { description: { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } },
    ];
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const transactions = await Transaction.find(filter)
    .populate('categoryId', 'name icon color')
    .populate('accountId', 'accountName icon color')
    .sort({ date: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Transaction.countDocuments(filter);

  res.json({
    transactions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// Get single transaction
router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    userId: req.userId,
  })
    .populate('categoryId', 'name icon color')
    .populate('accountId', 'accountName icon color');

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.json(transaction);
}));

// Update transaction
router.patch('/:id', verifyToken, asyncHandler(async (req, res) => {
  const { amount, amountExpression, description, categoryId, date, tags, notes, accountId } = req.body;

  const transaction = await Transaction.findOne({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  // Handle amount update with expression evaluation
  if (amountExpression) {
    const evaluatedAmount = evaluateExpression(amountExpression);
    if (evaluatedAmount === null) {
      return res.status(400).json({ error: 'Invalid amount expression' });
    }
    transaction.amount = evaluatedAmount;
  } else if (amount) {
    transaction.amount = amount;
  }

  if (description) transaction.description = description;
  if (categoryId) transaction.categoryId = categoryId;
  if (accountId) {
    // verify the account belongs to the user
    const account = await Account.findOne({ _id: accountId, userId: req.userId });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    transaction.accountId = accountId;
  }
  if (date) transaction.date = new Date(date);
  if (tags) transaction.tags = tags;
  if (notes) transaction.notes = notes;

  await transaction.save();
  await transaction.populate('categoryId', 'name icon color');
  await transaction.populate('accountId', 'accountName icon color');

  res.json({ message: 'Transaction updated', transaction });
}));

// Delete transaction
router.delete('/:id', verifyToken, asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.json({ message: 'Transaction deleted', transaction });
}));

// Get transaction summary (totals by category/type/period)
router.get('/summary/overview', verifyToken, asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const filter = { userId: req.userId };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const summary = await Transaction.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$convertedAmount' },
        count: { $sum: 1 },
      },
    },
  ]);

  const categoryBreakdown = await Transaction.aggregate([
    { $match: { ...filter, type: 'expense' } },
    { $group: {
        _id: '$categoryId',
        total: { $sum: '$convertedAmount' },
        count: { $sum: 1 },
      },
    },
    { $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
  ]);

  res.json({
    summary,
    categoryBreakdown,
  });
}));

export default router;
