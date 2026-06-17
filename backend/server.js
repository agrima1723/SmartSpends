import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './auth-routes.js';
import userRoutes from './user-routes.js';
import aiBudgetRouter from './ai-budget.js';
import accountRoutes from './account-routes.js';
import categoryRoutes from './category-routes.js';
import transactionRoutes from './transaction-routes.js';
import budgetRoutes from './budget-routes.js';
import recurringRoutes from './recurring-routes.js';
import goalRoutes from './goal-routes.js';
import forecastRoutes from './forecast-routes.js';
import analyticsRoutes from './analytics-routes.js';
import groupRoutes from './group-routes.js';
import loyaltyRoutes from './loyalty-routes.js';
import warrantyRoutes from './warranty-routes.js';
import importRoutes from './import-routes.js';
import { checkAndSendBudgetAlerts } from './budget-controller.js';
import { checkAndExecuteAllRecurringTransactions } from './recurring-controller.js';


const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173', 
      'http://localhost:5174',
      'https://smart-spends.vercel.app' // Your production domain
    ];
    
    if (!origin) return callback(null, true);
    
    // 🌟 Check if origin is localhost OR if it contains ".vercel.app"
    if (allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes); 
app.use('/api/ai', aiBudgetRouter);
app.use('/api/recurring', recurringRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/forecasts', forecastRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/warranty', warrantyRoutes);
app.use('/api/import', importRoutes);


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// ============================================
// Database Connection & Server Startup
// ============================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✓ MongoDB connected successfully');

    const PORT = process.env.PORT || 5001;

// Pass '0.0.0.0' as the second argument to listen on all local network interfaces
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);

      
      // Run alert and automation jobs safely now that the DB connection is open
      (async () => {
        try {
          await checkAndSendBudgetAlerts(parseInt(process.env.BUDGET_ALERT_DAYS || '7', 10));
        } catch (err) {
          console.error('Initial budget alert run failed:', err);
        }

        try {
          await checkAndExecuteAllRecurringTransactions();
        } catch (err) {
          console.error('Initial recurring transaction batch run failed:', err);
        }
        
        const intervalMinutes = parseInt(process.env.ALERT_INTERVAL_MINUTES || '60', 10);
        
        // Timer loops for periodic background processing
        setInterval(() => {
          checkAndSendBudgetAlerts().catch(e => console.error('Scheduled budget alert failed:', e));
        }, intervalMinutes * 60 * 1000);

        setInterval(() => {
          checkAndExecuteAllRecurringTransactions().catch(e => console.error('Scheduled recurring automation worker failure:', e));
        }, intervalMinutes * 60 * 1000);
      })();
    });
  })
  .catch(err => {
    console.error('✗ MongoDB connection failed critical error:', err);
  });