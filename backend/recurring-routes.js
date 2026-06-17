// ============================================
// Recurring Transaction Routes - Phase 4
// ============================================
import express from 'express';
import { verifyToken } from './middleware.js';
import {
  createRecurring,
  getRecurringTransactions,
  getRecurring,
  updateRecurring,
  deleteRecurring,
  toggleRecurring,
  getUpcomingRecurring,
  executeRecurring,
} from './recurring-controller.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// ============================================
// POST /api/recurring
// Create a new recurring transaction
// ============================================
router.post('/', createRecurring);

// ============================================
// GET /api/recurring
// Get all recurring transactions
// ============================================
router.get('/', getRecurringTransactions);

// ============================================
// GET /api/recurring/upcoming
// Get upcoming recurring transactions
// ============================================
router.get('/upcoming', getUpcomingRecurring);

// ============================================
// GET /api/recurring/:id
// Get single recurring transaction
// ============================================
router.get('/:id', getRecurring);

// ============================================
// PATCH /api/recurring/:id
// Update recurring transaction
// ============================================
router.patch('/:id', updateRecurring);

// ============================================
// DELETE /api/recurring/:id
// Delete recurring transaction
// ============================================
router.delete('/:id', deleteRecurring);

// ============================================
// POST /api/recurring/:id/toggle
// Toggle recurring transaction status
// ============================================
router.post('/:id/toggle', toggleRecurring);

// ============================================
// POST /api/recurring/execute
// Execute all due recurring transactions
// ============================================
router.post('/execute/now', executeRecurring);

export default router;
