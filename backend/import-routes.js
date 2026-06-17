import express from 'express';
import { verifyToken } from './middleware.js';
import {
  uploadCSV,
  getImportHistory,
  getImportDetails,
  getTemplateCSV,
} from './import-controller.js';

const router = express.Router();
router.use(verifyToken);

router.post('/upload', uploadCSV);
router.get('/history', getImportHistory);
router.get('/template', getTemplateCSV);
router.get('/:id', getImportDetails);

export default router;
