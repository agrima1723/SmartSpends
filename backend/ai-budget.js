// import express from 'express';
// import mongoose from 'mongoose';
// import { GoogleGenAI } from '@google/genai';
// import { verifyToken } from './middleware.js'; // Points directly to your secure auth file

// const router = express.Router();
// router.use(verifyToken);

// // Initialize the Gemini Client layer using the environment variable string
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// const Transaction = mongoose.models.Transaction || mongoose.model('Transaction');

// // 🛡️ Safe 50/30/20 algorithm backup plan if the API crashes or hits a rate limit
// const generateRuleBasedFallback = (monthlyIncome, savingsTarget) => {
//   const income = parseFloat(monthlyIncome) || 2000;
//   const targetSavings = parseFloat(savingsTarget) || (income * 0.20);

//   const remaining = income - targetSavings;
//   const needsAlloc = Math.max(0, remaining * 0.625); // ~50% allocation
//   const wantsAlloc = Math.max(0, remaining * 0.375); // ~30% allocation

//   return {
//     allocations: [
//       { category: "Core Needs (Housing, Utilities, Food)", amount: Math.round(needsAlloc), percentage: Math.round((needsAlloc / income) * 100) },
//       { category: "Lifestyle Wants (Entertainment, Dining)", amount: Math.round(wantsAlloc), percentage: Math.round((wantsAlloc / income) * 100) },
//       { category: "Goal Savings & Investing", amount: Math.round(targetSavings), percentage: Math.round((targetSavings / income) * 100) }
//     ],
//     insights: [
//       "⚠️ The AI planner is experiencing heavy traffic, so we've generated a classic 50/30/20 foundational budget blueprint for you instead.",
//       `Based on your input, we prioritized your target savings of $${targetSavings} first to protect your financial goals.`,
//       "Action step: Allocate half of your incoming cash flow to core necessities, reserving the rest for flexible personal lifestyle choices."
//     ]
//   };
// };

// router.post('/generate-plan', async (req, res, next) => {
//   const { monthlyIncome, financialGoal, savingsTarget } = req.body;

//   try {
//     // 1. Gather historical ledger profiles over the past 30 days
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
//     const transactions = await Transaction.find({ 
//       userId: req.userId, 
//       date: { $gte: thirtyDaysAgo } 
//     });

//     const historySummary = {};
//     transactions.forEach(t => {
//       if (String(t.type).toLowerCase() === 'expense') {
//         const cat = t.category || 'Other';
//         historySummary[cat] = (historySummary[cat] || 0) + Math.abs(parseFloat(t.amount) || 0);
//       }
//     });

//     // 2. Draft the high-context system prompt instructions
//     const prompt = `
//       You are an expert financial advisor AI. Generate a personalized monthly budget plan based on this user data:
//       - Primary Monthly Income: $${monthlyIncome}
//       - Main Financial Goal: "${financialGoal}"
//       - Desired Monthly Savings Target: $${savingsTarget}
//       - Actual Spending over the last 30 days by category: ${JSON.stringify(historySummary)}

//       Requirements:
//       1. Distribute the income safely across realistic categories (Housing, Food, Utilities, Transport, Entertainment, Insurance, Savings).
//       2. Keep the recommended allocations perfectly sum up to or below the Monthly Income.
//       3. Provide 3 highly specific, actionable financial tips tailored to their spending history and goal.

//       You MUST respond ONLY with a JSON object matching this exact structure:
//       {
//         "allocations": [
//           { "category": "Food", "amount": 400, "percentage": 10 },
//           { "category": "Savings", "amount": 500, "percentage": 12.5 }
//         ],
//         "insights": [
//           "Tip 1...",
//           "Tip 2..."
//         ]
//       }
//     `;

//     // 3. Dispatch data processing target directly to Gemini 2.5 Flash
//     // ✅ Corrected SDK Request Format
// const response = await ai.models.generateContent({
//   model: 'gemini-2.5-flash',
//   contents: prompt,
//   // Change 'config' to 'generationConfig'
//   generationConfig: {
//     responseMimeType: 'application/json',
//   }
// });

//     const budgetPlan = JSON.parse(response.text);
//     res.json(budgetPlan);

//   } catch (error) {
//     console.warn('Gemini Service Limit reached or down. Activating math-based safety fallback...', error.message);
    
//     // Smooth fallback intercept: user's flow continues uninterrupted if Google's network fails
//     const fallbackPlan = generateRuleBasedFallback(monthlyIncome, savingsTarget);
//     res.json(fallbackPlan);
//   }
// });

// export default router;

import express from 'express';
import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';
import { verifyToken } from './middleware.js'; // Points directly to your secure auth file

const router = express.Router();
router.use(verifyToken);

// Initialize the Gemini Client layer using the environment variable string
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction');

// 🛡️ Safe 50/30/20 algorithm backup plan if the API crashes or hits a rate limit
const generateRuleBasedFallback = (monthlyIncome, savingsTarget) => {
  const income = parseFloat(monthlyIncome) || 2000;
  const targetSavings = parseFloat(savingsTarget) || (income * 0.20);

  const remaining = income - targetSavings;
  const needsAlloc = Math.max(0, remaining * 0.625); // ~50% allocation
  const wantsAlloc = Math.max(0, remaining * 0.375); // ~30% allocation

  return {
    allocations: [
      { category: "Core Needs (Housing, Utilities, Food)", amount: Math.round(needsAlloc), percentage: Math.round((needsAlloc / income) * 100) },
      { category: "Lifestyle Wants (Entertainment, Dining)", amount: Math.round(wantsAlloc), percentage: Math.round((wantsAlloc / income) * 100) },
      { category: "Goal Savings & Investing", amount: Math.round(targetSavings), percentage: Math.round((targetSavings / income) * 100) }
    ],
    insights: [
      "⚠️ The AI planner is experiencing heavy traffic, so we've generated a classic 50/30/20 foundational budget blueprint for you instead.",
      `Based on your input, we prioritized your target savings of $${targetSavings} first to protect your financial goals.`,
      "Action step: Allocate half of your incoming cash flow to core necessities, reserving the rest for flexible personal lifestyle choices."
    ]
  };
};

router.post('/generate-plan', async (req, res, next) => {
  const { monthlyIncome, financialGoal, savingsTarget } = req.body;

  try {
    // 1. Gather historical ledger profiles over the past 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const transactions = await Transaction.find({ 
      userId: req.userId, 
      date: { $gte: thirtyDaysAgo } 
    });

    const historySummary = {};
    transactions.forEach(t => {
      if (String(t.type).toLowerCase() === 'expense') {
        const cat = t.category || 'Other';
        historySummary[cat] = (historySummary[cat] || 0) + Math.abs(parseFloat(t.amount) || 0);
      }
    });

    // 2. Draft the high-context system prompt instructions
    const prompt = `
      You are an expert financial advisor AI. Generate a personalized monthly budget plan based on this user data:
      - Primary Monthly Income: $${monthlyIncome}
      - Main Financial Goal: "${financialGoal}"
      - Desired Monthly Savings Target: $${savingsTarget}
      - Actual Spending over the last 30 days by category: ${JSON.stringify(historySummary)}

      Requirements:
      1. Distribute the income safely across realistic categories (Housing, Food, Utilities, Transport, Entertainment, Insurance, Savings).
      2. Keep the recommended allocations perfectly sum up to or below the Monthly Income.
      3. Provide 3 highly specific, actionable financial tips tailored to their spending history and goal.

      You MUST respond ONLY with a JSON object matching this exact structure:
      {
        "allocations": [
          { "category": "Food", "amount": 400, "percentage": 10 },
          { "category": "Savings", "amount": 500, "percentage": 12.5 }
        ],
        "insights": [
          "Tip 1...",
          "Tip 2..."
        ]
      }
    `;

    // 3. Dispatch data processing target directly to Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    // 🌟 THE BULLETPROOF PARSING FIX: Extract the text cleanly regardless of SDK variation
    let rawText = response.text || (response.candidates?.[0]?.content?.parts?.[0]?.text) || "";
    
    // If Gemini wrapped it in markdown codeblocks out of habit, clean them up!
    if (rawText.includes('```')) {
      rawText = rawText.replace(/```json|```/g, '').trim();
    }

    const budgetPlan = JSON.parse(rawText);
    res.json(budgetPlan);

  } catch (error) {
    console.warn('Gemini Service Limit reached or down. Activating math-based safety fallback...', error.message);
    
    // Smooth fallback intercept: user's flow continues uninterrupted if Google's network fails
    const fallbackPlan = generateRuleBasedFallback(monthlyIncome, savingsTarget);
    res.json(fallbackPlan);
  }
});

export default router;