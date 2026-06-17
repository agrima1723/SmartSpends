// ============================================
// Financial Goal Controller - Phase 4
// ============================================
import { Goal } from './models.js';

// ============================================
// CREATE GOAL
// ============================================
export async function createGoal(req, res) {
  try {
    const { name, description, icon, color, targetAmount, deadline, category, priority } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!name || !targetAmount || !deadline) {
      return res.status(400).json({ error: 'Name, target amount, and deadline are required' });
    }

    if (targetAmount <= 0) {
      return res.status(400).json({ error: 'Target amount must be greater than 0' });
    }

    const goal = new Goal({
      userId,
      name,
      description: description || '',
      icon: icon || 'Target',
      color: color || '#3B82F6',
      targetAmount,
      deadline: new Date(deadline),
      category: category || 'General',
      priority: priority || 'medium',
      savedAmount: 0,
      status: 'active',
    });

    await goal.save();

    res.status(201).json({
      message: 'Goal created successfully',
      goal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET ALL GOALS
// ============================================
export async function getGoals(req, res) {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const query = { userId };
    if (status) query.status = status;

    const goals = await Goal.find(query).sort({ deadline: 1 });

    // Calculate progress for each goal
    const goalsWithProgress = goals.map(goal => ({
      ...goal.toObject(),
      progress: (parseFloat(goal.savedAmount.toString()) / parseFloat(goal.targetAmount.toString())) * 100,
      remaining: parseFloat(goal.targetAmount.toString()) - parseFloat(goal.savedAmount.toString()),
    }));

    res.json({
      count: goals.length,
      goals: goalsWithProgress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET SINGLE GOAL
// ============================================
export async function getGoal(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const goal = await Goal.findOne({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const progress = (parseFloat(goal.savedAmount.toString()) / parseFloat(goal.targetAmount.toString())) * 100;
    const remaining = parseFloat(goal.targetAmount.toString()) - parseFloat(goal.savedAmount.toString());

    res.json({
      ...goal.toObject(),
      progress,
      remaining,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// UPDATE GOAL
// ============================================
export async function updateGoal(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description, targetAmount, deadline, category, priority, status } = req.body;

    const goal = await Goal.findOne({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    if (name) goal.name = name;
    if (description !== undefined) goal.description = description;
    if (targetAmount) {
      if (targetAmount <= 0) return res.status(400).json({ error: 'Target amount must be greater than 0' });
      goal.targetAmount = targetAmount;
    }
    if (deadline) goal.deadline = new Date(deadline);
    if (category) goal.category = category;
    if (priority) goal.priority = priority;
    if (status) goal.status = status;

    await goal.save();

    res.json({
      message: 'Goal updated successfully',
      goal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// DELETE GOAL
// ============================================
export async function deleteGoal(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const goal = await Goal.findOneAndDelete({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({
      message: 'Goal deleted successfully',
      goal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// ADD SAVINGS TO GOAL
// ============================================
export async function addGoalSavings(req, res) {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const goal = await Goal.findOne({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const currentSaved = parseFloat(goal.savedAmount.toString());
    const newSaved = currentSaved + parseFloat(amount.toString());
    const targetAmount = parseFloat(goal.targetAmount.toString());

    goal.savedAmount = newSaved;

    // Auto-complete if target reached
    if (newSaved >= targetAmount) {
      goal.status = 'completed';
    }

    await goal.save();

    const progress = (newSaved / targetAmount) * 100;

    res.json({
      message: 'Savings added successfully',
      goal,
      progress,
      remaining: targetAmount - newSaved,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET GOALS BY PRIORITY
// ============================================
export async function getGoalsByPriority(req, res) {
  try {
    const userId = req.user.id;

    const goals = await Goal.find({ userId, status: 'active' }).sort({ priority: -1 });

    const goalsWithProgress = goals.map(goal => ({
      ...goal.toObject(),
      progress: (parseFloat(goal.savedAmount.toString()) / parseFloat(goal.targetAmount.toString())) * 100,
      remaining: parseFloat(goal.targetAmount.toString()) - parseFloat(goal.savedAmount.toString()),
    }));

    res.json({
      count: goals.length,
      goals: goalsWithProgress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET GOALS SUMMARY
// ============================================
export async function getGoalsSummary(req, res) {
  try {
    const userId = req.user.id;

    const goals = await Goal.find({ userId });

    const summary = {
      total: goals.length,
      active: goals.filter(g => g.status === 'active').length,
      completed: goals.filter(g => g.status === 'completed').length,
      abandoned: goals.filter(g => g.status === 'abandoned').length,
      totalTarget: goals.reduce((sum, g) => sum + parseFloat(g.targetAmount.toString()), 0),
      totalSaved: goals.reduce((sum, g) => sum + parseFloat(g.savedAmount.toString()), 0),
      overallProgress: goals.length > 0
        ? (goals.reduce((sum, g) => sum + parseFloat(g.savedAmount.toString()), 0) / 
           goals.reduce((sum, g) => sum + parseFloat(g.targetAmount.toString()), 0)) * 100
        : 0,
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
