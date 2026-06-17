// ============================================
// Budget Controller - Phase 4
// ============================================
import { Budget, Transaction, Category, User } from './models.js';
import sendMail from './mailer.js';

// ============================================
// CREATE BUDGET
// ============================================
export async function createBudget(req, res) {
  try {
    const { category, limit, period = 'monthly', alertThreshold = 75 } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!category || !limit) {
      return res.status(400).json({ error: 'Category and limit are required' });
    }

    if (limit <= 0) {
      return res.status(400).json({ error: 'Limit must be greater than 0' });
    }

    // Check if budget already exists for this category
    const existingBudget = await Budget.findOne({ userId, category, status: 'active' });
    if (existingBudget) {
      return res.status(400).json({ error: `Budget already exists for ${category}` });
    }

    // Create new budget
    const budget = new Budget({
      userId,
      category,
      limit,
      period,
      alertThreshold,
      spent: 0,
      remaining: limit,
      status: 'active',
    });

    await budget.save();
    res.status(201).json({
      message: 'Budget created successfully',
      budget,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET ALL BUDGETS
// ============================================
export async function getBudgets(req, res) {
  try {
    const userId = req.user.id;

    const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });

    res.json({
      count: budgets.length,
      budgets,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET SINGLE BUDGET
// ============================================
export async function getBudget(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const budget = await Budget.findOne({ _id: id, userId });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// UPDATE BUDGET
// ============================================
export async function updateBudget(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { category, limit, period, alertThreshold, status } = req.body;

    const budget = await Budget.findOne({ _id: id, userId });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Update fields
    if (category) budget.category = category;
    if (limit) {
      if (limit <= 0) return res.status(400).json({ error: 'Limit must be greater than 0' });
      budget.limit = limit;
    }
    if (period) budget.period = period;
    if (alertThreshold !== undefined) budget.alertThreshold = alertThreshold;
    if (status) budget.status = status;

    await budget.save();

    res.json({
      message: 'Budget updated successfully',
      budget,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// DELETE BUDGET
// ============================================
export async function deleteBudget(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const budget = await Budget.findOneAndDelete({ _id: id, userId });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json({
      message: 'Budget deleted successfully',
      budget,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET BUDGET PROGRESS (All budgets with spending)
// ============================================
export async function getBudgetProgress(req, res) {
  try {
    const userId = req.user.id;

    // Get all active budgets
    const budgets = await Budget.find({ userId, status: 'active' });

    // For each budget, calculate spending from transactions
    const budgetProgress = await Promise.all(
      budgets.map(async (budget) => {
        // Sum all expenses in this category for the current month
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        const category = await Category.findOne({ name: budget.category, userId });
        const categoryId = category?._id || null;

        const transactions = categoryId
          ? await Transaction.find({
              userId,
              type: 'expense',
              categoryId,
              date: { $gte: startOfMonth },
            })
          : [];

        const spent = transactions.reduce((sum, t) => {
          return sum + parseFloat(t.amount.toString());
        }, 0);

        const remaining = Math.max(0, parseFloat(budget.limit.toString()) - spent);
        const percentage = (spent / parseFloat(budget.limit.toString())) * 100;

        return {
          _id: budget._id,
          category: budget.category,
          limit: budget.limit,
          spent,
          remaining,
          percentage: Math.min(100, percentage),
          alertThreshold: budget.alertThreshold,
          status: percentage >= budget.alertThreshold ? 'alert' : 'normal',
        };
      })
    );

    res.json({
      count: budgetProgress.length,
      budgetProgress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// CHECK AND SEND BUDGET ALERTS (used by scheduled job)
// ============================================
export async function checkAndSendBudgetAlerts(daysAhead = 7) {
  try {
    const now = new Date()
    const alertDate = new Date()
    alertDate.setDate(now.getDate() + daysAhead)

    const budgets = await Budget.find({ status: 'active' })

    for (const budget of budgets) {
      const userId = budget.userId
      const user = await User.findById(userId)
      if (!user || !user.email) continue

      // Check end date
      if (budget.endDate) {
        const end = new Date(budget.endDate)
        if (end >= now && end <= alertDate) {
          const subject = `Budget ending soon: ${budget.category}`
          const text = `Your budget for ${budget.category} ends on ${end.toISOString().split('T')[0]}.` 
          await sendMail({ to: user.email, subject, text })
        }
      }

      // Check spent percentage for current month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const category = await Category.findOne({ name: budget.category, userId })
      const categoryId = category?._id || null
      let spent = 0
      if (categoryId) {
        const txs = await Transaction.find({ userId, type: 'expense', categoryId, date: { $gte: startOfMonth } })
        spent = txs.reduce((s, t) => s + parseFloat(t.amount.toString()), 0)
      }

      const limit = parseFloat(budget.limit.toString()) || 0
      if (limit > 0) {
        const percentage = (spent / limit) * 100
        if (percentage >= (budget.alertThreshold || 75)) {
          const subject = `Budget alert: ${budget.category}`
          const text = `You have used ${percentage.toFixed(1)}% of your budget for ${budget.category} (limit ${limit}).` 
          await sendMail({ to: user.email, subject, text })
        }
      }
    }
  } catch (err) {
    console.error('Budget alert job failed:', err)
    throw err
  }
}

// ============================================
// GET BUDGET BY CATEGORY
// ============================================
export async function getBudgetByCategory(req, res) {
  try {
    const { category } = req.params;
    const userId = req.user.id;

    const budget = await Budget.findOne({ userId, category });

    if (!budget) {
      return res.status(404).json({ error: `No budget found for ${category}` });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// RESET BUDGET (Monthly reset)
// ============================================
export async function resetBudget(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const budget = await Budget.findOne({ _id: id, userId });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Reset spent and remaining
    budget.spent = 0;
    budget.remaining = budget.limit;
    budget.updatedAt = new Date();

    await budget.save();

    res.json({
      message: 'Budget reset successfully',
      budget,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
