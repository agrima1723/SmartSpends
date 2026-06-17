// import express from 'express';
// import mongoose from 'mongoose';

// const router = express.Router();

// // Fetch your transaction model directly from Mongoose's cache safely
// const Transaction = mongoose.models.Transaction || mongoose.model('Transaction');

// // Note: Mounted as app.use('/api/analytics', analyticsRoutes) in your server.js,
// // so change the internal endpoint string to '/' to handle matching incoming requests
// router.get('/', async (req, res, next) => {
//   try {
//     const { range } = req.query;
//     let startDate = new Date();

//     // 1. Establish date query windows
//     if (range === 'week') {
//       startDate.setDate(startDate.getDate() - 7);
//     } else if (range === 'year') {
//       startDate.setFullYear(startDate.getFullYear() - 1);
//     } else {
//       // Default to 30 days ('month')
//       startDate.setDate(startDate.getDate() - 30);
//     }

//     // 2. Query transactions within range
//     const transactions = await Transaction.find({
//       date: { $gte: startDate }
//     }).sort({ date: 1 });

//     // 3. Aggregate Top-level Card Summaries
//     let totalIncome = 0;
//     let totalExpense = 0;
//     const categoriesMap = {};
//     const timelineMap = {};

//     transactions.forEach(t => {
//       const amount = Math.abs(t.amount || 0);
//       const dateString = t.date 
//         ? new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
//         : 'Unknown Date';
      
//       // Initialize dynamic time series buckets
//       if (!timelineMap[dateString]) {
//         timelineMap[dateString] = { label: dateString, income: 0, expense: 0 };
//       }

//       const type = String(t.type || '').toLowerCase();
//       if (type === 'income') {
//         totalIncome += amount;
//         timelineMap[dateString].income += amount;
//       } else {
//         totalExpense += amount;
//         timelineMap[dateString].expense += amount;
        
//         // Categorized object sorting
//         const cat = t.category || 'other';
//         categoriesMap[cat] = (categoriesMap[cat] || 0) + amount;
//       }
//     });

//     const totalSavings = totalIncome - totalExpense;
//     const savingsRate = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

//     // 4. Map categories breakdown array
//     const categoryBreakdown = Object.keys(categoriesMap).map(cat => {
//       const amt = categoriesMap[cat];
//       return {
//         category: cat,
//         amount: amt,
//         percentage: totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0
//       };
//     }).sort((a, b) => b.amount - a.amount);

//     // 5. Build dynamic Income vs Expense trend graphs and running Balance line
//     const incomeVsExpense = Object.values(timelineMap).map(item => ({
//       label: item.label,
//       income: item.income,
//       expense: item.expense
//     }));

//     let rollingBalance = 0;
//     const cashFlow = Object.values(timelineMap).map(item => {
//       rollingBalance += (item.income - item.expense);
//       return {
//         date: item.label,
//         balance: rollingBalance
//       };
//     });

//     // Send uniform payload back matching frontend component
//     res.json({
//       summary: {
//         income: totalIncome,
//         expense: totalExpense,
//         savings: totalSavings,
//         savingsRate: savingsRate
//       },
//       incomeVsExpense,
//       categoryBreakdown,
//       cashFlow
//     });

//   } catch (error) {
//     // Let your server.js error middleware catch the exception automatically
//     next(error); 
//   }
// });

// export default router;

import express from 'express';
import mongoose from 'mongoose';
import { verifyToken } from './middleware.js'; // Stepping up out of the routes directory correctly

const router = express.Router();

// Mount authentication gate middleware
router.use(verifyToken);

// Dynamically reference models from the Mongoose internal active runtime cache
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction');
const Account = mongoose.models.Account || mongoose.model('Account');

// Ultra-safe numeric parsing helper handling standard numbers, strings, and MongoDB Decimal128 formats
const cleanValue = (val) => {
  if (val == null) return 0;
  if (typeof val === 'object' && '$numberDecimal' in val) {
    return parseFloat(val.$numberDecimal) || 0;
  }
  return parseFloat(val) || 0;
};

router.get('/', async (req, res, next) => {
  try {
    const { range } = req.query;
    const now = new Date();
    let startDate = new Date();

    // 1. Configure the target data windows based on the request query parameter
    if (range === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (range === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else {
      startDate.setDate(now.getDate() - 30); // Defaulting safely to 'month'
    }

    // 2. Fetch all matching ledger events for this specific individual user ID
    // Using populated category tracking to gracefully pull custom category layouts
    const transactions = await Transaction.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: now }
    })
    .populate('categoryId')
    .sort({ date: 1 });

    // 3. Fetch current absolute status metrics of accounts for real balancing
    const accounts = await Account.find({ userId: req.userId });
    const baselineCurrentBalance = accounts.reduce((sum, acc) => {
      return sum + cleanValue(acc.balance ?? acc.initialBalance ?? 0);
    }, 0);

    let totalIncome = 0;
    let totalExpense = 0;
    const categoriesMap = {};
    const timelineMap = {};

    // 4. Pre-fill chronological date buckets so graph displays stay uniform and continuous
    const indexDate = new Date(startDate);
    const labelOptions = range === 'year' 
      ? { month: 'short' } 
      : { month: 'short', day: 'numeric' };

    while (indexDate <= now) {
      const stepLabel = indexDate.toLocaleDateString('en-US', labelOptions);
      timelineMap[stepLabel] = { label: stepLabel, income: 0, expense: 0, delta: 0 };
      
      if (range === 'year') {
        indexDate.setMonth(indexDate.getMonth() + 1);
      } else {
        indexDate.setDate(indexDate.getDate() + 1);
      }
    }

    // 5. Aggregate transactional value entries into structured visual summaries
    transactions.forEach(t => {
      if (!t.date) return;
      
      const rawAmt = cleanValue(t.convertedAmount ?? t.amount ?? 0);
      const parsedAmount = Math.abs(rawAmt);
      const dateLabel = new Date(t.date).toLocaleDateString('en-US', labelOptions);

      // Create fallback layout targets if an edge runtime record escapes bounds boundaries
      if (!timelineMap[dateLabel]) {
        timelineMap[dateLabel] = { label: dateLabel, income: 0, expense: 0, delta: 0 };
      }

      const txType = String(t.type || '').toLowerCase().trim();
      
      if (txType === 'income') {
        totalIncome += parsedAmount;
        timelineMap[dateLabel].income += parsedAmount;
        timelineMap[dateLabel].delta += parsedAmount;
      } else if (txType === 'expense') {
        totalExpense += parsedAmount;
        timelineMap[dateLabel].expense += parsedAmount;
        timelineMap[dateLabel].delta -= parsedAmount;

        // Extract categorization labels from nested populated records or fallbacks safely
        const categoryName = t.categoryId?.name || t.category || 'Other';
        categoriesMap[categoryName] = (categoriesMap[categoryName] || 0) + parsedAmount;
      }
    });

    const totalSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((totalSavings / totalIncome) * 100)) : 0;

    // 6. Restructure categorization maps into clean payload layouts for Recharts UI loops
    const categoryBreakdown = Object.entries(categoriesMap).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0
    })).sort((a, b) => b.amount - a.amount);

    const incomeVsExpense = Object.values(timelineMap);

    // 7. Track chronological ledger values backwards starting from the actual current base
    let rollingTrackBalance = baselineCurrentBalance;
    const cashFlow = [...incomeVsExpense].reverse().map(point => {
      const pointValue = rollingTrackBalance;
      rollingTrackBalance -= point.delta; // Reverse-engineer structural tracking steps
      return {
        date: point.label,
        balance: Math.max(0, Math.round(pointValue * 100) / 100)
      };
    }).reverse();

    // 8. Return synchronized JSON response block mapping the exact dashboard format specs
    res.json({
      summary: {
        income: totalIncome,
        expense: totalExpense,
        savings: totalSavings,
        savingsRate: savingsRate
      },
      incomeVsExpense,
      categoryBreakdown,
      cashFlow
    });

  } catch (error) {
    console.error('Core Analytical Calculation Sequence Faulted:', error);
    next(error);
  }
});

export default router;