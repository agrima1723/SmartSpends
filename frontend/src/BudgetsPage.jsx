import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { AlertCircle, Plus, Trash2, Edit2, X } from 'lucide-react'
import { API_BASE } from './utils'

const BudgetsPage = () => {
  const { token } = useAuth()
  const [budgets, setBudgets] = useState([])
  const [budgetProgress, setBudgetProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    period: 'monthly',
    alertThreshold: 75,
  })

  const parseNumber = (value) => {
    const number = parseFloat(value)
    return Number.isNaN(number) ? 0 : number
  }

  const totalBudgetLimit = budgetProgress.reduce((sum, progress) => sum + parseNumber(progress.limit), 0)
  const totalBudgetSpent = budgetProgress.reduce((sum, progress) => sum + parseNumber(progress.spent), 0)
  const totalBudgetRemaining = budgetProgress.reduce((sum, progress) => sum + parseNumber(progress.remaining), 0)
  const totalBudgets = budgetProgress.length

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/budgets`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setBudgets(data.budgets || [])
    } catch (error) {
      console.error('Failed to fetch budgets:', error)
    }
  }

  const fetchBudgetProgress = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/budgets/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setBudgetProgress(data.budgetProgress || [])
    } catch (error) {
      console.error('Failed to fetch budget progress:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchBudgets(), fetchBudgetProgress()])
      setLoading(false)
    }
    if (token) {
      loadData()
    }
  }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'alertThreshold' || name === 'limit' ? value : value,
    }))
  }

  const handleCreateBudget = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        limit: parseFloat(formData.limit) || 0,
        alertThreshold: parseInt(formData.alertThreshold) || 75
      }

      const response = await fetch(`${API_BASE}/api/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await Promise.all([fetchBudgets(), fetchBudgetProgress()])
        setFormData({ category: '', limit: '', period: 'monthly', alertThreshold: 75 })
        setShowForm(false)
      } else {
        alert('Failed to create budget')
      }
    } catch (error) {
      console.error('Error creating budget:', error)
    }
  }

  const handleUpdateBudget = async (e) => {
    e.preventDefault()
    if (!editingBudget?._id) return

    try {
      const payload = {
        ...formData,
        limit: parseFloat(formData.limit) || 0,
        alertThreshold: parseInt(formData.alertThreshold) || 75
      }

      const response = await fetch(`${API_BASE}/api/budgets/${editingBudget._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await Promise.all([fetchBudgets(), fetchBudgetProgress()])
        setEditingBudget(null)
        setFormData({ category: '', limit: '', period: 'monthly', alertThreshold: 75 })
        setShowForm(false)
      } else {
        alert('Failed to update budget')
      }
    } catch (error) {
      console.error('Error updating budget:', error)
    }
  }

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return

    try {
      const response = await fetch(`${API_BASE}/api/budgets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        await Promise.all([fetchBudgets(), fetchBudgetProgress()])
      } else {
        alert('Failed to delete budget')
      }
    } catch (error) {
      console.error('Error deleting budget:', error)
    }
  }

  const handleResetBudget = async (id) => {
    if (!window.confirm('Reset this budget for the new period?')) return

    try {
      const response = await fetch(`${API_BASE}/api/budgets/${id}/reset`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        await Promise.all([fetchBudgets(), fetchBudgetProgress()])
      } else {
        alert('Failed to reset budget')
      }
    } catch (error) {
      console.error('Error resetting budget:', error)
    }
  }

  const startEdit = (progressItem) => {
    if (!progressItem) return
    
    // Fallback: lookup in primary budgets list, otherwise use data directly from the progress tracker item
    const baseBudget = budgets.find(b => b._id === progressItem._id) || progressItem
    
    setEditingBudget(baseBudget)
    setFormData({
      category: baseBudget.category || '',
      limit: baseBudget.limit ? baseBudget.limit.toString() : '',
      period: baseBudget.period || 'monthly',
      alertThreshold: baseBudget.alertThreshold ?? 75,
    })
    setShowForm(true)
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-600 dark:text-slate-400 font-medium">Loading budgets...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header View */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Budgets</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Track your spending limits and see total budget status.</p>
        </div>
        <button
          onClick={() => {
            setEditingBudget(null)
            setFormData({ category: '', limit: '', period: 'monthly', alertThreshold: 75 })
            setShowForm(!showForm)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition shadow-sm"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Close Form' : 'New Budget'}
        </button>
      </div>

      {/* Overview Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Budgets</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{totalBudgets}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Budget Limit</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">${totalBudgetLimit.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Remaining Budget</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">${totalBudgetRemaining.toFixed(2)}</p>
        </div>
      </div>

      {/* Dynamic Creation / Modification Drawer Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all animate-in fade-in duration-200">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            {editingBudget ? 'Modify Budget Limits' : 'Set New Category Budget'}
          </h2>
          <form onSubmit={editingBudget ? handleUpdateBudget : handleCreateBudget} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category Name
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Food, Entertainment, Transport"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Limit Amount ($)
                </label>
                <input
                  type="number"
                  name="limit"
                  value={formData.limit}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Timeframe Period
                </label>
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alert Threshold ({formData.alertThreshold || 75}%)
              </label>
              <input
                type="number"
                name="alertThreshold"
                value={formData.alertThreshold}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="5"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold transition shadow-sm"
              >
                {editingBudget ? 'Save Changes' : 'Initialize Budget'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingBudget(null)
                  setFormData({ category: '', limit: '', period: 'monthly', alertThreshold: 75 })
                }}
                className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 py-2 rounded-lg font-bold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Budget Aggregates Loop */}
      {budgetProgress.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 font-medium">No system limits registered. Open the dynamic drawer form above to map structural budgets!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {budgetProgress.map(progress => {
            const spentNum = parseNumber(progress.spent)
            const limitNum = parseNumber(progress.limit)
            const remainingNum = parseNumber(progress.remaining)
            const percentageNum = typeof progress.percentage === 'number' ? progress.percentage : parseNumber(progress.percentage)

            return (
              <div key={progress._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{progress.category}</h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Tracked Interval: <span className="uppercase">{progress.period || 'monthly'}</span></p>
                    </div>
                    {(progress.status === 'alert' || percentageNum >= (progress.alertThreshold || 75)) && (
                      <AlertCircle className="text-red-500 animate-pulse" size={22} />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Cap Distribution Spent</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          ${spentNum.toFixed(2)} / ${limitNum.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            percentageNum >= (progress.alertThreshold || 75)
                              ? 'bg-red-500'
                              : percentageNum >= 75
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, percentageNum)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                      <span className={remainingNum < 0 ? "text-red-500" : "text-slate-600 dark:text-slate-400"}>
                        {remainingNum < 0 ? `Overdrawn: -$${Math.abs(remainingNum).toFixed(2)}` : `Remaining: $${remainingNum.toFixed(2)}`}
                      </span>
                      <span>{percentageNum.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Operations Footing Bar */}
                <div className="flex gap-2 mt-6 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <button
                    onClick={() => startEdit(progress)}
                    className="flex-1 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleResetBudget(progress._id)}
                    className="flex-1 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900/90 text-slate-600 dark:text-slate-400 py-2 rounded-lg text-sm font-bold transition border border-slate-200 dark:border-slate-700"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => handleDeleteBudget(progress._id)}
                    className="px-3 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 py-2 rounded-lg flex items-center justify-center transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default BudgetsPage