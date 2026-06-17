import express from 'express';
import { verifyToken } from './middleware.js';
import {
  createWarranty,
  getMyWarranties,
  getWarranty,
  updateWarranty,
  deleteWarranty,
  getExpiringWarranties,
} from './warranty-controller.js';

const router = express.Router();
router.use(verifyToken);

router.get('/expiring/soon', getExpiringWarranties);
router.post('/', createWarranty);
router.get('/', getMyWarranties);
router.get('/:id', getWarranty);
router.put('/:id', updateWarranty);
router.delete('/:id', deleteWarranty);

export default router;
