// import React, { useState, useEffect } from 'react'
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts'
// import { TrendingUp, TrendingDown, Target } from 'lucide-react'

// export default function Analytics() {
//   const [data, setData] = useState(null)
//   const [dateRange, setDateRange] = useState('month')
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchAnalyticsData()
//   }, [dateRange])

//   const fetchAnalyticsData = async () => {
//     setLoading(true)
//     try {
//       // Mock data
//       const mockData = {
//         summary: {
//           income: 5000,
//           expense: 1500,
//           savings: 3500,
//           savingsRate: 70,
//         },
//         incomeVsExpense: [
//           { month: 'Jan', income: 4500, expense: 1200 },
//           { month: 'Feb', income: 4800, expense: 1400 },
//           { month: 'Mar', income: 5000, expense: 1500 },
//           { month: 'Apr', income: 5200, expense: 1600 },
//           { month: 'May', income: 5000, expense: 1500 },
//         ],
//         categoryBreakdown: [
//           { category: 'Food', amount: 500, percentage: 33 },
//           { category: 'Transport', amount: 300, percentage: 20 },
//           { category: 'Entertainment', amount: 200, percentage: 13 },
//           { category: 'Utilities', amount: 400, percentage: 27 },
//           { category: 'Other', amount: 100, percentage: 7 },
//         ],
//         cashFlow: [
//           { day: 'Day 1', balance: 10500 },
//           { day: 'Day 5', balance: 10800 },
//           { day: 'Day 10', balance: 11200 },
//           { day: 'Day 15', balance: 12500 },
//           { day: 'Day 20', balance: 11900 },
//           { day: 'Day 25', balance: 12350 },
//           { day: 'Day 30', balance: 12500 },
//         ],
//       }
//       setData(mockData)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   if (!data) return null

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
//           <p className="text-slate-600 dark:text-slate-400 mt-1">
//             Financial insights and trends
//           </p>
//         </div>

//         <select
//           value={dateRange}
//           onChange={(e) => setDateRange(e.target.value)}
//           className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="week">This Week</option>
//           <option value="month">This Month</option>
//           <option value="quarter">This Quarter</option>
//           <option value="year">This Year</option>
//         </select>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-slate-600 dark:text-slate-400 text-sm">Total Income</p>
//               <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
//                 ${data.summary.income}
//               </p>
//             </div>
//             <TrendingUp className="text-green-500 opacity-20 w-8 h-8" />
//           </div>
//         </div>

//         <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-slate-600 dark:text-slate-400 text-sm">Total Expense</p>
//               <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
//                 ${data.summary.expense}
//               </p>
//             </div>
//             <TrendingDown className="text-red-500 opacity-20 w-8 h-8" />
//           </div>
//         </div>

//         <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-slate-600 dark:text-slate-400 text-sm">Net Savings</p>
//               <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
//                 ${data.summary.savings}
//               </p>
//             </div>
//             <Target className="text-blue-500 opacity-20 w-8 h-8" />
//           </div>
//         </div>

//         <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-slate-600 dark:text-slate-400 text-sm">Savings Rate</p>
//               <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
//                 {data.summary.savingsRate}%
//               </p>
//             </div>
//             <div className="text-purple-500 opacity-20 w-8 h-8">📊</div>
//           </div>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Income vs Expense */}
//         <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//           <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
//             Income vs Expense Trend
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={data.incomeVsExpense}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
//               <XAxis dataKey="month" stroke="#9CA3AF" />
//               <YAxis stroke="#9CA3AF" />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: '#1F2937',
//                   border: 'none',
//                   borderRadius: '8px',
//                 }}
//                 formatter={(value) => `$${value}`}
//               />
//               <Legend />
//               <Bar dataKey="income" fill="#10B981" />
//               <Bar dataKey="expense" fill="#EF4444" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Cash Flow Forecast */}
//         <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//           <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
//             Cash Flow Forecast
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data.cashFlow}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
//               <XAxis dataKey="day" stroke="#9CA3AF" />
//               <YAxis stroke="#9CA3AF" />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: '#1F2937',
//                   border: 'none',
//                   borderRadius: '8px',
//                 }}
//                 formatter={(value) => `$${value}`}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="balance"
//                 stroke="#3B82F6"
//                 strokeWidth={2}
//                 dot={{ fill: '#3B82F6', r: 5 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Category Breakdown */}
//       <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//         <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
//           Category Breakdown
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           {data.categoryBreakdown.map((item, idx) => (
//             <div
//               key={idx}
//               className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <p className="font-medium text-slate-900 dark:text-white">
//                   {item.category}
//                 </p>
//                 <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
//                   {item.percentage}%
//                 </span>
//               </div>
//               <p className="text-2xl font-bold text-slate-900 dark:text-white">
//                 ${item.amount}
//               </p>
//               <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
//                 <div
//                   className="bg-blue-500 h-2 rounded-full"
//                   style={{ width: `${item.percentage}%` }}
//                 ></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Insights */}
//       <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
//         <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
//           💡 Financial Insights
//         </h3>
//         <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
//           <li>✅ Great savings rate! You're saving 70% of your income.</li>
//           <li>📈 Your expenses are trending down this month.</li>
//           <li>🎯 Focus on reducing food expenses to reach your goals.</li>
//           <li>💰 Projected monthly savings: $3,500</li>
//         </ul>
//       </div>
//     </div>
//   )
// }
//2
// import React, { useState, useEffect } from 'react'
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
// } from 'recharts'
// import { TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react'

// export default function Analytics() {
//   const [data, setData] = useState(null)
//   const [dateRange, setDateRange] = useState('month')
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     fetchAnalyticsData()
//   }, [dateRange])

//   const fetchAnalyticsData = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       // Hits your Vite proxy configured to backend port 5001
//       const response = await fetch(`/api/analytics?range=${dateRange}`)
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch real-time analytics calculations')
//       }

//       const realData = await response.json()
//       setData(realData)
//     } catch (err) {
//       console.error('Analytics Error:', err)
//       setError(err.message || 'Something went wrong fetching data.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 space-y-4 text-center">
//         <AlertCircle className="w-12 h-12 text-red-500" />
//         <p className="text-slate-800 dark:text-slate-200 font-medium">{error}</p>
//         <button 
//           onClick={fetchAnalyticsData}
//           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
//         >
//           Try Again
//         </button>
//       </div>
//     )
//   }

//   if (!data) return null

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold  dark:text-white dark:text-white">Analytics</h1>
//           <p className="text-slate-600 dark:text-slate-400 mt-1">
//             Financial insights and trends from your live data
//           </p>
//         </div>

//         <select
//           value={dateRange}
//           onChange={(e) => setDateRange(e.target.value)}
//           className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="week">This Week</option>
//           <option value="month">This Month</option>
//           <option value="year">This Year</option>
//         </select>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-slate-600 dark:text-slate-400 text-sm">Total Income</p>
//               <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
//                 ${data.summary.income.toLocaleString()}
//               </p>
//             </div>
//             <TrendingUp className="text-green-500 opacity-20 w-8 h-8" />
//           </div>
//         </div>

//         <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-slate-600 dark:text-slate-400 text-sm">Total Expense</p>
//               <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
//                 ${data.summary.expense.toLocaleString()}
//               </p>
//             </div>
//             <TrendingDown className="text-red-500 opacity-20 w-8 h-8" />
//           </div>
//         </div>

//         <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-slate-600 dark:text-slate-400 text-sm">Net Savings</p>
//               <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
//                 ${data.summary.savings.toLocaleString()}
//               </p>
//             </div>
//             <Target className="text-blue-500 opacity-20 w-8 h-8" />
//           </div>
//         </div>

//         <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-slate-600 dark:text-slate-400 text-sm">Savings Rate</p>
//               <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
//                 {data.summary.savingsRate}%
//               </p>
//             </div>
//             <div className="text-purple-500 opacity-20 w-8 h-8">📊</div>
//           </div>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Income vs Expense */}
//         <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//           <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
//             Income vs Expense Trend
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={data.incomeVsExpense}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
//               <XAxis dataKey="label" stroke="#9CA3AF" />
//               <YAxis stroke="#9CA3AF" />
//               <Tooltip
//                 contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
//                 formatter={(value) => `$${value}`}
//               />
//               <Legend />
//               <Bar dataKey="income" name="Income" fill="#10B981" />
//               <Bar dataKey="expense" name="Expense" fill="#EF4444" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Balance Timeline */}
//         <div className="  bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//           <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
//             Account Balance Timeline
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data.cashFlow}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
//               <XAxis dataKey="date" stroke="#9CA3AF" />
//               <YAxis stroke="#9CA3AF" />
//               <Tooltip
//                 contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
//                 formatter={(value) => `$${value}`}
//               />
//               <Line type="monotone" dataKey="balance" name="Balance" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Category Breakdown */}
//       <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//         <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
//           Category Breakdown
//         </h2>
//         {data.categoryBreakdown.length === 0 ? (
//           <p className="text-slate-500 text-sm py-4">No expense entries found for this range.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//             {data.categoryBreakdown.map((item, idx) => (
//               <div
//                 key={idx}
//                 className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <p className="font-medium text-slate-900 dark:text-white capitalize">
//                     {item.category}
//                   </p>
//                   <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
//                     {item.percentage}%
//                   </span>
//                 </div>
//                 <p className="text-2xl font-bold text-slate-900 dark:text-white">
//                   ${item.amount.toLocaleString()}
//                 </p>
//                 <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
//                   <div
//                     className="bg-blue-500 h-2 rounded-full"
//                     style={{ width: `${item.percentage}%` }}
//                   ></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Dynamic Insights */}
//       <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
//         <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
//           💡 Financial Insights
//         </h3>
//         <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
//           {data.summary.savingsRate >= 50 ? (
//             <li>✅ Excellent! Your savings rate is at {data.summary.savingsRate}%, which is well above standard goals.</li>
//           ) : (
//             <li>⚠️ Your savings rate is {data.summary.savingsRate}%. Try minimizing non-essential categories to boost savings.</li>
//           )}
//           <li>📈 Net wealth addition for selected tracking period: ${data.summary.savings.toLocaleString()}</li>
//         </ul>
//       </div>
//     </div>
//   )
// }

import React, { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react'

export default function Analytics() {
  const [data, setData] = useState(null)
  const [dateRange, setDateRange] = useState('month')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Fetch the active user token from LocalStorage to bypass the 401 gate
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('Authentication token missing. Please sign in again.')
      }

      // 2. Pass the token inside the standard Authorization header string
      const response = await fetch(`/api/analytics?range=${dateRange}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.status === 401) {
        throw new Error('Session expired or unauthorized. Please log back in.')
      }

      if (!response.ok) {
        throw new Error('Failed to fetch real-time analytics calculations')
      }

      const realData = await response.json()
      setData(realData)
    } catch (err) {
      console.error('Analytics Fetch Error:', err)
      setError(err.message || 'Something went wrong fetching data.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-slate-800 dark:text-slate-200 font-medium">{error}</p>
        <button 
          onClick={fetchAnalyticsData}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Financial insights and trends from your live data
          </p>
        </div>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                ${(data.summary?.income || 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="text-green-500 opacity-20 w-8 h-8" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Expense</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
                ${(data.summary?.expense || 0).toLocaleString()}
              </p>
            </div>
            <TrendingDown className="text-red-500 opacity-20 w-8 h-8" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Net Savings</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                ${(data.summary?.savings || 0).toLocaleString()}
              </p>
            </div>
            <Target className="text-blue-500 opacity-20 w-8 h-8" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Savings Rate</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                {data.summary?.savingsRate || 0}%
              </p>
            </div>
            <div className="text-purple-500 opacity-20 w-8 h-8">📊</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expense */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Income vs Expense Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.incomeVsExpense || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="label" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => `$${value}`}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10B981" />
              <Bar dataKey="expense" name="Expense" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Balance Timeline */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Account Balance Timeline
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.cashFlow || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => `$${value}`}
              />
              <Line type="monotone" dataKey="balance" name="Balance" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Category Breakdown
        </h2>
        {(!data.categoryBreakdown || data.categoryBreakdown.length === 0) ? (
          <p className="text-slate-500 text-sm py-4">No expense entries found for this range.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {data.categoryBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900 dark:text-white capitalize truncate max-w-[70%]">
                    {item.category}
                  </p>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {item.percentage}%
                  </span>
                </div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  ${(item.amount || 0).toLocaleString()}
                </p>
                <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Insights */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 Financial Insights
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          {(data.summary?.savingsRate || 0) >= 50 ? (
            <li>✅ Excellent! Your savings rate is at {data.summary?.savingsRate || 0}%, which is well above standard goals.</li>
          ) : (
            <li>⚠️ Your savings rate is {data.summary?.savingsRate || 0}%. Try minimizing non-essential categories to boost savings.</li>
          )}
          <li>📈 Net wealth addition for selected tracking period: ${(data.summary?.savings || 0).toLocaleString()}</li>
        </ul>
      </div>
    </div>
  )
}