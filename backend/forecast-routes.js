// ============================================
// Forecast Routes - Phase 4
// ============================================
import express from 'express';
import { verifyToken } from './middleware.js';
import {
  generateForecast,
  getLatestForecast,
  getForecastHistory,
  getForecastByPeriod,
  getSpendingTrend,
} from './forecast-controller.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// ============================================
// POST /api/forecasts
// Generate a new forecast
// ============================================
router.post('/', generateForecast);

// ============================================
// GET /api/forecasts/latest
// Get the latest forecast
// ============================================
router.get('/latest', getLatestForecast);

// ============================================
// GET /api/forecasts/history
// Get forecast history
// ============================================
router.get('/history', getForecastHistory);

// ============================================
// GET /api/forecasts/period/:period
// Get forecast by specific period
// ============================================
router.get('/period/:period', getForecastByPeriod);

// ============================================
// GET /api/forecasts/trend
// Get spending trend analysis
// ============================================
router.get('/trend', getSpendingTrend);

export default router;
