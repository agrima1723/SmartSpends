// // import React, { useState, useEffect } from 'react'
// // import { useAuth } from './AuthContext'
// // import { Plus, Trash2, Edit2, Toggle2, Calendar } from 'lucide-react'
// import React, { useState, useEffect } from 'react'
// import { useAuth } from './AuthContext'
// import { Plus, Trash2, Edit2, ToggleLeft, Calendar } from 'lucide-react'
// const RecurringPage = () => {
//   const { token } = useAuth()
//   const [recurring, setRecurring] = useState([])
//   const [upcoming, setUpcoming] = useState([])
//   const [accounts, setAccounts] = useState([])
//   const [categories, setCategories] = useState([])
//   const parseDecimalValue = (value) => {
//     if (value == null) return 0
//     if (typeof value === 'number') return value
//     if (typeof value === 'string') {
//       const parsed = parseFloat(value)
//       return Number.isNaN(parsed) ? 0 : parsed
//     }
//     if (typeof value === 'object') {
//       if ('$numberDecimal' in value) {
//         const parsed = parseFloat(value.$numberDecimal)
//         return Number.isNaN(parsed) ? 0 : parsed
//       }
//       if (typeof value.toString === 'function') {
//         const parsed = parseFloat(value.toString())
//         return Number.isNaN(parsed) ? 0 : parsed
//       }
//     }
//     return 0
//   }
//   const [loading, setLoading] = useState(true)
//   const [showForm, setShowForm] = useState(false)
//   const [editingItem, setEditingItem] = useState(null)
//   const [formData, setFormData] = useState({
//     accountId: '',
//     categoryId: '',
//     type: 'expense',
//     amount: '',
//     description: '',
//     frequency: 'monthly',
//     endDate: '',
//   })

//   // Fetch recurring transactions
//   const fetchRecurring = async () => {
//     try {
//       const response = await fetch('/api/recurring', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await response.json()
//       setRecurring(data.recurring || [])
//     } catch (error) {
//       console.error('Failed to fetch recurring:', error)
//     }
//   }

//   const fetchAccounts = async () => {
//     try {
//       const response = await fetch('/api/accounts', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await response.json()
//       const list = data.accounts || []
//       setAccounts(list)
//       if (list.length > 0 && !formData.accountId) {
//         setFormData((prev) => ({ ...prev, accountId: list[0]._id }))
//       }
//     } catch (error) {
//       console.error('Failed to fetch accounts:', error)
//     }
//   }

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch('/api/categories', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await response.json()
//       const list = data.categories || []
//       setCategories(list)
//       if (list.length > 0 && !formData.categoryId) {
//         setFormData((prev) => ({ ...prev, categoryId: list[0]._id }))
//       }
//     } catch (error) {
//       console.error('Failed to fetch categories:', error)
//     }
//   }

//   // Fetch upcoming recurring
//   const fetchUpcoming = async () => {
//     try {
//       const response = await fetch('/api/recurring/upcoming?days=30', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await response.json()
//       setUpcoming(data.recurring || [])
//     } catch (error) {
//       console.error('Failed to fetch upcoming:', error)
//     }
//   }

//   useEffect(() => {
//     if (!token) {
//       setLoading(false)
//       return
//     }

//     const loadData = async () => {
//       setLoading(true)
//       await Promise.all([fetchAccounts(), fetchCategories(), fetchRecurring(), fetchUpcoming()])
//       setLoading(false)
//     }

//     loadData()
//   }, [token])

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleCreateRecurring = async (e) => {
//     e.preventDefault()
//     try {
//       const method = editingItem ? 'PATCH' : 'POST'
//       const url = editingItem
//         ? `/api/recurring/${editingItem._id}`
//         : '/api/recurring'

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       })

//       if (response.ok) {
//         await fetchRecurring()
//         await fetchUpcoming()
//         setFormData({
//           accountId: '',
//           categoryId: '',
//           type: 'expense',
//           amount: '',
//           description: '',
//           frequency: 'monthly',
//           endDate: '',
//         })
//         setEditingItem(null)
//         setShowForm(false)
//         alert(editingItem ? 'Recurring transaction updated!' : 'Recurring transaction created!')
//       }
//     } catch (error) {
//       console.error('Error:', error)
//       alert('Error saving recurring transaction')
//     }
//   }

//   const handleEditRecurring = (item) => {
//     setEditingItem(item)
//     setFormData({
//       accountId: item.accountId?._id || item.accountId || '',
//       categoryId: item.categoryId?._id || item.categoryId || '',
//       type: item.type,
//       amount: item.amount,
//       description: item.description,
//       frequency: item.frequency,
//       endDate: item.endDate ? item.endDate.split('T')[0] : '',
//     })
//     setShowForm(true)
//   }

//   const handleDeleteRecurring = async (id) => {
//     if (!window.confirm('Delete this recurring transaction?')) return

//     try {
//       const response = await fetch(`/api/recurring/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (response.ok) {
//         await fetchRecurring()
//         alert('Deleted successfully!')
//       }
//     } catch (error) {
//       console.error('Error deleting:', error)
//     }
//   }

//   const handleToggleRecurring = async (id) => {
//     try {
//       const response = await fetch(`/api/recurring/${id}/toggle`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (response.ok) {
//         await fetchRecurring()
//         alert('Status updated!')
//       }
//     } catch (error) {
//       console.error('Error toggling:', error)
//     }
//   }

//   if (loading) {
//     return <div className="text-slate-600 dark:text-slate-400">Loading...</div>
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold dark:text-white dark:text-white">Recurring Transactions</h1>
//         <button
//           onClick={() => {
//             setEditingItem(null)
//             setFormData({
//               accountId: '',
//               categoryId: '',
//               type: 'expense',
//               amount: '',
//               description: '',
//               frequency: 'monthly',
//               endDate: '',
//             })
//             setShowForm(!showForm)
//           }}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
//         >
//           <Plus size={20} />
//           New Transaction
//         </button>
//       </div>

//       {showForm && (
//         <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
//           <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
//             {editingItem ? 'Edit Recurring Transaction' : 'Create Recurring Transaction'}
//           </h2>
//           <form onSubmit={handleCreateRecurring} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                   Type
//                 </label>
//                 <select
//                   name="type"
//                   value={formData.type}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="expense">Expense</option>
//                   <option value="income">Income</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                   Frequency
//                 </label>
//                 <select
//                   name="frequency"
//                   value={formData.frequency}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="daily">Daily</option>
//                   <option value="weekly">Weekly</option>
//                   <option value="monthly">Monthly</option>
//                   <option value="yearly">Yearly</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                 Description
//               </label>
//               <input
//                 type="text"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="e.g., Netflix Subscription"
//                 required
//                 className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                   Amount
//                 </label>
//                 <input
//                   type="number"
//                   name="amount"
//                   value={formData.amount}
//                   onChange={handleInputChange}
//                   placeholder="0.00"
//                   step="0.01"
//                   required
//                   className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                   Account
//                 </label>
//                 <select
//                   name="accountId"
//                   value={formData.accountId}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select account</option>
//                   {accounts.map((account) => (
//                     <option key={account._id} value={account._id}>
//                       {account.accountName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                   Category
//                 </label>
//                 <select
//                   name="categoryId"
//                   value={formData.categoryId}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select category</option>
//                   {categories.map((category) => (
//                     <option key={category._id} value={category._id}>
//                       {category.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                   End Date (Optional)
//                 </label>
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-2 pt-4">
//               <button
//                 type="submit"
//                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
//               >
//                 {editingItem ? 'Update' : 'Create'}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowForm(false)
//                   setEditingItem(null)
//                 }}
//                 className="flex-1 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-900 dark:text-white py-2 rounded-lg transition font-medium"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Upcoming Section */}
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
//         <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
//           <Calendar size={20} />
//           Upcoming (Next 30 Days)
//         </h2>
//         {upcoming.length === 0 ? (
//           <p className="text-slate-600 dark:text-slate-400">No upcoming transactions</p>
//         ) : (
//           <div className="space-y-2">
//             {upcoming.map(item => (
//               <div key={item._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded">
//                 <div>
//                   <p className="font-medium text-slate-900 dark:text-white">{item.description}</p>
//                   <p className="text-sm text-slate-600 dark:text-slate-400">
//                     {new Date(item.nextOccurrence).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <p className="font-semibold text-slate-900 dark:text-white">
//                   ${parseDecimalValue(item.amount).toFixed(2)}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Active Recurring */}
//       <div className="space-y-3">
//         <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Active Recurring</h2>
//         {recurring.filter(r => r.isActive).length === 0 ? (
//           <div className="text-slate-600 dark:text-slate-400 text-center py-8">
//             No active recurring transactions
//           </div>
//         ) : (
//           recurring.filter(r => r.isActive).map(item => (
//             <div key={item._id} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="font-semibold text-slate-900 dark:text-white">{item.description}</h3>
//                   <p className="text-sm text-slate-600 dark:text-slate-400">
//                     {item.frequency.charAt(0).toUpperCase() + item.frequency.slice(1)} • {item.type}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-semibold text-slate-900 dark:text-white">
//                     ${parseDecimalValue(item.amount).toFixed(2)}
//                   </p>
//                   <p className="text-sm text-slate-600 dark:text-slate-400">
//                     Next: {new Date(item.nextOccurrence).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex gap-2 mt-3">
//                 <button
//                   onClick={() => handleToggleRecurring(item._id)}
//                   className="flex-1 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 py-2 rounded transition"
//                 >
//                   Pause
//                 </button>
//                 <button
//                   onClick={() => handleEditRecurring(item)}
//                   className="flex-1 bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-600 dark:text-amber-300 py-2 rounded flex items-center justify-center gap-2 transition"
//                 >
//                   <Edit2 size={16} />
//                 </button>
//                 <button
//                   onClick={() => handleDeleteRecurring(item._id)}
//                   className="flex-1 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-300 py-2 rounded flex items-center justify-center gap-2 transition"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

// export default RecurringPage
import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { Plus, Trash2, Edit2, ToggleLeft, Calendar } from 'lucide-react'
import { API_BASE } from './utils' // ✅ Imported global backend environment variable

const RecurringPage = () => {
  const { token } = useAuth()
  const [recurring, setRecurring] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [accounts, setAccounts] = useState([])
  const [categories, setCategories] = useState([])

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

  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    accountId: '',
    categoryId: '',
    type: 'expense',
    amount: '',
    description: '',
    frequency: 'monthly',
    endDate: '',
  })

  // Fetch recurring transactions (Passing active=false so we pull ALL entries to check expired states)
  const fetchRecurring = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/recurring?active=false`, { // ✅ Added API_BASE
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setRecurring(data.recurring || [])
    } catch (error) {
      console.error('Failed to fetch recurring:', error)
    }
  }

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/accounts`, { // ✅ Added API_BASE
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      const list = data.accounts || []
      setAccounts(list)
      if (list.length > 0 && !formData.accountId) {
        setFormData((prev) => ({ ...prev, accountId: list[0]._id }))
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/categories`, { // ✅ Added API_BASE
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      const list = data.categories || []
      setCategories(list)
      if (list.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: list[0]._id }))
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchUpcoming = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/recurring/upcoming?days=30`, { // ✅ Added API_BASE
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setUpcoming(data.recurring || [])
    } catch (error) {
      console.error('Failed to fetch upcoming:', error)
    }
  }

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchAccounts(), fetchCategories(), fetchRecurring(), fetchUpcoming()])
      setLoading(false)
    }

    loadData()
  }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCreateRecurring = async (e) => {
    e.preventDefault()
    try {
      const method = editingItem ? 'PATCH' : 'POST'
      const url = editingItem
        ? `${API_BASE}/api/recurring/${editingItem._id}` // ✅ Added API_BASE
        : `${API_BASE}/api/recurring` // ✅ Added API_BASE

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchRecurring()
        await fetchUpcoming()
        setFormData({
          accountId: accounts[0]?._id || '',
          categoryId: categories[0]?._id || '',
          type: 'expense',
          amount: '',
          description: '',
          frequency: 'monthly',
          endDate: '',
        })
        setEditingItem(null)
        setShowForm(false)
        alert(editingItem ? 'Recurring transaction updated!' : 'Recurring transaction created!')
      }
    } catch (error) {
      console.error('Error saving recurring transaction:', error)
      alert('Error saving recurring transaction')
    }
  }

  const handleEditRecurring = (item) => {
    setEditingItem(item)
    setFormData({
      accountId: item.accountId?._id || item.accountId || '',
      categoryId: item.categoryId?._id || item.categoryId || '',
      type: item.type,
      amount: item.amount,
      description: item.description,
      frequency: item.frequency,
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
    })
    setShowForm(true)
  }

  const handleDeleteRecurring = async (id) => {
    if (!window.confirm('Delete this recurring transaction?')) return

    try {
      const response = await fetch(`${API_BASE}/api/recurring/${id}`, { // ✅ Added API_BASE
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        await fetchRecurring()
        await fetchUpcoming()
        alert('Deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const handleToggleRecurring = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/recurring/${id}/toggle`, { // ✅ Added API_BASE
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        await fetchRecurring()
        await fetchUpcoming()
        alert('Status updated!')
      }
    } catch (error) {
      console.error('Error toggling state:', error)
    }
  }

  if (loading) {
    return <div className="text-slate-600 dark:text-slate-400 p-6 font-medium">Loading recurring dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white">Recurring Transactions</h1>
        <button
          onClick={() => {
            setEditingItem(null)
            setFormData({
              accountId: accounts[0]?._id || '',
              categoryId: categories[0]?._id || '',
              type: 'expense',
              amount: '',
              description: '',
              frequency: 'monthly',
              endDate: '',
            })
            setShowForm(!showForm)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium shadow-sm"
        >
          <Plus size={20} />
          New Transaction
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            {editingItem ? 'Edit Recurring Transaction' : 'Create Recurring Transaction'}
          </h2>
          <form onSubmit={handleCreateRecurring} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Frequency
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Netflix Subscription"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Account
                </label>
                <select
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select account</option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.accountName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium shadow-sm"
              >
                {editingItem ? 'Update Cycle' : 'Create Cycle'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingItem(null)
                }}
                className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white py-2 rounded-lg transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upcoming Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-blue-500" />
          Upcoming Runs (Next 30 Days)
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">No upcoming transactions planned</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map(item => (
              <div key={item._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{item.description}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Next Run: {item.nextOccurrence ? new Date(item.nextOccurrence).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  ${parseDecimalValue(item.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Recurring Cards */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Active Recurrences</h2>
        {recurring.filter(r => r.isActive).length === 0 ? (
          <div className="text-slate-500 dark:text-slate-400 text-center py-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm">
            No active trackers live
          </div>
        ) : (
          recurring.filter(r => r.isActive).map(item => (
            <div key={item._id} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.description}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.frequency.charAt(0).toUpperCase() + item.frequency.slice(1)} • {item.type}
                    {item.endDate && ` • Ends: ${new Date(item.endDate).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    ${parseDecimalValue(item.amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Next Run: {item.nextOccurrence ? new Date(item.nextOccurrence).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleToggleRecurring(item._id)}
                  className="flex-1 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 py-2 rounded-lg transition text-sm font-medium"
                >
                  Pause Tracker
                </button>
                <button
                  onClick={() => handleEditRecurring(item)}
                  className="bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-600 dark:text-amber-400 px-4 rounded-lg flex items-center justify-center transition"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteRecurring(item._id)}
                  className="bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 px-4 rounded-lg flex items-center justify-center transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inactive / Finished Cycle Trackers */}
      <div className="space-y-3 pt-4">
        <h2 className="text-xl font-semibold text-slate-500 dark:text-slate-400">Expired or Paused Cycles</h2>
        {recurring.filter(r => !r.isActive).length === 0 ? (
          <p className="text-sm text-slate-400 italic bg-slate-50 dark:bg-slate-900/20 p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
            No expired or paused trackers found.
          </p>
        ) : (
          recurring.filter(r => !r.isActive).map(item => (
            <div key={item._id} className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-lg border border-slate-200 dark:border-slate-800 opacity-75 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-600 dark:text-slate-400 line-through">{item.description}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Cycle Finished {item.endDate && `on ${new Date(item.endDate).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-600 dark:text-slate-400">
                    ${parseDecimalValue(item.amount).toFixed(2)}
                  </p>
                  <span className="inline-block text-xs bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded mt-1 font-medium">
                    {item.endDate && new Date(item.endDate) < new Date() ? 'Finished' : 'Paused'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleToggleRecurring(item._id)}
                  className="flex-1 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 py-2 rounded-lg transition text-xs font-medium"
                >
                  Re-Activate Cycle
                </button>
                <button
                  onClick={() => handleDeleteRecurring(item._id)}
                  className="bg-red-50 dark:bg-red-950 hover:bg-red-100 text-red-600 dark:text-red-400 px-3 rounded-lg flex items-center justify-center transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecurringPage