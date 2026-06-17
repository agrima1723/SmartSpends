// import React, { useState, useEffect } from 'react'
// import { useAuth } from './AuthContext'

// export default function CategoriesPage() {
//   const { token } = useAuth()
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [form, setForm] = useState({ name: '', type: 'expense', icon: '', color: '#6366F1' })
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     if (!token) return
//     fetchCategories()
//   }, [token])

//   const fetchCategories = async () => {
//     setLoading(true)
//     try {
//       const res = await fetch('/api/categories', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await res.json()
//       setCategories(Array.isArray(data) ? data : (data.categories || []))
//       setError(null)
//     } catch (err) {
//       console.error(err)
//       setError('Could not load categories')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreate = async (e) => {
//     e.preventDefault()
//     try {
//       const payload = { name: form.name, type: form.type, icon: form.icon || 'Tag', color: form.color }
//       const res = await fetch('/api/categories', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify(payload),
//       })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.error || 'Failed to create category')
//       await fetchCategories()
//       setForm({ name: '', type: 'expense', icon: '', color: '#6366F1' })
//     } catch (err) {
//       console.error(err)
//       setError(err.message)
//     }
//   }

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this category?')) return
//     try {
//       const res = await fetch(`/api/categories/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.error || 'Failed to delete')
//       await fetchCategories()
//     } catch (err) {
//       console.error(err)
//       setError(err.message)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold dark:text-white dark:text-white">Categories</h1>
//       </div>

//       {error && <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
//           <h2 className="text-lg font-semibold mb-4">Create Category</h2>
//           <form onSubmit={handleCreate} className="space-y-4">
//             <div>
//               <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Name</label>
//               <input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} required className="w-full px-3 py-2 rounded border" />
//             </div>
//             <div>
//               <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Type</label>
//               <select value={form.type} onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))} className="w-full px-3 py-2 rounded border">
//                 <option value="expense">Expense</option>
//                 <option value="income">Income</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Icon</label>
//               <input value={form.icon} onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))} className="w-full px-3 py-2 rounded border" />
//             </div>
//             <div>
//               <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Color</label>
//               <input value={form.color} onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))} type="color" className="w-16 h-10" />
//             </div>
//             <div>
//               <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
//             </div>
//           </form>
//         </div>

//         <div className="lg:col-span-2">
//           <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
//             <h2 className="text-lg font-semibold mb-4">Your Categories</h2>
//             {loading ? (
//               <div>Loading...</div>
//             ) : categories.length === 0 ? (
//               <div className="text-slate-600">No categories yet.</div>
//             ) : (
//               <ul className="space-y-3">
//                 {categories.map(c => (
//                   <li key={c._id} className="flex items-center justify-between p-3 border rounded">
//                     <div>
//                       <div className="font-medium">{c.name}</div>
//                       <div className="text-sm text-slate-500">{c.type}</div>
//                     </div>
//                     <div>
//                       <button onClick={() => handleDelete(c._id)} className="px-3 py-1 bg-red-100 text-red-600 rounded">Delete</button>
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
import { API_BASE } from './utils' // ✅ Added global configuration import

export default function CategoriesPage() {
  const { token } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'expense', icon: '', color: '#6366F1' })
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return
    fetchCategories()
  }, [token])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/categories`, { // ✅ Added API_BASE
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : (data.categories || []))
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Could not load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const payload = { name: form.name, type: form.type, icon: form.icon || 'Tag', color: form.color }
      const res = await fetch(`${API_BASE}/categories`, { // ✅ Added API_BASE
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create category')
      await fetchCategories()
      setForm({ name: '', type: 'expense', icon: '', color: '#6366F1' })
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, { // ✅ Added API_BASE
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete')
      await fetchCategories()
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  // Explicit color and background rules to prevent invisible/faded inputs
  const inputClasses = "w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white">Categories</h1>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Category Card Form */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create Category</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Name</label>
              <input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} required className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))} className={inputClasses}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Icon</label>
              <input value={form.icon} onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))} className={inputClasses} placeholder="e.g., Tag, Fastfood, Shopping" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Color</label>
              <input value={form.color} onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))} type="color" className="w-16 h-10 block rounded cursor-pointer border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
            </div>
            <div>
              <button type="submit" className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-sm transition-colors">Create</button>
            </div>
          </form>
        </div>

        {/* Your Categories List Dashboard Card */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Your Categories</h2>
            {loading ? (
              <div className="text-slate-600 dark:text-slate-400 font-medium">Loading...</div>
            ) : categories.length === 0 ? (
              <div className="text-slate-600 dark:text-slate-400 font-medium">No categories yet.</div>
            ) : (
              <ul className="space-y-3">
                {categories.map(c => (
                  <li key={c._id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: c.color || '#6366F1' }} />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-base capitalize">{c.name}</div>
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">{c.type}</div>
                      </div>
                    </div>
                    <div>
                      <button onClick={() => handleDelete(c._id)} className="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 text-sm font-semibold rounded-md transition-colors">Delete</button>
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