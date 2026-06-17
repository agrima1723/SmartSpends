// import React, { useState, useEffect } from 'react'
// import { useAuth } from './AuthContext'
// import { Plus, Trash2, Edit2, AlertCircle, Calendar } from 'lucide-react'

// const WarrantyPage = () => {
//   const { token } = useAuth()
//   const [warranties, setWarranties] = useState([])
//   const [expiringCount, setExpiringCount] = useState(0)
//   const [showForm, setShowForm] = useState(false)
//   const [editingWarranty, setEditingWarranty] = useState(null)
//   const [formData, setFormData] = useState({
//     productName: '',
//     purchaseDate: '',
//     warrantyDuration: 1,
//     warrantyUnit: 'years',
//     amount: '',
//     vendor: '',
//     category: 'Electronics',
//     notes: '',
//   })

//   useEffect(() => {
//     fetchWarranties()
//     fetchExpiringCount()
//   }, [token])

//   const fetchWarranties = async () => {
//     try {
//       const res = await fetch('/api/warranty', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await res.json()
//       setWarranties(data.warranties || [])
//     } catch (error) {
//       console.error('Error:', error)
//     }
//   }

//   const fetchExpiringCount = async () => {
//     try {
//       const res = await fetch('/api/warranty/expiring/soon', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await res.json()
//       setExpiringCount(data.count || 0)
//     } catch (error) {
//       console.error('Error:', error)
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const method = editingWarranty ? 'PUT' : 'POST'
//     const url = editingWarranty
//       ? `/api/warranty/${editingWarranty._id}`
//       : '/api/warranty'

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       })
//       if (res.ok) {
//         await fetchWarranties()
//         await fetchExpiringCount()
//         setFormData({
//           productName: '',
//           purchaseDate: '',
//           warrantyDuration: 1,
//           warrantyUnit: 'years',
//           amount: '',
//           vendor: '',
//           category: 'Electronics',
//           notes: '',
//         })
//         setEditingWarranty(null)
//         setShowForm(false)
//         alert(editingWarranty ? 'Warranty updated!' : 'Warranty added!')
//       }
//     } catch (error) {
//       console.error('Error:', error)
//     }
//   }

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this warranty?')) return
//     try {
//       const res = await fetch(`/api/warranty/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       if (res.ok) {
//         await fetchWarranties()
//         alert('Warranty deleted!')
//       }
//     } catch (error) {
//       console.error('Error:', error)
//     }
//   }

//   const handleEdit = (warranty) => {
//     setEditingWarranty(warranty)
//     setFormData({
//       productName: warranty.productName,
//       purchaseDate: warranty.purchaseDate.split('T')[0],
//       warrantyDuration: warranty.warrantyDuration,
//       warrantyUnit: warranty.warrantyUnit,
//       amount: warranty.amount ? parseFloat(warranty.amount.toString()) : '',
//       vendor: warranty.vendor,
//       category: warranty.category,
//       notes: warranty.notes,
//     })
//     setShowForm(true)
//   }

//   const isExpiring = (expiryDate) => {
//     const expiry = new Date(expiryDate)
//     const today = new Date()
//     const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
//     return daysLeft <= 30 && daysLeft > 0
//   }

//   const daysUntilExpiry = (expiryDate) => {
//     const expiry = new Date(expiryDate)
//     const today = new Date()
//     return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
//   }

//   const isExpired = (expiryDate) => {
//     const expiry = new Date(expiryDate)
//     return expiry < new Date()
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Warranty Tracker</h1>
//         <button
//           onClick={() => {
//             setEditingWarranty(null)
//             setFormData({
//               productName: '',
//               purchaseDate: '',
//               warrantyDuration: 1,
//               warrantyUnit: 'years',
//               amount: '',
//               vendor: '',
//               category: 'Electronics',
//               notes: '',
//             })
//             setShowForm(!showForm)
//           }}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//         >
//           <Plus size={20} /> Add Warranty
//         </button>
//       </div>

//       {expiringCount > 0 && (
//         <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg flex items-center gap-3">
//           <AlertCircle size={24} className="text-amber-600" />
//           <div>
//             <p className="font-semibold text-amber-900 dark:text-amber-100">{expiringCount} warranties expiring soon</p>
//             <p className="text-sm text-amber-800 dark:text-amber-200">Check the list below for details</p>
//           </div>
//         </div>
//       )}

//       {showForm && (
//         <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-lg space-y-4">
//           <input
//             type="text"
//             placeholder="Product name"
//             value={formData.productName}
//             onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
//             required
//             className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//           />
//           <input
//             type="date"
//             value={formData.purchaseDate}
//             onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
//             required
//             className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//           />
//           <div className="grid grid-cols-3 gap-2">
//             <input
//               type="number"
//               placeholder="Duration"
//               value={formData.warrantyDuration}
//               onChange={(e) => setFormData({ ...formData, warrantyDuration: parseInt(e.target.value) })}
//               required
//               className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//             />
//             <select
//               value={formData.warrantyUnit}
//               onChange={(e) => setFormData({ ...formData, warrantyUnit: e.target.value })}
//               className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//             >
//               <option value="days">Days</option>
//               <option value="months">Months</option>
//               <option value="years">Years</option>
//             </select>
//           </div>
//           <select
//             value={formData.category}
//             onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//             className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//           >
//             <option value="Electronics">Electronics</option>
//             <option value="Appliances">Appliances</option>
//             <option value="Furniture">Furniture</option>
//             <option value="Vehicle">Vehicle</option>
//             <option value="Other">Other</option>
//           </select>
//           <input
//             type="number"
//             placeholder="Amount (optional)"
//             value={formData.amount}
//             onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//             step="0.01"
//             className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//           />
//           <input
//             type="text"
//             placeholder="Vendor"
//             value={formData.vendor}
//             onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
//             className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//           />
//           <textarea
//             placeholder="Notes"
//             value={formData.notes}
//             onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//             rows="2"
//             className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//           />
//           <div className="flex gap-2">
//             <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">
//               {editingWarranty ? 'Update' : 'Add'}
//             </button>
//             <button
//               type="button"
//               onClick={() => setShowForm(false)}
//               className="flex-1 bg-slate-300 dark:bg-slate-600 py-2 rounded-lg"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}

//       <div className="space-y-3">
//         {warranties.map((warranty) => (
//           <div
//             key={warranty._id}
//             className={`p-4 rounded-lg border ${
//               isExpired(warranty.expiryDate)
//                 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
//                 : isExpiring(warranty.expiryDate)
//                 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
//                 : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
//             }`}
//           >
//             <div className="flex justify-between items-start mb-2">
//               <div>
//                 <h3 className="font-semibold text-slate-900 dark:text-white">{warranty.productName}</h3>
//                 <p className="text-sm text-slate-600 dark:text-slate-400">{warranty.vendor}</p>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleEdit(warranty)}
//                   className="bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 text-blue-600 dark:text-blue-300 p-2 rounded transition"
//                 >
//                   <Edit2 size={16} />
//                 </button>
//                 <button
//                   onClick={() => handleDelete(warranty._id)}
//                   className="bg-red-100 dark:bg-red-900 hover:bg-red-200 text-red-600 dark:text-red-300 p-2 rounded transition"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//               <div>
//                 <p className="text-slate-600 dark:text-slate-400">Category</p>
//                 <p className="font-semibold text-slate-900 dark:text-white">{warranty.category}</p>
//               </div>
//               <div>
//                 <p className="text-slate-600 dark:text-slate-400">Expiry</p>
//                 <p className="font-semibold text-slate-900 dark:text-white">
//                   {new Date(warranty.expiryDate).toLocaleDateString()}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-slate-600 dark:text-slate-400">
//                   {isExpired(warranty.expiryDate) ? 'Expired' : 'Days Left'}
//                 </p>
//                 <p
//                   className={`font-semibold ${
//                     isExpired(warranty.expiryDate)
//                       ? 'text-red-600 dark:text-red-400'
//                       : isExpiring(warranty.expiryDate)
//                       ? 'text-amber-600 dark:text-amber-400'
//                       : 'text-green-600 dark:text-green-400'
//                   }`}
//                 >
//                   {isExpired(warranty.expiryDate) ? 'EXPIRED' : daysUntilExpiry(warranty.expiryDate) + ' days'}
//                 </p>
//               </div>
//               {warranty.amount && (
//                 <div>
//                   <p className="text-slate-600 dark:text-slate-400">Amount</p>
//                   <p className="font-semibold text-slate-900 dark:text-white">
//                     ${parseFloat(warranty.amount.toString()).toFixed(2)}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {warranties.length === 0 && !showForm && (
//         <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg">
//           <Calendar size={48} className="mx-auto mb-4 text-slate-300" />
//           <p className="text-slate-600 dark:text-slate-400">No warranties yet</p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default WarrantyPage
import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { Plus, Trash2, Edit2, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react'

const WarrantyPage = () => {
  const { token } = useAuth()
  const [warranties, setWarranties] = useState([])
  const [expiringCount, setExpiringCount] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editingWarranty, setEditingWarranty] = useState(null)
  const [formData, setFormData] = useState({
    productName: '',
    purchaseDate: '',
    warrantyDuration: 1,
    warrantyUnit: 'years',
    amount: '',
    vendor: '',
    category: 'Electronics',
    notes: '',
  })

  useEffect(() => {
    fetchWarranties()
    fetchExpiringCount()
  }, [token])

  const fetchWarranties = async () => {
    try {
      const res = await fetch('/api/warranty', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setWarranties(data.warranties || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchExpiringCount = async () => {
    try {
      const res = await fetch('/api/warranty/expiring/soon', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setExpiringCount(data.count || 0)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editingWarranty ? 'PUT' : 'POST'
    const url = editingWarranty ? `/api/warranty/${editingWarranty._id}` : '/api/warranty'

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        await fetchWarranties()
        await fetchExpiringCount()
        setFormData({ productName: '', purchaseDate: '', warrantyDuration: 1, warrantyUnit: 'years', amount: '', vendor: '', category: 'Electronics', notes: '' })
        setEditingWarranty(null)
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this warranty?')) return
    try {
      const res = await fetch(`/api/warranty/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        await fetchWarranties()
        await fetchExpiringCount()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (warranty) => {
    setEditingWarranty(warranty)
    setFormData({
      productName: warranty.productName,
      purchaseDate: warranty.purchaseDate.split('T')[0],
      warrantyDuration: warranty.warrantyDuration,
      warrantyUnit: warranty.warrantyUnit,
      amount: warranty.amount ? parseFloat(warranty.amount.toString()) : '',
      vendor: warranty.vendor,
      category: warranty.category,
      notes: warranty.notes,
    })
    setShowForm(true)
  }

  const isExpiring = (expiryDate) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    return daysLeft <= 30 && daysLeft > 0
  }

  const daysUntilExpiry = (expiryDate) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  }

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date()
  }

  // Returns unique glass glow borders depending on timeline protection metrics
  const getWarrantyStatusStyles = (expiryDate) => {
    if (isExpired(expiryDate)) {
      return 'bg-red-500/5 border-red-500/30 hover:border-red-500/60 shadow-red-900/10'
    }
    if (isExpiring(expiryDate)) {
      return 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/60 shadow-amber-900/10 animate-pulse'
    }
    return 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50 shadow-emerald-900/5'
  }

  return (
    <div className="space-y-6 p-1 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-cyan-400" /> Warranty Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1">Never lose out on a claim deadline again.</p>
        </div>
        <button
          onClick={() => {
            setEditingWarranty(null)
            setFormData({ productName: '', purchaseDate: '', warrantyDuration: 1, warrantyUnit: 'years', amount: '', vendor: '', category: 'Electronics', notes: '' })
            setShowForm(!showForm)
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-cyan-500/20"
        >
          <Plus size={18} /> Add Warranty
        </button>
      </div>

      {expiringCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 p-4 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-lg animate-bounce-subtle">
          <AlertCircle size={22} className="text-amber-400 animate-pulse" />
          <div>
            <p className="font-bold text-amber-200">{expiringCount} items require immediate attention</p>
            <p className="text-xs text-amber-300/80">Protection terms expire within the next 30 days.</p>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl space-y-4 border border-white/10 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product name"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              required
              className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              required
              className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-2 col-span-2">
              <input
                type="number"
                placeholder="Duration"
                value={formData.warrantyDuration}
                onChange={(e) => setFormData({ ...formData, warrantyDuration: parseInt(e.target.value) || 1 })}
                required
                className="w-1/2 px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
              <select
                value={formData.warrantyUnit}
                onChange={(e) => setFormData({ ...formData, warrantyUnit: e.target.value })}
                className="w-1/2 px-4 py-3 border border-white/10 rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              >
                <option value="days">Days</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-white/10 rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            >
              <option value="Electronics">Electronics</option>
              <option value="Appliances">Appliances</option>
              <option value="Furniture">Furniture</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Amount (optional)"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              step="0.01"
              className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            <input
              type="text"
              placeholder="Vendor"
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>
          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows="2"
            className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-cyan-500/10">
              {editingWarranty ? 'Update Warranty' : 'Track Warranty'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {warranties.map((warranty) => (
          <div
            key={warranty._id}
            className={`p-5 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:-translate-y-0.5 ${getWarrantyStatusStyles(warranty.expiryDate)}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{warranty.productName}</h3>
                <p className="text-sm text-slate-400 font-medium mt-0.5">{warranty.vendor || 'Unknown Provider'}</p>
              </div>
              <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/15">
                <button
                  onClick={() => handleEdit(warranty)}
                  className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 p-2 rounded-lg transition"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(warranty._id)}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 p-2 rounded-lg transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-black/20 p-4 rounded-xl border border-white/5">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Category</p>
                <p className="font-bold text-slate-200 mt-0.5">{warranty.category}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Expiry Date</p>
                <p className="font-bold text-slate-200 mt-0.5">
                  {new Date(warranty.expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {isExpired(warranty.expiryDate) ? 'Status' : 'Time Remaining'}
                </p>
                <p
                  className={`font-black uppercase tracking-wide mt-0.5 ${
                    isExpired(warranty.expiryDate)
                      ? 'text-red-400'
                      : isExpiring(warranty.expiryDate)
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {isExpired(warranty.expiryDate) ? '⛔ Expired' : `${daysUntilExpiry(warranty.expiryDate)} Days`}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Assigned Cost</p>
                <p className="font-extrabold text-white mt-0.5 text-lg">
                  {warranty.amount ? `$${parseFloat(warranty.amount.toString()).toFixed(2)}` : '—'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {warranties.length === 0 && !showForm && (
        <div className="text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Sparkles size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-400 font-medium">No warranty records logged inside your protection pipeline.</p>
        </div>
      )}
    </div>
  )
}

export default WarrantyPage