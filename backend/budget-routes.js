// ============================================
// Budget Routes - Phase 4
// ============================================
import express from 'express';
import { verifyToken } from './middleware.js';
import {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
  getBudgetByCategory,
  resetBudget,
} from './budget-controller.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// ============================================
// POST /api/budgets
// Create a new budget
// ============================================
router.post('/', createBudget);

// ============================================
// GET /api/budgets
// Get all budgets for authenticated user
// ============================================
router.get('/', getBudgets);

// ============================================
// GET /api/budgets/progress
// Get all budgets with spending progress
// ============================================
router.get('/progress', getBudgetProgress);

// ============================================
// GET /api/budgets/category/:category
// Get budget by category name
// ============================================
router.get('/category/:category', getBudgetByCategory);

// ============================================
// GET /api/budgets/:id
// Get single budget by ID
// ============================================
router.get('/:id', getBudget);

// ============================================
// PATCH /api/budgets/:id
// Update budget
// ============================================
router.patch('/:id', updateBudget);

// ============================================
// DELETE /api/budgets/:id
// Delete budget
// ============================================
router.delete('/:id', deleteBudget);

// ============================================
// POST /api/budgets/:id/reset
// Reset budget (clear spent amount)
// ============================================
router.post('/:id/reset', resetBudget);

export default router;
