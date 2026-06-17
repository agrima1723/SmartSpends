import express from 'express';
import { verifyToken } from './middleware.js';
import {
  createGroup,
  getMyGroups,
  joinGroup,
  getGroup,
  deleteGroup,
  addExpense,
  getExpenses,
  getSettlements,
  settleDebt,
} from './group-controller.js';

const router = express.Router();
router.use(verifyToken);

router.post('/', createGroup);
router.post('/join', joinGroup);
router.get('/', getMyGroups);
router.get('/:id', getGroup);
router.delete('/:id', deleteGroup);

router.post('/:groupId/expenses', addExpense);
router.get('/:groupId/expenses', getExpenses);
router.get('/:groupId/settlements', getSettlements);
router.post('/settlement/:settlementId/settle', settleDebt);

export default router;
