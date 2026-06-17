import { Group, GroupExpense, Settlement, User } from './models.js';
import crypto from 'crypto';

// ============================================
// CREATE GROUP
// ============================================
export async function createGroup(req, res) {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) return res.status(400).json({ error: 'Group name required' });

    const joinCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const group = new Group({
      name,
      description: description || '',
      createdBy: userId,
      members: [{ userId, role: 'admin' }],
      joinCode,
    });

    await group.save();
    res.status(201).json({ message: 'Group created', group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET MY GROUPS
// ============================================
export async function getMyGroups(req, res) {
  try {
    const userId = req.user.id;

    const groups = await Group.find({
      'members.userId': userId,
      isActive: true,
    }).populate('createdBy', 'displayName');

    res.json({ count: groups.length, groups });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// JOIN GROUP BY CODE
// ============================================
export async function joinGroup(req, res) {
  try {
    const { joinCode } = req.body;
    const userId = req.user.id;

    if (!joinCode) return res.status(400).json({ error: 'Join code required' });

    const group = await Group.findOne({ joinCode });

    if (!group) {
      return res.status(404).json({ error: 'Invalid join code' });
    }

    const alreadyMember = group.members.find(m => m.userId.toString() === userId);
    if (alreadyMember) {
      return res.status(400).json({ error: 'Already a member' });
    }

    group.members.push({ userId, role: 'member' });
    await group.save();

    res.json({ message: 'Joined group', group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET GROUP DETAILS
// ============================================
export async function getGroup(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(id)
      .populate('createdBy', 'displayName')
      .populate('members.userId', 'displayName email');

    if (!group) return res.status(404).json({ error: 'Group not found' });

    const isMember = group.members.find(m => m.userId._id.toString() === userId);
    if (!isMember) return res.status(403).json({ error: 'Not a member' });

    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// DELETE GROUP
// ============================================
export async function deleteGroup(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(id);

    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (group.createdBy.toString() !== userId) {
      return res.status(403).json({ error: 'Only admin can delete' });
    }

    group.isActive = false;
    await group.save();

    res.json({ message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// ADD GROUP EXPENSE
// ============================================
export async function addExpense(req, res) {
  try {
    const { groupId, description, amount, splitType, splits } = req.body;
    const userId = req.user.id;

    if (!groupId || !description || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const expense = new GroupExpense({
      groupId,
      paidBy: userId,
      description,
      amount,
      splitType: splitType || 'equal',
      splits: splits || group.members.map(m => ({
        userId: m.userId,
        amount: parseFloat(amount.toString()) / group.members.length,
      })),
    });

    await expense.save();

    // Calculate settlements
    await calculateSettlements(groupId);

    res.status(201).json({ message: 'Expense added', expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET GROUP EXPENSES
// ============================================
export async function getExpenses(req, res) {
  try {
    const { groupId } = req.params;

    const expenses = await GroupExpense.find({ groupId })
      .populate('paidBy', 'displayName')
      .populate('splits.userId', 'displayName')
      .sort({ createdAt: -1 });

    res.json({ count: expenses.length, expenses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET SETTLEMENTS
// ============================================
export async function getSettlements(req, res) {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const settlements = await Settlement.find({
      groupId,
      $or: [{ fromUser: userId }, { toUser: userId }],
    })
      .populate('fromUser', 'displayName')
      .populate('toUser', 'displayName')
      .sort({ status: 1 });

    res.json({ count: settlements.length, settlements });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// SETTLE DEBT
// ============================================
export async function settleDebt(req, res) {
  try {
    const { settlementId } = req.params;
    const userId = req.user.id;

    const settlement = await Settlement.findById(settlementId);

    if (!settlement) return res.status(404).json({ error: 'Settlement not found' });
    if (settlement.toUser.toString() !== userId) {
      return res.status(403).json({ error: 'Only creditor can settle' });
    }

    settlement.status = 'settled';
    settlement.settledAt = new Date();
    await settlement.save();

    res.json({ message: 'Debt settled', settlement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// CALCULATE SETTLEMENTS
// ============================================
async function calculateSettlements(groupId) {
  try {
    const expenses = await GroupExpense.find({ groupId });
    const group = await Group.findById(groupId);

    // Initialize balances
    const balances = {};
    group.members.forEach(m => {
      balances[m.userId.toString()] = 0;
    });

    // Calculate what each person owes/is owed
    expenses.forEach(expense => {
      const paidBy = expense.paidBy.toString();
      balances[paidBy] += parseFloat(expense.amount.toString());

      expense.splits.forEach(split => {
        const userId = split.userId.toString();
        balances[userId] -= parseFloat(split.amount.toString());
      });
    });

    // Clear existing pending settlements
    await Settlement.deleteMany({ groupId, status: 'pending' });

    // Create new settlements
    const creditors = Object.entries(balances).filter(([_, b]) => b > 0);
    const debtors = Object.entries(balances).filter(([_, b]) => b < 0);

    for (const [creditor, credit] of creditors) {
      for (const [debtor, debt] of debtors) {
        const amount = Math.min(credit, Math.abs(debt));
        if (amount > 0) {
          new Settlement({
            groupId,
            fromUser: debtor,
            toUser: creditor,
            amount: Math.round(amount * 100) / 100,
            status: 'pending',
          }).save();
        }
      }
    }
  } catch (error) {
    console.error('Error calculating settlements:', error);
  }
}
