// ============================================
// Financial Goal Routes - Phase 4
// ============================================
import express from 'express';
import { verifyToken } from './middleware.js';
import {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  deleteGoal,
  addGoalSavings,
  getGoalsByPriority,
  getGoalsSummary,
} from './goal-controller.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// ============================================
// GET /api/goals/summary
// Get goals summary (MUST come before /:id)
// ============================================
router.get('/summary', getGoalsSummary);

// ============================================
// GET /api/goals/priority
// Get goals sorted by priority
// ============================================
router.get('/priority', getGoalsByPriority);

// ============================================
// POST /api/goals
// Create a new goal
// ============================================
router.post('/', createGoal);

// ============================================
// GET /api/goals
// Get all goals
// ============================================
router.get('/', getGoals);

// ============================================
// GET /api/goals/:id
// Get single goal
// ============================================
router.get('/:id', getGoal);

// ============================================
// PATCH /api/goals/:id
// Update goal
// ============================================
router.patch('/:id', updateGoal);

// ============================================
// DELETE /api/goals/:id
// Delete goal
// ============================================
router.delete('/:id', deleteGoal);

// ============================================
// POST /api/goals/:id/save
// Add savings to goal
// ============================================
router.post('/:id/save', addGoalSavings);

export default router;
