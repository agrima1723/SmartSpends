// import React, { useState, useEffect } from 'react'
// import { useAuth } from './AuthContext'
// import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
// import { TrendingUp, Wallet, DollarSign } from 'lucide-react'

// const CHART_COLORS = ['#EF4444', '#F97316', '#8B5CF6', '#0EA5E9', '#14B8A6', '#F59E0B', '#6366F1']

// const parseDecimalValue = (value) => {
//   if (value == null) return 0
//   if (typeof value === 'number') return value
//   if (typeof value === 'string') {
//     const parsed = parseFloat(value)
//     return Number.isNaN(parsed) ? 0 : parsed
//   }
//   if (typeof value === 'object') {
//     if ('$numberDecimal' in value) {
//       const parsed = parseFloat(value.$numberDecimal)
//       return Number.isNaN(parsed) ? 0 : parsed
//     }
//     if (typeof value.toString === 'function') {
//       const parsed = parseFloat(value.toString())
//       return Number.isNaN(parsed) ? 0 : parsed
//     }
//   }
//   return 0
// }

// export default function Dashboard() {
//   const { token, logout } = useAuth()
//   const [data, setData] = useState({
//     totalBalance: 0,
//     income: 0,
//     expense: 0,
//     accounts: [],
//     categoryBreakdown: [],
//     balanceTrend: [],
//     recentTransactions: [],
//   })
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     if (!token) return
//     fetchDashboardData()
//   }, [token])

//   const fetchDashboardData = async () => {
//     try {
//       if (!token) throw new Error('Not authenticated')

//       const [accountsRes, transactionsRes] = await Promise.all([
//         fetch('/api/accounts', { headers: { Authorization: `Bearer ${token}` } }),
//         fetch('/api/transactions', { headers: { Authorization: `Bearer ${token}` } }),
//       ])

//       if (!accountsRes.ok) {
//         const err = await accountsRes.json().catch(() => ({}))
//         throw new Error(err.error || 'Failed to load accounts')
//       }
//       if (!transactionsRes.ok) {
//         const err = await transactionsRes.json().catch(() => ({}))
//         throw new Error(err.error || 'Failed to load transactions')
//       }

//       const accountsData = await accountsRes.json()
//       const transactionsData = await transactionsRes.json()
//       const accounts = accountsData.accounts || []
//       const transactions = transactionsData.transactions || []

//       const computedTotalBalance = accounts.reduce(
//         (sum, account) => sum + parseDecimalValue(account.balance ?? account.initialBalance ?? 0),
//         0
//       )

//       const income = transactions
//         .filter((tx) => tx.type === 'income')
//         .reduce(
//           (sum, tx) => sum + parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0),
//           0
//         )

//       const expense = transactions
//         .filter((tx) => tx.type === 'expense')
//         .reduce(
//           (sum, tx) => sum + parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0),
//           0
//         )

//       const categoryMap = {}
//       transactions
//         .filter((tx) => tx.type === 'expense')
//         .forEach((tx) => {
//           const categoryName = tx.categoryId?.name || tx.category || 'Other'
//           categoryMap[categoryName] =
//             (categoryMap[categoryName] || 0) +
//             parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0)
//         })

//       const categoryBreakdown = Object.entries(categoryMap).map(([name, value], index) => ({
//         name,
//         value,
//         fill: CHART_COLORS[index % CHART_COLORS.length],
//       }))

//       const today = new Date()
//       const trendDays = Array.from({ length: 7 }, (_, i) => {
//         const date = new Date(today)
//         date.setDate(today.getDate() - (6 - i))
//         return date
//       })

//       const trendByDate = trendDays.map((day) => {
//         const dateKey = day.toISOString().split('T')[0]
//         const dayTotal = transactions
//           .filter((tx) => {
//             if (!tx.date) return false
//             const txDateKey = tx.date.split('T')[0]
//             return txDateKey === dateKey
//           })
//           .reduce(
//             (sum, tx) =>
//               sum +
//               (tx.type === 'expense'
//                 ? -parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0)
//                 : parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0)),
//             0
//           )
//         return { date: dateKey, amount: dayTotal }
//       })

//       let runningBalance = computedTotalBalance - transactions.reduce((sum, tx) => {
//         const amt = parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0)
//         return tx.type === 'income' ? sum + amt : sum - amt
//       }, 0)

//       const balanceTrend = trendByDate.map((day) => {
//         runningBalance += day.amount
//         return {
//           date: new Date(day.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
//           balance: Math.max(0, Math.round(runningBalance * 100) / 100),
//         }
//       })

//       const recentTransactions = transactions.slice(0, 5).map((tx) => ({
//         description: tx.description || 'No description',
//         category: tx.categoryId?.name || tx.category || 'Other',
//         date: tx.date ? tx.date.split('T')[0] : '',
//         amount:
//           tx.type === 'expense'
//             ? -parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0)
//             : parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0),
//       }))

//       setData({
//         totalBalance: computedTotalBalance,
//         income,
//         expense,
//         accounts: accounts.map((account) => ({
//           name: account.accountName || account.name || 'Account',
//           balance: parseDecimalValue(account.balance ?? account.initialBalance ?? 0),
//         })),
//         categoryBreakdown: categoryBreakdown.length ? categoryBreakdown : [{ name: 'No Expenses', value: 0, fill: '#E2E8F0' }],
//         balanceTrend,
//         recentTransactions,
//       })
//       setError('')
//     } catch (err) {
//       console.error('Dashboard load failed:', err)
//       setError(err.message || 'Unable to load dashboard data')
//       if (err.message?.includes('Invalid or expired token')) {
//         logout()
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl backdrop-blur-md">
//         Error: {error}
//       </div>
//     )
//   }

//   if (!data) return null

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500 text-slate-100">
//       {/* 1. TOP KPI CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Total Balance Card */}
//         <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 group shadow-cyan-500/10">
//           <div className="absolute top-[-50%] right-[-20%] w-40 h-40 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-[0.05] blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500" />
//           <div className="flex justify-between items-start mb-4 relative z-10">
//             <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Balance</p>
//             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 bg-opacity-10 flex items-center justify-center text-white border border-white/10 shadow-md group-hover:rotate-6 transition-transform">
//               <Wallet size={18} />
//             </div>
//           </div>
//           <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 drop-shadow-[0_2px_10px_rgba(34,211,238,0.2)] relative z-10">
//             ${parseDecimalValue(data.totalBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
//           </h2>
//         </div>

//         {/* Income Card */}
//         <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 group shadow-emerald-500/10">
//           <div className="absolute top-[-50%] right-[-20%] w-40 h-40 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-[0.05] blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500" />
//           <div className="flex justify-between items-start mb-4 relative z-10">
//             <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Income</p>
//             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 bg-opacity-10 flex items-center justify-center text-white border border-white/10 shadow-md group-hover:rotate-6 transition-transform">
//               <TrendingUp size={18} />
//             </div>
//           </div>
//           <h2 className="text-3xl font-black tracking-tight text-emerald-400 drop-shadow-[0_2px_8px_rgba(52,211,153,0.3)] relative z-10">
//             +${parseDecimalValue(data.totalIncome).toLocaleString('en-US', { minimumFractionDigits: 2 })}
//           </h2>
//         </div>

//         {/* Expense Card */}
//         <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 group shadow-rose-500/10">
//            <div className="absolute top-[-50%] right-[-20%] w-40 h-40 bg-gradient-to-br from-rose-400 to-pink-600 opacity-[0.05] blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500" />
//           <div className="flex justify-between items-start mb-4 relative z-10">
//             <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Expense</p>
//             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 bg-opacity-10 flex items-center justify-center text-white border border-white/10 shadow-md group-hover:-rotate-6 transition-transform">
//               <DollarSign size={18} />
//             </div>
//           </div>
//           <h2 className="text-3xl font-black tracking-tight text-rose-400 drop-shadow-[0_2px_8px_rgba(251,113,133,0.3)] relative z-10">
//             -${parseDecimalValue(data.totalExpense).toLocaleString('en-US', { minimumFractionDigits: 2 })}
//           </h2>
//         </div>
//       </div>

//       {/* 2. CHARTS SECTION */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col">
//           <h2 className="text-md font-extrabold tracking-wide text-slate-200 mb-6">Expenses by Category</h2>
//           <div className="h-64 relative z-10">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={data?.categoryBreakdown}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   paddingAngle={5}
//                   dataKey="value"
//                   stroke="none"
//                 >
//                   {data?.categoryBreakdown?.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip 
//                   contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
//                   itemStyle={{ color: '#fff' }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col">
//           <h2 className="text-md font-extrabold tracking-wide text-slate-200 mb-6">Balance Trend</h2>
//           <div className="h-64 relative z-10">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={data?.balanceTrend}>
//                 <defs>
//                   <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
//                     <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
//                 <XAxis dataKey="date" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
//                 <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
//                 <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
//                 <Area type="monotone" dataKey="balance" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* 3. RECENT TRANSACTIONS LEDGER */}
//       <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
//         <h2 className="text-md font-extrabold tracking-wide text-slate-200 mb-6">
//           Recent Transactions
//         </h2>
//         <div className="space-y-2">
//           {data?.recentTransactions?.map((tx, idx) => (
//             <div
//               key={idx}
//               className="flex items-center justify-between p-4 bg-black/10 hover:bg-white/5 border border-white/5 rounded-xl transition-all duration-200 group"
//             >
//               <div>
//                 <p className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
//                   {tx.description}
//                 </p>
//                 <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
//                   <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase mr-2 text-[10px]">{tx.category}</span>
//                   {tx.date}
//                 </p>
//               </div>
//               <p
//                 className={`font-black text-lg tracking-wide drop-shadow-sm ${
//                   tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'
//                 }`}
//               >
//                 {tx.amount >= 0 ? '+' : ''}${parseDecimalValue(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
//               </p>
//             </div>
//           ))}
//           {data?.recentTransactions?.length === 0 && (
//              <div className="text-center py-6 text-slate-500 font-medium">No recent transactions found.</div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Wallet, DollarSign } from 'lucide-react'

const CHART_COLORS = ['#38BDF8', '#818CF8', '#A78BFA', '#F472B6', '#FB7185', '#F59E0B', '#34D399']

const parseDecimalValue = (value) => {
  if (value == null) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return Number.isNaN(parsed) ? 0 : parsed
  }
  if (typeof value === 'object') {
    if ('$numberDecimal' in value) {
      const parsed = parseFloat(value.$numberDecimal)
      return Number.isNaN(parsed) ? 0 : parsed
    }
    if (typeof value.toString === 'function') {
      const parsed = parseFloat(value.toString())
      return Number.isNaN(parsed) ? 0 : parsed
    }
  }
  return 0
}

export default function Dashboard() {
  const { token, logout } = useAuth()
  const [data, setData] = useState({
    totalBalance: 0,
    income: 0,
    expense: 0,
    accounts: [],
    categoryBreakdown: [],
    balanceTrend: [],
    recentTransactions: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    fetchDashboardData()
  }, [token])

  const fetchDashboardData = async () => {
    try {
      if (!token) throw new Error('Not authenticated')

      const [accountsRes, transactionsRes] = await Promise.all([
        fetch('/api/accounts', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/transactions', { headers: { Authorization: `Bearer ${token}` } }),
      ])

      if (!accountsRes.ok) {
        const err = await accountsRes.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to load accounts')
      }
      if (!transactionsRes.ok) {
        const err = await transactionsRes.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to load transactions')
      }

      const accountsData = await accountsRes.json()
      const transactionsData = await transactionsRes.json()
      const accounts = accountsData.accounts || []
      const transactions = transactionsData.transactions || []

      const computedTotalBalance = accounts.reduce(
        (sum, account) => sum + parseDecimalValue(account.balance ?? account.initialBalance ?? 0),
        0
      )

      const income = transactions
        .filter((tx) => tx.type === 'income')
        .reduce(
          (sum, tx) => sum + parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0),
          0
        )

      const expense = transactions
        .filter((tx) => tx.type === 'expense')
        .reduce(
          (sum, tx) => sum + parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0),
          0
        )

      const categoryMap = {}
      transactions
        .filter((tx) => tx.type === 'expense')
        .forEach((tx) => {
          const categoryName = tx.categoryId?.name || tx.category || 'Other'
          categoryMap[categoryName] =
            (categoryMap[categoryName] || 0) +
            parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0)
        })

      const categoryBreakdown = Object.entries(categoryMap).map(([name, value], index) => ({
        name,
        value,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      }))

      const today = new Date()
      const trendDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today)
        date.setDate(today.getDate() - (6 - i))
        return date
      })

      const trendByDate = trendDays.map((day) => {
        const dateKey = day.toISOString().split('T')[0]
        const dayTotal = transactions
          .filter((tx) => {
            if (!tx.date) return false
            const txDateKey = tx.date.split('T')[0]
            return txDateKey === dateKey
          })
          .reduce(
            (sum, tx) =>
              sum +
              (tx.type === 'expense'
                ? -parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0)
                : parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0)),
            0
          )
        return { date: dateKey, amount: dayTotal }
      })

      let runningBalance = computedTotalBalance - transactions.reduce((sum, tx) => {
        const amt = parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0)
        return tx.type === 'income' ? sum + amt : sum - amt
      }, 0)

      const balanceTrend = trendByDate.map((day) => {
        runningBalance += day.amount
        return {
          date: new Date(day.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
          balance: Math.max(0, Math.round(runningBalance * 100) / 100),
        }
      })

      const recentTransactions = transactions.slice(0, 5).map((tx) => ({
        description: tx.description || 'No description',
        category: tx.categoryId?.name || tx.category || 'Other',
        date: tx.date ? tx.date.split('T')[0] : '',
        amount:
          tx.type === 'expense'
            ? -parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0)
            : parseDecimalValue(tx.convertedAmount ?? tx.amount ?? 0),
      }))

      setData({
        totalBalance: computedTotalBalance,
        income,
        expense,
        accounts: accounts.map((account) => ({
          name: account.accountName || account.name || 'Account',
          balance: parseDecimalValue(account.balance ?? account.initialBalance ?? 0),
        })),
        categoryBreakdown: categoryBreakdown.length ? categoryBreakdown : [{ name: 'No Expenses', value: 0, fill: '#E2E8F0' }],
        balanceTrend,
        recentTransactions,
      })
      setError('')
    } catch (err) {
      console.error('Dashboard load failed:', err)
      setError(err.message || 'Unable to load dashboard data')
      if (err.message?.includes('Invalid or expired token')) {
        logout()
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl backdrop-blur-md">
        Error: {error}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-slate-100">
      {/* 1. TOP KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 group shadow-cyan-500/10">
          <div className="absolute top-[-50%] right-[-20%] w-40 h-40 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-[0.05] blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Balance</p>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 bg-opacity-10 flex items-center justify-center text-white border border-white/10 shadow-md group-hover:rotate-6 transition-transform">
              <Wallet size={18} />
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 drop-shadow-[0_2px_10px_rgba(34,211,238,0.2)] relative z-10">
            ${parseDecimalValue(data.totalBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
        </div>

        {/* Income Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 group shadow-emerald-500/10">
          <div className="absolute top-[-50%] right-[-20%] w-40 h-40 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-[0.05] blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Income</p>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 bg-opacity-10 flex items-center justify-center text-white border border-white/10 shadow-md group-hover:rotate-6 transition-transform">
              <TrendingUp size={18} />
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-emerald-400 drop-shadow-[0_2px_8px_rgba(52,211,153,0.3)] relative z-10">
            +${parseDecimalValue(data.income).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
        </div>

        {/* Expense Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 group shadow-rose-500/10">
           <div className="absolute top-[-50%] right-[-20%] w-40 h-40 bg-gradient-to-br from-rose-400 to-pink-600 opacity-[0.05] blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Expense</p>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 bg-opacity-10 flex items-center justify-center text-white border border-white/10 shadow-md group-hover:-rotate-6 transition-transform">
              <DollarSign size={18} />
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-rose-400 drop-shadow-[0_2px_8px_rgba(251,113,133,0.3)] relative z-10">
            -${parseDecimalValue(data.expense).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
        </div>
      </div>

      {/* 2. CHARTS SECTION - REDESIGNED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-md font-extrabold tracking-wide text-slate-200 mb-1">Expenses by Category</h2>
            <p className="text-xs font-medium text-slate-400 mb-6">Capital outflow mapping by target criteria</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center flex-1">
            {/* Chart Column */}
            <div className="sm:col-span-6 h-56 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {data?.categoryBreakdown?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} className="focus:outline-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(9, 11, 22, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '10px 14px' }}
                    itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Total Spent']}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Absolute Centered Total Outflow Indicator */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Out</span>
                <span className="text-xl font-black text-white mt-0.5">${Math.round(data.expense).toLocaleString()}</span>
              </div>
            </div>

            {/* Premium Synchronized Legend Checklist Column */}
            <div className="sm:col-span-6 space-y-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
              {data?.categoryBreakdown?.map((entry, index) => {
                const totalExpense = data.expense || 1;
                const percentage = Math.round((entry.value / totalExpense) * 100);
                return (
                  <div key={index} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: entry.fill }} />
                      <p className="text-xs font-bold text-slate-200 truncate">{entry.name}</p>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <p className="text-xs font-black text-white">${Math.round(entry.value).toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-slate-400">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Balance Trend Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-md font-extrabold tracking-wide text-slate-200 mb-1">Balance Trend</h2>
            <p className="text-xs font-medium text-slate-400 mb-6">Chronological running total evaluation</p>
          </div>
          <div className="h-56 relative z-10 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.balanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" tick={{fill: '#94A3B8', fontSize: 11, fontWeight: '600'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" tick={{fill: '#94A3B8', fontSize: 11, fontWeight: '600'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(9, 11, 22, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', padding: '10px 14px' }}
                  itemStyle={{ fontWeight: '700', fontSize: '13px' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']}
                />
                <Area type="monotone" dataKey="balance" stroke="#0EA5E9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. RECENT TRANSACTIONS LEDGER */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-md font-extrabold tracking-wide text-slate-200 mb-6">
          Recent Transactions
        </h2>
        <div className="space-y-2">
          {data?.recentTransactions?.map((tx, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-black/10 hover:bg-white/5 border border-white/5 rounded-xl transition-all duration-200 group"
            >
              <div>
                <p className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {tx.description}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
                  <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase mr-2 text-[10px]">{tx.category}</span>
                  {tx.date}
                </p>
              </div>
              <p
                className={`font-black text-lg tracking-wide drop-shadow-sm ${
                  tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {tx.amount >= 0 ? '+' : ''}${parseDecimalValue(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
          {data?.recentTransactions?.length === 0 && (
             <div className="text-center py-6 text-slate-500 font-medium">No recent transactions found.</div>
          )}
        </div>
      </div>
    </div>
  )
}