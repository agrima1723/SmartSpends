// ============================================
// Forecast Controller - Phase 4
// ============================================
import { Forecast, Transaction, Account, RecurringTransaction } from './models.js';

// ============================================
// GENERATE FORECAST
// ============================================
export async function generateForecast(req, res) {
  try {
    const userId = req.user.id;
    const { period = '30days' } = req.body;

    // Get current balance from all accounts
    const accounts = await Account.find({ userId, isActive: true });
    const currentBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.initialBalance.toString()), 0);

    // Calculate average daily spending from transactions in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentTransactions = await Transaction.find({
      userId,
      date: { $gte: thirtyDaysAgo },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    recentTransactions.forEach(t => {
      const amount = parseFloat(t.amount.toString());
      if (t.type === 'income') {
        totalIncome += amount;
      } else if (t.type === 'expense') {
        totalExpense += amount;
      }
    });

    const averageDailyIncome = totalIncome / 30;
    const averageDailySpend = totalExpense / 30;

    // Get recurring transactions for projection
    const recurringList = await RecurringTransaction.find({ userId, isActive: true });

    let projectedIncome = averageDailyIncome;
    let projectedExpense = averageDailySpend;

    recurringList.forEach(r => {
      const amount = parseFloat(r.amount.toString());
      if (r.type === 'income') {
        projectedIncome += amount;
      } else {
        projectedExpense += amount;
      }
    });

    // Calculate based on period
    let daysInPeriod = 30;
    if (period === '7days') {
      daysInPeriod = 7;
      projectedIncome = (averageDailyIncome + recurringList
        .filter(r => r.type === 'income')
        .reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0)) * 7;
      projectedExpense = (averageDailySpend + recurringList
        .filter(r => r.type === 'expense')
        .reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0)) * 7;
    } else if (period === '90days') {
      daysInPeriod = 90;
      projectedIncome = (averageDailyIncome + recurringList
        .filter(r => r.type === 'income')
        .reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0)) * 90;
      projectedExpense = (averageDailySpend + recurringList
        .filter(r => r.type === 'expense')
        .reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0)) * 90;
    }

    const projectedBalance = currentBalance + projectedIncome - projectedExpense;

    // Determine risk level
    let riskLevel = 'low';
    if (projectedBalance < 0) {
      riskLevel = 'high';
    } else if (projectedBalance < currentBalance * 0.25) {
      riskLevel = 'medium';
    }

    const forecast = new Forecast({
      userId,
      period,
      projectedIncome,
      projectedExpense,
      projectedBalance,
      currentBalance,
      averageDailySpend,
      averageDailyIncome,
      riskLevel,
    });

    await forecast.save();

    res.status(201).json({
      message: 'Forecast generated successfully',
      forecast,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET LATEST FORECAST
// ============================================
export async function getLatestForecast(req, res) {
  try {
    const userId = req.user.id;

    const forecast = await Forecast.findOne({ userId }).sort({ generatedAt: -1 });

    if (!forecast) {
      return res.status(404).json({ error: 'No forecast found. Please generate one first.' });
    }

    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET FORECAST HISTORY
// ============================================
export async function getForecastHistory(req, res) {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const forecasts = await Forecast.find({ userId })
      .sort({ generatedAt: -1 })
      .limit(parseInt(limit));

    res.json({
      count: forecasts.length,
      forecasts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET FORECAST BY PERIOD
// ============================================
export async function getForecastByPeriod(req, res) {
  try {
    const userId = req.user.id;
    const { period } = req.params;

    const forecast = await Forecast.findOne({ userId, period }).sort({ generatedAt: -1 });

    if (!forecast) {
      return res.status(404).json({ error: `No forecast found for period ${period}` });
    }

    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// GET SPENDING TREND
// ============================================
export async function getSpendingTrend(req, res) {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const transactions = await Transaction.find({
      userId,
      type: 'expense',
      date: { $gte: startDate },
    }).sort({ date: 1 });

    // Group by date
    const trendData = {};
    transactions.forEach(t => {
      const date = t.date.toISOString().split('T')[0];
      if (!trendData[date]) {
        trendData[date] = 0;
      }
      trendData[date] += parseFloat(t.amount.toString());
    });

    // Calculate cumulative
    let cumulative = 0;
    const trend = Object.entries(trendData).map(([date, amount]) => {
      cumulative += amount;
      return { date, daily: amount, cumulative };
    });

    res.json({
      count: trend.length,
      trend,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
