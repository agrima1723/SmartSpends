// ============================================
// User Model
// ============================================
import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /.+\@.+\..+/,
  },
  displayName: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  baseCurrency: {
    type: String,
    enum: ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD'],
    default: 'USD',
  },
  privacyMode: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

// ============================================
// Account Model
// ============================================
export const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ['Cash', 'Bank', 'CreditCard', 'Savings', 'Investment', 'Other'],
    default: 'Bank',
  },
  icon: {
    type: String,
    default: 'Wallet',
  },
  color: {
    type: String,
    default: '#3B82F6',
  },
  initialBalance: {
    type: mongoose.Decimal128,
    default: 0,
  },
  currency: {
    type: String,
    enum: ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD'],
    default: 'USD',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });
export const Account = mongoose.model('Account', accountSchema);
// ============================================
// Category Model
// ============================================
export const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'Tag',
  },
  color: {
    type: String,
    default: '#6366F1',
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'both'],
    default: 'expense',
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);

// ============================================
// Transaction Model
// ============================================
export const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'transfer'],
    required: true,
  },
  amount: {
    type: mongoose.Decimal128,
    required: true,
  },
  currency: {
    type: String,
    enum: ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD'],
    required: true,
  },
  convertedAmount: {
    type: mongoose.Decimal128,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    required: true,
  },
  receiptUrl: {
    type: String,
    default: null,
  },
  receiptPublicId: {
    type: String,
    default: null,
  },
  transferFromAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    default: null,
  },
  tags: [String],
  notes: String,
}, { timestamps: true });

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, categoryId: 1 });
transactionSchema.index({ userId: 1, accountId: 1 });

export const Transaction = mongoose.model('Transaction', transactionSchema);

// ============================================
// Budget Model (Phase 4)
// ============================================
export const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  limit: {
    type: mongoose.Decimal128,
    required: true,
  },
  period: {
    type: String,
    enum: ['monthly', 'weekly', 'custom'],
    default: 'monthly',
  },
  spent: {
    type: mongoose.Decimal128,
    default: 0,
  },
  remaining: {
    type: mongoose.Decimal128,
    default: 0,
  },
  alertThreshold: {
    type: Number,
    default: 75,
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'ended'],
    default: 'active',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

budgetSchema.index({ userId: 1, category: 1 });
budgetSchema.index({ userId: 1, status: 1 });

export const Budget = mongoose.model('Budget', budgetSchema);

// ============================================
// Recurring Transaction Model (Phase 4)
// ============================================
export const recurringTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  amount: {
    type: mongoose.Decimal128,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true,
  },
  dayOfMonth: {
    type: Number,
    default: null,
  },
  dayOfWeek: {
    type: Number,
    default: null,
  },
  nextOccurrence: {
    type: Date,
    required: true,
  },
  lastExecuted: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  endDate: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

recurringTransactionSchema.index({ userId: 1, isActive: 1 });
recurringTransactionSchema.index({ nextOccurrence: 1 });

export const RecurringTransaction = mongoose.model('RecurringTransaction', recurringTransactionSchema);

// ============================================
// Financial Goal Model (Phase 4)
// ============================================
export const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'Target',
  },
  color: {
    type: String,
    default: '#3B82F6',
  },
  targetAmount: {
    type: mongoose.Decimal128,
    required: true,
  },
  savedAmount: {
    type: mongoose.Decimal128,
    default: 0,
  },
  deadline: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    default: 'General',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'abandoned'],
    default: 'active',
  },
}, { timestamps: true });

goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ deadline: 1 });

export const Goal = mongoose.model('Goal', goalSchema);

// ============================================
// Forecast Model (Phase 4)
// ============================================
export const forecastSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  period: {
    type: String,
    enum: ['7days', '30days', '90days'],
    default: '30days',
  },
  projectedIncome: {
    type: mongoose.Decimal128,
    default: 0,
  },
  projectedExpense: {
    type: mongoose.Decimal128,
    default: 0,
  },
  projectedBalance: {
    type: mongoose.Decimal128,
    default: 0,
  },
  currentBalance: {
    type: mongoose.Decimal128,
    default: 0,
  },
  averageDailySpend: {
    type: mongoose.Decimal128,
    default: 0,
  },
  averageDailyIncome: {
    type: mongoose.Decimal128,
    default: 0,
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low',
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

forecastSchema.index({ userId: 1, generatedAt: -1 });

export const Forecast = mongoose.model('Forecast', forecastSchema);
// ============================================
// Group Model (Phase 5) - FIXED CLEAN VERSION
// ============================================
export const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    userId: mongoose.Schema.Types.ObjectId,
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
  }],
  joinCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  totalExpense: {
    type: mongoose.Decimal128,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Only keep this non-duplicate index setup
groupSchema.index({ createdBy: 1 });

export const Group = mongoose.model('Group', groupSchema);

// ============================================
// Group Expense Model (Phase 5) - RESTORED
// ============================================
export const groupExpenseSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: mongoose.Decimal128,
    required: true,
  },
  category: {
    type: String,
    default: 'Other',
  },
  splitType: {
    type: String,
    enum: ['equal', 'exact', 'percentage'],
    default: 'equal',
  },
  splits: [{
    userId: mongoose.Schema.Types.ObjectId,
    amount: mongoose.Decimal128,
  }],
}, { timestamps: true });

groupExpenseSchema.index({ groupId: 1 });
groupExpenseSchema.index({ paidBy: 1 });

export const GroupExpense = mongoose.model('GroupExpense', groupExpenseSchema);

// ============================================
// Settlement Model (Phase 5)
// ============================================
export const settlementSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: mongoose.Decimal128,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'settled'],
    default: 'pending',
  },
  settledAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

settlementSchema.index({ groupId: 1 });
settlementSchema.index({ fromUser: 1, toUser: 1 });

export const Settlement = mongoose.model('Settlement', settlementSchema);
// ============================================
// Loyalty Card Model (Phase 6)
// ============================================
export const loyaltyCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  brandName: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  cardImage: {
    type: String,
    default: null,
  },
  barcode: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    enum: ['Retail', 'Grocery', 'Gas', 'Restaurant', 'Travel', 'Other'],
    default: 'Retail',
  },
  points: {
    type: Number,
    default: 0,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

loyaltyCardSchema.index({ userId: 1 });
export const LoyaltyCard = mongoose.model('LoyaltyCard', loyaltyCardSchema);

// ============================================
// Warranty Model (Phase 6)
// ============================================
export const warrantySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  warrantyDuration: {
    type: Number,
    required: true,
  },
  warrantyUnit: {
    type: String,
    enum: ['days', 'months', 'years'],
    default: 'years',
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: mongoose.Decimal128,
    default: 0,
  },
  vendor: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['Electronics', 'Appliances', 'Furniture', 'Vehicle', 'Other'],
    default: 'Electronics',
  },
  warrantyImage: {
    type: String,
    default: null,
  },
  notes: {
    type: String,
    default: '',
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

warrantySchema.index({ userId: 1 });
warrantySchema.index({ expiryDate: 1 });
export const Warranty = mongoose.model('Warranty', warrantySchema);

// ============================================
// CSV Import Log Model (Phase 6)
// ============================================
export const csvImportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  totalRows: {
    type: Number,
    required: true,
  },
  successfulImports: {
    type: Number,
    default: 0,
  },
  failedRows: [{
    rowNumber: Number,
    reason: String,
  }],
  importedTransactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  }],
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
}, { timestamps: true });

csvImportSchema.index({ userId: 1 });
csvImportSchema.index({ createdAt: 1 });
export const CSVImport = mongoose.model('CSVImport', csvImportSchema);
