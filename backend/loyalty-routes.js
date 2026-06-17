import express from 'express';
import { verifyToken } from './middleware.js';
import {
  createLoyaltyCard,
  getMyLoyaltyCards,
  getLoyaltyCard,
  updateLoyaltyCard,
  deleteLoyaltyCard,
  addPoints,
} from './loyalty-controller.js';

const router = express.Router();
router.use(verifyToken);

router.post('/', createLoyaltyCard);
router.get('/', getMyLoyaltyCards);
router.get('/:id', getLoyaltyCard);
router.put('/:id', updateLoyaltyCard);
router.delete('/:id', deleteLoyaltyCard);
router.post('/:id/points', addPoints);

export default router;
