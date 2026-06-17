// import React, { useState, useEffect } from 'react'
// import { useAuth } from './AuthContext'
// import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react'

// const parseAmountValue = (value) => {
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

// export default function Transactions() {
//   const { token, logout } = useAuth()
//   const [transactions, setTransactions] = useState([])
//   const [accounts, setAccounts] = useState([])
//   const [selectedAccountId, setSelectedAccountId] = useState('')
//   const [categories, setCategories] = useState([])
//   const [showAccountForm, setShowAccountForm] = useState(false)
//   const [accountMode, setAccountMode] = useState('existing')
//   const [accountForm, setAccountForm] = useState({ accountName: '', accountType: 'Bank', initialBalance: '', currency: 'USD' })
//   const [loading, setLoading] = useState(false)
//   const [showForm, setShowForm] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [filterType, setFilterType] = useState('all')
//   const [error, setError] = useState(null)
//   const [formData, setFormData] = useState({
//     description: '',
//     amount: '',
//     type: 'expense',
//     accountId: '',
//     categoryId: '',
//     date: new Date().toISOString().split('T')[0],
//   })

//   useEffect(() => {
//     if (!token) return
//     loadAccounts()
//     loadCategories()
//     loadTransactions()
//   }, [token])

//   const loadAccounts = async () => {
//     try {
//       const res = await fetch('/api/accounts', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await res.json()
//       const list = Array.isArray(data) ? data : (data.accounts || [])
//       setAccounts(list)

//       if (list.length > 0) {
//         setFormData(prev => ({ ...prev, accountId: prev.accountId || list[0]._id }))
//         if (accountMode !== 'existing') {
//           setAccountMode('existing')
//           setShowAccountForm(false)
//         }
//       } else {
//         setAccountMode('new')
//         setShowAccountForm(true)
//       }
//     } catch (err) {
//       console.error('Failed to load accounts:', err)
//       setError('Could not load accounts. Please try again.')
//       if (err.message.includes('Invalid or expired token')) {
//         logout()
//       }
//     }
//   }

//   const loadCategories = async () => {
//     try {
//       const res = await fetch('/api/categories', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await res.json()
//       const list = Array.isArray(data) ? data : (data.categories || [])
//       setCategories(list)
//       if (list.length > 0) {
//         setFormData(prev => ({ ...prev, categoryId: prev.categoryId || list[0]._id }))
//       }
//     } catch (err) {
//       console.error('Failed to load categories:', err)
//       setError('Could not load categories. Please try again.')
//       if (err.message.includes('Invalid or expired token')) {
//         logout()
//       }
//     }
//   }

//   const loadTransactions = async () => {
//     setLoading(true)
//     try {
//       const res = await fetch('/api/transactions', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       if (!res.ok) {
//         const data = await res.json()
//         throw new Error(data.error || 'Unable to fetch transactions')
//       }
//       const data = await res.json()
//       setTransactions(
//         (data.transactions || []).map((tx) => ({
//           ...tx,
//           id: tx._id || tx.id,
//           accountId: tx.accountId?._id || tx.accountId || tx.account || '',
//           categoryName: tx.categoryId?.name || tx.category || 'Other',
//           accountName: tx.accountId?.accountName || tx.account || 'Account',
//           amount: parseAmountValue(tx.amount ?? tx.convertedAmount),
//           date: tx.date ? new Date(tx.date).toISOString().split('T')[0] : '',
//         }))
//       )
//       setError(null)
//     } catch (err) {
//       console.error('Failed to load transactions:', err)
//       setError(err.message)
//       if (err.message.includes('Invalid or expired token')) {
//         logout()
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filteredCategories = categories.filter(
//     (category) => category.type === formData.type || category.type === 'expense'
//   )

//   const handleAddTransaction = async (e) => {
//     e.preventDefault()
//     setError(null)

//     if (!formData.accountId || !formData.categoryId) {
//       alert('Please select an account and a category')
//       return
//     }

//     let amountValue = parseFloat(formData.amount)
//     const isExpression = /[+\-*/]/.test(formData.amount)
//     const payload = {
//       accountId: formData.accountId,
//       categoryId: formData.categoryId,
//       type: formData.type,
//       description: formData.description,
//       date: formData.date,
//     }

//     if (isNaN(amountValue) && isExpression) {
//       payload.amountExpression = formData.amount
//     } else if (!isNaN(amountValue)) {
//       payload.amount = amountValue
//     } else {
//       alert('Invalid amount or expression')
//       return
//     }

//     try {
//       const res = await fetch('/api/transactions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       })

//       const data = await res.json()
//       if (!res.ok) {
//         throw new Error(data.error || 'Unable to add transaction')
//       }

//       const tx = data.transaction
//       const normalizedTx = {
//         ...tx,
//         id: tx._id,
//         categoryName: tx.categoryId?.name || 'Other',
//         accountName: tx.accountId?.accountName || 'Account',
//         amount: parseAmountValue(tx.amount ?? tx.convertedAmount),
//         date: tx.date ? new Date(tx.date).toISOString().split('T')[0] : '',
//         category: tx.categoryId?.name || 'Other',
//       }

//       setTransactions([normalizedTx, ...transactions])
//       setFormData({
//         description: '',
//         amount: '',
//         type: 'expense',
//         accountId: accounts[0]?._id || '',
//         categoryId: categories.find((cat) => cat.type === 'expense')?._id || categories[0]?._id || '',
//         date: new Date().toISOString().split('T')[0],
//       })
//       setShowForm(false)
//     } catch (err) {
//       console.error('Error adding transaction:', err)
//       setError(err.message)
//       if (err.message.includes('Invalid or expired token')) {
//         logout()
//       }
//     }
//   }

//   const handleCreateInlineAccount = async (e) => {
//     e.preventDefault()
//     try {
//       const payload = {
//         accountName: accountForm.accountName,
//         accountType: accountForm.accountType,
//         initialBalance: parseFloat(accountForm.initialBalance) || 0,
//         currency: accountForm.currency,
//       }

//       const res = await fetch('/api/accounts', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       })

//       const data = await res.json()
//       if (!res.ok) throw new Error(data.error || 'Failed to create account')

//       // refresh accounts, select the new one, and switch back to existing-account mode
//       await loadAccounts()
//       const newAccountId = data.account?._id || data._id
//       setFormData(prev => ({ ...prev, accountId: newAccountId }))
//       setAccountForm({ accountName: '', accountType: 'Bank', initialBalance: '', currency: 'USD' })
//       setAccountMode('existing')
//       setShowAccountForm(false)
//     } catch (err) {
//       console.error('Error creating account inline:', err)
//       setError(err.message)
//       if (err.message.includes('Invalid or expired token')) {
//         logout()
//       }
//     }
//   }

//   const handleDeleteTransaction = async (transactionId) => {
//     try {
//       const res = await fetch(`/api/transactions/${transactionId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await res.json()
//       if (!res.ok) {
//         throw new Error(data.error || 'Unable to delete transaction')
//       }
//       setTransactions(transactions.filter((tx) => tx.id !== transactionId))
//     } catch (err) {
//       console.error('Error deleting transaction:', err)
//       setError(err.message)
//     }
//   }

//   const filteredTransactions = transactions.filter((tx) => {
//     if (selectedAccountId && tx.accountId !== selectedAccountId) return false
//     const matchesSearch = tx.description
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//     const matchesType = filterType === 'all' || tx.type === filterType
//     return matchesSearch && matchesType
//   })

//   const handleChangeTransactionAccount = async (transactionId, newAccountId) => {
//     try {
//       const res = await fetch(`/api/transactions/${transactionId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ accountId: newAccountId }),
//       })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.error || 'Failed to update transaction')

//       setTransactions((prev) => prev.map((t) => (t.id === transactionId ? { ...t, accountId: newAccountId, accountName: accounts.find(a => a._id === newAccountId)?.accountName || t.accountName } : t)))
//     } catch (err) {
//       console.error('Error updating transaction account:', err)
//       setError(err.message)
//     }
//   }

//   const categoryIcons = {
//     Food: '🍔',
//     Transport: '🚗',
//     Entertainment: '🎬',
//     Shopping: '🛍️',
//     Utilities: '💡',
//     Salary: '💰',
//     Other: '📦',
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div> text-slate-900
//           <h1 className="text-3xl font-bold dark:text-white dark:text-white">Transactions</h1>
//           <p className="text-slate-600 dark:text-slate-400 mt-1">
//             {transactions.length} transactions
//           </p>
//           {error && (
//             <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
//           )}
//         </div>
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
//         >
//           <Plus size={20} />
//           {showForm ? 'Hide transaction form' : 'Add Transaction'}
//         </button>
//       </div>

//       {showForm && (
//         <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
//           <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
//             New Transaction
//           </h2>
//           {!accounts.length || !categories.length ? (
//             <div className="p-4 bg-amber-100 dark:bg-amber-900 rounded-lg text-amber-900 dark:text-amber-100">
//               To add a transaction, please first create at least one account and one category.
//               Use the <strong>Accounts</strong> and <strong>Categories</strong> pages from the left menu to add them.
//             </div>
//           ) : (
//             <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                   Description
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData({ ...formData, description: e.target.value })
//                   }
//                   className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="e.g., Lunch"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                   Amount (or expression like 50+20)
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.amount}
//                   onChange={(e) =>
//                     setFormData({ ...formData, amount: e.target.value })
//                   }
//                   className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="100 or 50+20+30"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                   Type
//                 </label>
//                 <select
//                   value={formData.type}
//                   onChange={(e) =>
//                     setFormData({ ...formData, type: e.target.value })
//                   }
//                   className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="expense">Expense</option>
//                   <option value="income">Income</option>
//                   <option value="transfer">Transfer</option>
//                 </select>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex items-center justify-between gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                       Account
//                     </label>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">
//                       Choose an existing account or create a new one for this transaction.
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setAccountMode('existing')
//                         setShowAccountForm(false)
//                       }}
//                       className={`px-3 py-1 rounded-lg ${accountMode === 'existing' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
//                     >
//                       Existing
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setAccountMode('new')
//                         setShowAccountForm(true)
//                       }}
//                       className={`px-3 py-1 rounded-lg ${accountMode === 'new' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
//                     >
//                       New
//                     </button>
//                   </div>
//                 </div>

//                 {accountMode === 'existing' ? (
//                   <div>
//                     <select
//                       value={formData.accountId}
//                       onChange={(e) =>
//                         setFormData({ ...formData, accountId: e.target.value })
//                       }
//                       className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       {accounts.length > 0 ? (
//                         accounts.map((account) => (
//                           <option key={account._id} value={account._id}>
//                             {account.accountName}
//                           </option>
//                         ))
//                       ) : (
//                         <option value="">No accounts available</option>
//                       )}
//                     </select>
//                     {accounts.length === 0 && (
//                       <p className="mt-2 text-sm text-amber-600 dark:text-amber-300">
//                         No accounts exist yet. Switch to "New" to create one.
//                       </p>
//                     )}
//                   </div>
//                 ) : (
//                   <form onSubmit={handleCreateInlineAccount} className="space-y-3">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                       <input
//                         value={accountForm.accountName}
//                         onChange={(e) =>
//                           setAccountForm(prev => ({ ...prev, accountName: e.target.value }))
//                         }
//                         required
//                         placeholder="Account name"
//                         className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-full"
//                       />
//                       <select
//                         value={accountForm.accountType}
//                         onChange={(e) =>
//                           setAccountForm(prev => ({ ...prev, accountType: e.target.value }))
//                         }
//                         className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-full"
//                       >
//                         <option>Bank</option>
//                         <option>Cash</option>
//                         <option>Credit</option>
//                       </select>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                       <input
//                         value={accountForm.initialBalance}
//                         onChange={(e) =>
//                           setAccountForm(prev => ({ ...prev, initialBalance: e.target.value }))
//                         }
//                         placeholder="Initial balance"
//                         type="number"
//                         step="0.01"
//                         className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-full"
//                       />
//                       <input
//                         value={accountForm.currency}
//                         onChange={(e) =>
//                           setAccountForm(prev => ({ ...prev, currency: e.target.value }))
//                         }
//                         placeholder="Currency"
//                         className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-full"
//                       />
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         type="submit"
//                         className="px-4 py-2 bg-green-600 text-white rounded-lg"
//                       >
//                         Create account and use it
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setAccountMode('existing')
//                           setShowAccountForm(false)
//                         }}
//                         className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                   Category
//                 </label>
//                 <select
//                   value={formData.categoryId}
//                   onChange={(e) =>
//                     setFormData({ ...formData, categoryId: e.target.value })
//                   }
//                   className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 >
//                   {filteredCategories.length > 0 ? (
//                     filteredCategories.map((category) => (
//                       <option key={category._id} value={category._id}>
//                         {category.name}
//                       </option>
//                     ))
//                   ) : (
//                     categories.map((category) => (
//                       <option key={category._id} value={category._id}>
//                         {category.name}
//                       </option>
//                     ))
//                   )}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                   Date
//                 </label>
//                 <input
//                   type="date"
//                   value={formData.date}
//                   onChange={(e) =>
//                     setFormData({ ...formData, date: e.target.value })
//                   }
//                   className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div className="flex gap-2 md:col-span-2">
//                 <button
//                   type="submit"
//                   className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
//                 >
//                   Add Transaction
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       )}

//       <div className="flex gap-4">
//         <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
//           <Search size={20} className="text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search transactions..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
//           />
//         </div>

//         <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
//           <Filter size={20} className="text-slate-400" />
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className="bg-transparent outline-none text-slate-900 text-slate-900"
//           >
//             <option value="all">All Types</option>
//             <option value="income">Income</option>
//             <option value="expense">Expense</option>
//             <option value="transfer">Transfer</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
//           <label className="text-sm text-slate-600 dark:text-slate-300">Account</label>
//           <select
//             value={selectedAccountId}
//             onChange={(e) => setSelectedAccountId(e.target.value)}
//             className="bg-transparent outline-none text-slate-900 dark:text-white"
//           >
//             <option value="">All accounts</option>
//             {accounts.map((a) => (
//               <option key={a._id} value={a._id}>{a.accountName}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
//         {loading ? (
//           <div className="p-8 text-center">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//           </div>
//         ) : filteredTransactions.length === 0 ? (
//           <div className="p-8 text-center text-slate-600 dark:text-slate-400">
//             No transactions found
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
//                     Description
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
//                     Category
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
//                     Account
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
//                     Amount
//                   </th>
//                   <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900 dark:text-white">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
//                 {filteredTransactions.map((tx) => (
//                   <tr
//                     key={tx.id}
//                     className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
//                   >
//                     <td className="px-6 py-3 text-slate-900 dark:text-white font-medium">
//                       {tx.description}
//                     </td>
//                     <td className="px-6 py-3">
//                       <span className="text-lg">
//                         {categoryIcons[tx.categoryName] || '📦'}
//                       </span>{' '}
//                       {tx.categoryName}
//                     </td>
//                     <td className="px-6 py-3">
//                       <select
//                         value={tx.accountId || ''}
//                         onChange={(e) => handleChangeTransactionAccount(tx.id, e.target.value)}
//                         className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
//                       >
//                         {accounts.map((a) => (
//                           <option key={a._id} value={a._id}>{a.accountName}</option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="px-6 py-3 text-slate-600 dark:text-slate-400">
//                       {tx.date}
//                     </td>
//                     <td
//                       className={`px-6 py-3 text-right font-semibold ${
//                         tx.type === 'income'
//                           ? 'text-green-600 dark:text-green-400'
//                           : 'text-red-600 dark:text-red-400'
//                       }`}
//                     >
//                       {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
//                     </td>
//                     <td className="px-6 py-3 text-center">
//                       <div className="flex gap-2 justify-center">
//                         <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
//                           <Edit2 size={16} className="text-blue-500" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteTransaction(tx.id)}
//                           className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
//                         >
//                           <Trash2 size={16} className="text-red-500" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react'
// 🌟 IMPORT THE API BASE FROM YOUR UTILS FILE
import { API_BASE } from './utils'

const parseAmountValue = (value) => {
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

export default function Transactions() {
  const { token, logout } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [accounts, setAccounts] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [categories, setCategories] = useState([])
  const [showAccountForm, setShowAccountForm] = useState(false)
  const [accountMode, setAccountMode] = useState('existing')
  const [accountForm, setAccountForm] = useState({ accountName: '', accountType: 'Bank', initialBalance: '', currency: 'USD' })
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    accountId: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (!token) return
    loadAccounts()
    loadCategories()
    loadTransactions()
  }, [token])

  const loadAccounts = async () => {
    try {
      // 🌟 UPDATED ENDPOINT
      const res = await fetch(`${API_BASE}/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      const list = Array.isArray(data) ? data : (data.accounts || [])
      setAccounts(list)

      if (list.length > 0) {
        setFormData(prev => ({ ...prev, accountId: prev.accountId || list[0]._id }))
        if (accountMode !== 'existing') {
          setAccountMode('existing')
          setShowAccountForm(false)
        }
      } else {
        setAccountMode('new')
        setShowAccountForm(true)
      }
    } catch (err) {
      console.error('Failed to load accounts:', err)
      setError('Could not load accounts. Please try again.')
      if (err.message && err.message.includes('Invalid or expired token')) {
        logout()
      }
    }
  }

  const loadCategories = async () => {
    try {
      // 🌟 UPDATED ENDPOINT
      const res = await fetch(`${API_BASE}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      const list = Array.isArray(data) ? data : (data.categories || [])
      setCategories(list)
      if (list.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: prev.categoryId || list[0]._id }))
      }
    } catch (err) {
      console.error('Failed to load categories:', err)
      setError('Could not load categories. Please try again.')
      if (err.message && err.message.includes('Invalid or expired token')) {
        logout()
      }
    }
  }

  const loadTransactions = async () => {
    setLoading(true)
    try {
      // 🌟 UPDATED ENDPOINT
      const res = await fetch(`${API_BASE}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Unable to fetch transactions')
      }
      const data = await res.json()
      setTransactions(
        (data.transactions || []).map((tx) => ({
          ...tx,
          id: tx._id || tx.id,
          accountId: tx.accountId?._id || tx.accountId || tx.account || '',
          categoryName: tx.categoryId?.name || tx.category || 'Other',
          accountName: tx.accountId?.accountName || tx.account || 'Account',
          amount: parseAmountValue(tx.amount ?? tx.convertedAmount),
          date: tx.date ? new Date(tx.date).toISOString().split('T')[0] : '',
        }))
      )
      setError(null)
    } catch (err) {
      console.error('Failed to load transactions:', err)
      setError(err.message)
      if (err.message && err.message.includes('Invalid or expired token')) {
        logout()
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(
    (category) => category.type === formData.type || category.type === 'expense'
  )

  const handleAddTransaction = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.accountId || !formData.categoryId) {
      alert('Please select an account and a category')
      return
    }

    let amountValue = parseFloat(formData.amount)
    const isExpression = /[+\-*/]/.test(formData.amount)
    const payload = {
      accountId: formData.accountId,
      categoryId: formData.categoryId,
      type: formData.type,
      description: formData.description,
      date: formData.date,
    }

    if (isNaN(amountValue) && isExpression) {
      payload.amountExpression = formData.amount
    } else if (!isNaN(amountValue)) {
      payload.amount = amountValue
    } else {
      alert('Invalid amount or expression')
      return
    }

    try {
      // 🌟 UPDATED ENDPOINT
      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Unable to add transaction')
      }

      const tx = data.transaction
      const normalizedTx = {
        ...tx,
        id: tx._id,
        categoryName: tx.categoryId?.name || 'Other',
        accountName: tx.accountId?.accountName || 'Account',
        amount: parseAmountValue(tx.amount ?? tx.convertedAmount),
        date: tx.date ? new Date(tx.date).toISOString().split('T')[0] : '',
        category: tx.categoryId?.name || 'Other',
      }

      setTransactions([normalizedTx, ...transactions])
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        accountId: accounts[0]?._id || '',
        categoryId: categories.find((cat) => cat.type === 'expense')?._id || categories[0]?._id || '',
        date: new Date().toISOString().split('T')[0],
      })
      setShowForm(false)
    } catch (err) {
      console.error('Error adding transaction:', err)
      setError(err.message)
      if (err.message && err.message.includes('Invalid or expired token')) {
        logout()
      }
    }
  }

  const handleCreateInlineAccount = async (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    try {
      const payload = {
        accountName: accountForm.accountName,
        accountType: accountForm.accountType,
        initialBalance: parseFloat(accountForm.initialBalance) || 0,
        currency: accountForm.currency,
      }

      // 🌟 UPDATED ENDPOINT
      const res = await fetch(`${API_BASE}/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create account')

      await loadAccounts()
      const newAccountId = data.account?._id || data._id
      setFormData(prev => ({ ...prev, accountId: newAccountId }))
      setAccountForm({ accountName: '', accountType: 'Bank', initialBalance: '', currency: 'USD' })
      setAccountMode('existing')
      setShowAccountForm(false)
    } catch (err) {
      console.error('Error creating account inline:', err)
      setError(err.message)
      if (err.message && err.message.includes('Invalid or expired token')) {
        logout()
      }
    }
  }

  const handleDeleteTransaction = async (transactionId) => {
    try {
      // 🌟 UPDATED ENDPOINT
      const res = await fetch(`${API_BASE}/transactions/${transactionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Unable to delete transaction')
      }
      setTransactions(transactions.filter((tx) => tx.id !== transactionId))
    } catch (err) {
      console.error('Error deleting transaction:', err)
      setError(err.message)
    }
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedAccountId && tx.accountId !== selectedAccountId) return false
    const matchesSearch = tx.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || tx.type === filterType
    return matchesSearch && matchesType
  })

  const handleChangeTransactionAccount = async (transactionId, newAccountId) => {
    try {
      // 🌟 UPDATED ENDPOINT
      const res = await fetch(`${API_BASE}/transactions/${transactionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accountId: newAccountId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update transaction')

      setTransactions((prev) => prev.map((t) => (t.id === transactionId ? { ...t, accountId: newAccountId, accountName: accounts.find(a => a._id === newAccountId)?.accountName || t.accountName } : t)))
    } catch (err) {
      console.error('Error updating transaction account:', err)
      setError(err.message)
    }
  }

  const categoryIcons = {
    Food: '🍔',
    Transport: '🚗',
    Entertainment: '🎬',
    Shopping: '🛍️',
    Utilities: '💡',
    Salary: '💰',
    Other: '📦',
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Transactions</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {transactions.length} transactions
          </p>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
        >
          <Plus size={20} />
          {showForm ? 'Hide transaction form' : 'Add Transaction'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            New Transaction
          </h2>
          {!accounts.length || !categories.length ? (
            <div className="p-4 bg-amber-100 dark:bg-amber-900 rounded-lg text-amber-900 dark:text-amber-100">
              To add a transaction, please first create at least one account and one category.
              Use the <strong>Accounts</strong> and <strong>Categories</strong> pages from the left menu to add them.
            </div>
          ) : (
            <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Lunch"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Amount (or expression like 50+20)
                </label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100 or 50+20+30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Account
                    </label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Choose an existing account or create a new one for this transaction.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setAccountMode('existing')
                        setShowAccountForm(false)
                      }}
                      className={`px-3 py-1 rounded-lg ${accountMode === 'existing' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                    >
                      Existing
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setAccountMode('new')
                        setShowAccountForm(true)
                      }}
                      className={`px-3 py-1 rounded-lg ${accountMode === 'new' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                    >
                      New
                    </button>
                  </div>
                </div>

                {accountMode === 'existing' ? (
                  <div>
                    <select
                      value={formData.accountId}
                      onChange={(e) =>
                        setFormData({ ...formData, accountId: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {accounts.length > 0 ? (
                        accounts.map((account) => (
                          <option key={account._id} value={account._id}>
                            {account.accountName}
                          </option>
                        ))
                      ) : (
                        <option value="">No accounts available</option>
                      )}
                    </select>
                    {accounts.length === 0 && (
                      <p className="mt-2 text-sm text-amber-600 dark:text-amber-300">
                        No accounts exist yet. Switch to "New" to create one.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        value={accountForm.accountName}
                        onChange={(e) =>
                          setAccountForm(prev => ({ ...prev, accountName: e.target.value }))
                        }
                        required
                        placeholder="Account name"
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-full"
                      />
                      <select
                        value={accountForm.accountType}
                        onChange={(e) =>
                          setAccountForm(prev => ({ ...prev, accountType: e.target.value }))
                        }
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-full"
                      >
                        <option>Bank</option>
                        <option>Cash</option>
                        <option>Credit</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        value={accountForm.initialBalance}
                        onChange={(e) =>
                          setAccountForm(prev => ({ ...prev, initialBalance: e.target.value }))
                        }
                        placeholder="Initial balance"
                        type="number"
                        step="0.01"
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-full"
                      />
                      <input
                        value={accountForm.currency}
                        onChange={(e) =>
                          setAccountForm(prev => ({ ...prev, currency: e.target.value }))
                        }
                        placeholder="Currency"
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleCreateInlineAccount(e)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                      >
                        Create account and use it
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setAccountMode('existing')
                          setShowAccountForm(false)
                        }}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-2 md:col-span-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                >
                  Add Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <Filter size={20} className="text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-transparent outline-none text-slate-900 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <label className="text-sm text-slate-600 dark:text-slate-300">Account</label>
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="bg-transparent outline-none text-slate-900 dark:text-white"
          >
            <option value="">All accounts</option>
            {accounts.map((a) => (
              <option key={a._id} value={a._id}>{a.accountName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-slate-600 dark:text-slate-400">
            No transactions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Account
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="px-6 py-3 text-slate-900 dark:text-white font-medium">
                      {tx.description}
                    </td>
                    <td className="px-6 py-3 text-slate-900 dark:text-white">
                      <span className="text-lg">
                        {categoryIcons[tx.categoryName] || '📦'}
                      </span>{' '}
                      {tx.categoryName}
                    </td>
                    <td className="px-6 py-3">
                      <select
                        value={tx.accountId || ''}
                        onChange={(e) => handleChangeTransactionAccount(tx.id, e.target.value)}
                        className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        {accounts.map((a) => (
                          <option key={a._id} value={a._id}>{a.accountName}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3 text-slate-600 dark:text-slate-400">
                      {tx.date}
                    </td>
                    <td
                      className={`px-6 py-3 text-right font-semibold ${
                        tx.type === 'income'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button type="button" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                          <Edit2 size={16} className="text-blue-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}