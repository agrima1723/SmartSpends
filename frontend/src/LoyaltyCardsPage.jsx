// import React, { useState, useEffect } from 'react'
// import { useAuth } from './AuthContext'
// import { Plus, Trash2, Edit2, Copy, DollarSign } from 'lucide-react'

// const LoyaltyCardsPage = () => {
//   const { token } = useAuth()
//   const [cards, setCards] = useState([])
//   const [showForm, setShowForm] = useState(false)
//   const [editingCard, setEditingCard] = useState(null)
//   const [formData, setFormData] = useState({
//     brandName: '',
//     cardNumber: '',
//     category: 'Retail',
//     points: 0,
//     expiryDate: '',
//     notes: '',
//   })

//   useEffect(() => {
//     fetchCards()
//   }, [token])

//   const fetchCards = async () => {
//     try {
//       const res = await fetch('/api/loyalty', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await res.json()
//       setCards(data.cards || [])
//     } catch (error) {
//       console.error('Error:', error)
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const method = editingCard ? 'PUT' : 'POST'
//     const url = editingCard
//       ? `/api/loyalty/${editingCard._id}`
//       : '/api/loyalty'

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
//         await fetchCards()
//         setFormData({ brandName: '', cardNumber: '', category: 'Retail', points: 0, expiryDate: '', notes: '' })
//         setEditingCard(null)
//         setShowForm(false)
//         alert(editingCard ? 'Card updated!' : 'Card created!')
//       }
//     } catch (error) {
//       console.error('Error:', error)
//     }
//   }

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this card?')) return
//     try {
//       const res = await fetch(`/api/loyalty/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       if (res.ok) {
//         await fetchCards()
//         alert('Card deleted!')
//       }
//     } catch (error) {
//       console.error('Error:', error)
//     }
//   }

//   const handleEdit = (card) => {
//     setEditingCard(card)
//     setFormData({
//       brandName: card.brandName,
//       cardNumber: card.cardNumber,
//       category: card.category,
//       points: card.points,
//       expiryDate: card.expiryDate ? card.expiryDate.split('T')[0] : '',
//       notes: card.notes,
//     })
//     setShowForm(true)
//   }

//   const maskCardNumber = (num) => {
//     return `****${num.slice(-4)}`
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Loyalty Cards</h1>
//         <button
//           onClick={() => {
//             setEditingCard(null)
//             setFormData({ brandName: '', cardNumber: '', category: 'Retail', points: 0, expiryDate: '', notes: '' })
//             setShowForm(!showForm)
//           }}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//         >
//           <Plus size={20} /> Add Card
//         </button>
//       </div>

//       {showForm && (
//         <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-lg space-y-4">
//           <input
//             type="text"
//             placeholder="Brand name"
//             value={formData.brandName}
//             onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
//             required
//             className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//           />
//           <input
//             type="text"
//             placeholder="Card number"
//             value={formData.cardNumber}
//             onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
//             required
//             className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//           />
//           <select
//             value={formData.category}
//             onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//             className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//           >
//             <option value="Retail">Retail</option>
//             <option value="Grocery">Grocery</option>
//             <option value="Gas">Gas</option>
//             <option value="Restaurant">Restaurant</option>
//             <option value="Travel">Travel</option>
//             <option value="Other">Other</option>
//           </select>
//           <input
//             type="number"
//             placeholder="Points"
//             value={formData.points}
//             onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
//             className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//           />
//           <input
//             type="date"
//             value={formData.expiryDate}
//             onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
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
//               {editingCard ? 'Update' : 'Add'}
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

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         {cards.map((card) => (
//           <div key={card._id} className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <p className="text-sm opacity-80">Brand</p>
//                 <p className="text-xl font-semibold">{card.brandName}</p>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleEdit(card)}
//                   className="bg-white/20 hover:bg-white/30 p-2 rounded transition"
//                 >
//                   <Edit2 size={16} />
//                 </button>
//                 <button
//                   onClick={() => handleDelete(card._id)}
//                   className="bg-white/20 hover:bg-white/30 p-2 rounded transition"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>
//             <p className="text-lg font-mono tracking-wider mb-4">{maskCardNumber(card.cardNumber)}</p>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <p className="opacity-80">Category</p>
//                 <p className="font-semibold">{card.category}</p>
//               </div>
//               <div>
//                 <p className="opacity-80">Points</p>
//                 <p className="font-semibold">{card.points}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {cards.length === 0 && !showForm && (
//         <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg">
//           <DollarSign size={48} className="mx-auto mb-4 text-slate-300" />
//           <p className="text-slate-600 dark:text-slate-400">No loyalty cards yet</p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default LoyaltyCardsPage
import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { Plus, Trash2, Edit2, DollarSign, Sparkles } from 'lucide-react'

const LoyaltyCardsPage = () => {
  const { token } = useAuth()
  const [cards, setCards] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [formData, setFormData] = useState({
    brandName: '',
    cardNumber: '',
    category: 'Retail',
    points: 0,
    expiryDate: '',
    notes: '',
  })

  useEffect(() => {
    fetchCards()
  }, [token])

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/loyalty', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setCards(data.cards || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editingCard ? 'PUT' : 'POST'
    const url = editingCard ? `/api/loyalty/${editingCard._id}` : '/api/loyalty'

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
        await fetchCards()
        setFormData({ brandName: '', cardNumber: '', category: 'Retail', points: 0, expiryDate: '', notes: '' })
        setEditingCard(null)
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this card?')) return
    try {
      const res = await fetch(`/api/loyalty/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        await fetchCards()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (card) => {
    setEditingCard(card)
    setFormData({
      brandName: card.brandName,
      cardNumber: card.cardNumber,
      category: card.category,
      points: card.points,
      expiryDate: card.expiryDate ? card.expiryDate.split('T')[0] : '',
      notes: card.notes,
    })
    setShowForm(true)
  }

  const maskCardNumber = (num) => {
    return `•••• •••• •••• ${num.slice(-4)}`
  }

  // Visual Palette Generator depending on Card Industry Theme
  const getCardTheme = (cat) => {
    const themes = {
      Retail: 'from-pink-500 via-rose-500 to-amber-500 shadow-rose-500/20',
      Grocery: 'from-emerald-500 via-teal-600 to-cyan-600 shadow-emerald-500/20',
      Gas: 'from-amber-500 via-orange-600 to-red-600 shadow-orange-500/20',
      Restaurant: 'from-violet-600 via-purple-600 to-pink-500 shadow-purple-500/20',
      Travel: 'from-blue-600 via-indigo-600 to-cyan-500 shadow-blue-500/20',
      Other: 'from-slate-700 via-slate-800 to-slate-900 shadow-slate-900/20'
    }
    return themes[cat] || themes.Other
  }

  return (
    <div className="space-y-8 p-1 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="text-amber-400" /> Loyalty Cards
          </h1>
          <p className="text-slate-400 text-sm mt-1">Keep your reward points and memberships structured beautifully.</p>
        </div>
        <button
          onClick={() => {
            setEditingCard(null)
            setFormData({ brandName: '', cardNumber: '', category: 'Retail', points: 0, expiryDate: '', notes: '' })
            setShowForm(!showForm)
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-cyan-500/20"
        >
          <Plus size={18} /> Add Card
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl space-y-4 border border-white/10 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Brand name"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              required
              className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            <input
              type="text"
              placeholder="Card number"
              value={formData.cardNumber}
              onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
              required
              className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-white/10 rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            >
              <option value="Retail">Retail</option>
              <option value="Grocery">Grocery</option>
              <option value="Gas">Gas</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Travel">Travel</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="number"
              placeholder="Points"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>
          <textarea
            placeholder="Notes (optional)"
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
              {editingCard ? 'Update Card' : 'Save Card'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div 
            key={card._id} 
            className={`bg-gradient-to-br ${getCardTheme(card.category)} p-6 rounded-2xl text-white shadow-xl relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl group`}
          >
            {/* Skeuomorphic Highlight Overlay Effect */}
            <div className="absolute top-0 right-0 left-0 h-[40%] bg-gradient-to-b from-white/15 to-transparent pointer-events-none transform -skew-y-6 origin-top-left transition-transform group-hover:scale-105" />
            
            <div className="flex justify-between items-start relative z-10 mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest opacity-75 font-semibold">Issuer / Brand</p>
                <p className="text-2xl font-black tracking-tight drop-shadow-sm">{card.brandName}</p>
              </div>
              <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
                <button onClick={() => handleEdit(card)} className="hover:bg-white/20 p-2 rounded-lg transition">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(card._id)} className="hover:bg-red-500/40 p-2 rounded-lg text-rose-200 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <p className="text-xl font-mono tracking-[0.2em] mb-8 text-center bg-black/10 py-1.5 rounded-lg border border-white/5 shadow-inner">
              {maskCardNumber(card.cardNumber)}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm relative z-10 border-t border-white/10 pt-4">
              <div>
                <p className="text-xs uppercase tracking-widest opacity-70 font-medium">Category</p>
                <p className="font-bold tracking-wide">{card.category}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest opacity-70 font-medium">Balance Points</p>
                <p className="text-lg font-black tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md inline-block shadow-sm">
                  {card.points.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cards.length === 0 && !showForm && (
        <div className="text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <DollarSign size={28} className="text-slate-400" />
          </div>
          <p className="text-slate-400 font-medium">No loyalty cards active inside your account portfolio yet.</p>
        </div>
      )}
    </div>
  )
}

export default LoyaltyCardsPage