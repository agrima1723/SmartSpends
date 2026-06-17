// import React, { useState, useEffect } from 'react'
// import { useAuth } from './AuthContext'

// export default function AccountsPage() {
//   const { token } = useAuth()
//   const [accounts, setAccounts] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [form, setForm] = useState({ accountName: '', accountType: 'Bank', initialBalance: '', currency: 'USD' })
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     if (!token) return
//     fetchAccounts()
//   }, [token])

//   const fetchAccounts = async () => {
//     setLoading(true)
//     try {
//       const res = await fetch('/api/accounts', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await res.json()
//       // API may return array or wrapped object
//       setAccounts(Array.isArray(data) ? data : (data.accounts || []))
//       setError(null)
//     } catch (err) {
//       console.error(err)
//       setError('Could not load accounts')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreate = async (e) => {
//     e.preventDefault()
//     try {
//       const payload = {
//         accountName: form.accountName,
//         accountType: form.accountType,
//         initialBalance: parseFloat(form.initialBalance) || 0,
//         currency: form.currency,
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
//       await fetchAccounts()
//       setForm({ accountName: '', accountType: 'Bank', initialBalance: '', currency: 'USD' })
//     } catch (err) {
//       console.error(err)
//       setError(err.message)
//     }
//   }

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this account?')) return
//     try {
//       const res = await fetch(`/api/accounts/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.error || 'Failed to delete')
//       await fetchAccounts()
//     } catch (err) {
//       console.error(err)
//       setError(err.message)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Accounts</h1>
//       </div>

//       {error && <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
//           <h2 className="text-lg font-semibold mb-4">Create Account</h2>
//           <form onSubmit={handleCreate} className="space-y-4">
//             <div>
//               <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Account Name</label>
//               <input value={form.accountName} onChange={(e) => setForm(prev => ({ ...prev, accountName: e.target.value }))} required className="w-full px-3 py-2 rounded border" />
//             </div>
//             <div>
//               <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Type</label>
//               <select value={form.accountType} onChange={(e) => setForm(prev => ({ ...prev, accountType: e.target.value }))} className="w-full px-3 py-2 rounded border">
//                 <option>Bank</option>
//                 <option>Cash</option>
//                 <option>Credit</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Initial Balance</label>
//               <input value={form.initialBalance} onChange={(e) => setForm(prev => ({ ...prev, initialBalance: e.target.value }))} type="number" step="0.01" className="w-full px-3 py-2 rounded border" />
//             </div>
//             <div>
//               <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Currency</label>
//               <input value={form.currency} onChange={(e) => setForm(prev => ({ ...prev, currency: e.target.value }))} className="w-full px-3 py-2 rounded border" />
//             </div>
//             <div>
//               <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
//             </div>
//           </form>
//         </div>

//         <div className="lg:col-span-2">
//           <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
//             <h2 className="text-lg font-semibold mb-4">Your Accounts</h2>
//             {loading ? (
//               <div>Loading...</div>
//             ) : accounts.length === 0 ? (
//               <div className="text-slate-600">No accounts yet.</div>
//             ) : (
//               <ul className="space-y-3">
//                 {accounts.map(a => (
//                   <li key={a._id} className="flex items-center justify-between p-3 border rounded">
//                     <div>
//                       <div className="font-medium">{a.accountName}</div>
//                       <div className="text-sm text-slate-500">{a.accountType} • {a.currency} • Balance: {a.initialBalance?.toString?.() ?? a.initialBalance}</div>
//                     </div>
//                     <div>
//                       <button onClick={() => handleDelete(a._id)} className="px-3 py-1 bg-red-100 text-red-600 rounded">Delete</button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
// 🌟 IMPORT THE API BASE FROM YOUR UTILS FILE
import { API_BASE } from './utils'

export default function AccountsPage() {
  const { token } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ accountName: '', accountType: 'Bank', initialBalance: '', currency: 'USD' })
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return
    fetchAccounts()
  }, [token])

  const fetchAccounts = async () => {
    setLoading(true)
    try {
      // 🌟 UPDATED ENDPOINT TO USE THE RENDER BACKEND URL
      const res = await fetch(`${API_BASE}/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setAccounts(Array.isArray(data) ? data : (data.accounts || []))
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Could not load accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        accountName: form.accountName,
        accountType: form.accountType,
        initialBalance: parseFloat(form.initialBalance) || 0,
        currency: form.currency,
      }

      // 🌟 UPDATED ENDPOINT TO USE THE RENDER BACKEND URL
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
      await fetchAccounts()
      setForm({ accountName: '', accountType: 'Bank', initialBalance: '', currency: 'USD' })
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this account?')) return
    try {
      // 🌟 UPDATED ENDPOINT TO USE THE RENDER BACKEND URL WITH THE ACCOUNT ID
      const res = await fetch(`${API_BASE}/accounts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete')
      await fetchAccounts()
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  // Safely strips MongoDB Decimal128 wrapper objects if present
  const renderBalance = (balance) => {
    if (balance && typeof balance === 'object' && '$numberDecimal' in balance) {
      return balance.$numberDecimal
    }
    return balance ?? '0'
  }

  // Explicit text and background classes to prevent font fading
  const inputFieldsClasses = "w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white">Accounts</h1>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side Form Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create Account</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Name</label>
              <input value={form.accountName} onChange={(e) => setForm(prev => ({ ...prev, accountName: e.target.value }))} required className={inputFieldsClasses} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select value={form.accountType} onChange={(e) => setForm(prev => ({ ...prev, accountType: e.target.value }))} className={inputFieldsClasses}>
                <option value="Bank">Bank</option>
                <option value="Cash">Cash</option>
                <option value="Credit">Credit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Balance</label>
              <input value={form.initialBalance} onChange={(e) => setForm(prev => ({ ...prev, initialBalance: e.target.value }))} type="number" step="0.01" className={inputFieldsClasses} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Currency</label>
              <input value={form.currency} onChange={(e) => setForm(prev => ({ ...prev, currency: e.target.value }))} className={inputFieldsClasses} />
            </div>
            <div>
              <button type="submit" className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-sm transition-colors">Create</button>
            </div>
          </form>
        </div>

        {/* Right Side List Card */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Your Accounts</h2>
            {loading ? (
              <div className="text-slate-600 dark:text-slate-400 font-medium">Loading...</div>
            ) : accounts.length === 0 ? (
              <div className="text-slate-600 dark:text-slate-400 font-medium">No accounts yet.</div>
            ) : (
              <ul className="space-y-3">
                {accounts.map(a => (
                  <li key={a._id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-base">{a.accountName}</div>
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                        {a.accountType} • {a.currency} • Balance: <span className="font-semibold text-slate-900 dark:text-slate-200">{renderBalance(a.initialBalance)}</span>
                      </div>
                    </div>
                    <div>
                      <button onClick={() => handleDelete(a._id)} className="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 text-sm font-semibold rounded-md transition-colors">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}