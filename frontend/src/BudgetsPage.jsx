import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { AlertCircle, Plus, Trash2, Edit2 } from 'lucide-react'

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

  const totalBudgetLimit = budgetProgress.reduce(
    (sum, progress) => sum + parseNumber(progress.limit),
    0
  )
  const totalBudgetSpent = budgetProgress.reduce(
    (sum, progress) => sum + parseNumber(progress.spent),
    0
  )
  const totalBudgetRemaining = budgetProgress.reduce(
    (sum, progress) => sum + parseNumber(progress.remaining),
    0
  )
  const totalBudgets = budgetProgress.length

  // Fetch all budgets
  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budgets', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setBudgets(data.budgets || [])
    } catch (error) {
      console.error('Failed to fetch budgets:', error)
    }
  }

  // Fetch budget progress
  const fetchBudgetProgress = async () => {
    try {
      const response = await fetch('/api/budgets/progress', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setBudgetProgress(data.budgetProgress || [])
    } catch (error) {
      console.error('Failed to fetch budget progress:', error)
    }
  }

  useEffect(() => {
    fetchBudgets()
    fetchBudgetProgress()
    setLoading(false)
  }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'alertThreshold' || name === 'limit' ? parseFloat(value) : value,
    }))
  }

  const handleCreateBudget = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchBudgets()
        await fetchBudgetProgress()
        setFormData({ category: '', limit: '', period: 'monthly', alertThreshold: 75 })
        setShowForm(false)
        alert('Budget created successfully!')
      } else {
        alert('Failed to create budget')
      }
    } catch (error) {
      console.error('Error creating budget:', error)
      alert('Error creating budget')
    }
  }

  const handleUpdateBudget = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/budgets/${editingBudget._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchBudgets()
        await fetchBudgetProgress()
        setEditingBudget(null)
        setFormData({ category: '', limit: '', period: 'monthly', alertThreshold: 75 })
        alert('Budget updated successfully!')
      } else {
        alert('Failed to update budget')
      }
    } catch (error) {
      console.error('Error updating budget:', error)
      alert('Error updating budget')
    }
  }

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return

    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        await fetchBudgets()
        await fetchBudgetProgress()
        alert('Budget deleted successfully!')
      } else {
        alert('Failed to delete budget')
      }
    } catch (error) {
      console.error('Error deleting budget:', error)
      alert('Error deleting budget')
    }
  }

  const handleResetBudget = async (id) => {
    if (!window.confirm('Reset this budget for the new period?')) return

    try {
      const response = await fetch(`/api/budgets/${id}/reset`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        await fetchBudgets()
        await fetchBudgetProgress()
        alert('Budget reset successfully!')
      } else {
        alert('Failed to reset budget')
      }
    } catch (error) {
      console.error('Error resetting budget:', error)
      alert('Error resetting budget')
    }
  }

  const startEdit = (budget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      limit: budget.limit.toString(),
      period: budget.period,
      alertThreshold: budget.alertThreshold,
    })
    setShowForm(true)
  }

  if (loading) {
    return <div className="text-center text-slate-600 dark:text-slate-400">Loading budgets...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white dark:text-white">Budgets</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Track your spending limits and see total budget status.</p>
        </div>
        <button
          onClick={() => {
            setEditingBudget(null)
            setFormData({ category: '', limit: '', period: 'monthly', alertThreshold: 75 })
            setShowForm(!showForm)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} />
          New Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Budgets</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-3">{totalBudgets}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Budget Limit</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-3">${totalBudgetLimit.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">Remaining Budget</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-3">${totalBudgetRemaining.toFixed(2)}</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            {editingBudget ? 'Edit Budget' : 'Create New Budget'}
          </h2>
          <form onSubmit={editingBudget ? handleUpdateBudget : handleCreateBudget} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Food, Entertainment, Transport"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Limit
                </label>
                <input
                  type="number"
                  name="limit"
                  value={formData.limit}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Period
                </label>
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Alert Threshold (%)
              </label>
              <input
                type="number"
                name="alertThreshold"
                value={formData.alertThreshold}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="5"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
              >
                {editingBudget ? 'Update Budget' : 'Create Budget'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingBudget(null)
                  setFormData({ category: '', limit: '', period: 'monthly', alertThreshold: 75 })
                }}
                className="flex-1 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-900 dark:text-white py-2 rounded-lg transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {budgetProgress.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400">No budgets created yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {budgetProgress.map(progress => (
            <div key={progress._id} className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{progress.category}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Budget Status</p>
                </div>
                {progress.status === 'alert' && (
                  <AlertCircle className="text-red-500" size={24} />
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Spent</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ${parseFloat(progress.spent).toFixed(2)} / ${parseFloat(progress.limit).toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        progress.percentage >= progress.alertThreshold
                          ? 'bg-red-500'
                          : progress.percentage >= 75
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, progress.percentage)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Remaining: ${parseFloat(progress.remaining).toFixed(2)}</span>
                  <span>{progress.percentage.toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => startEdit(budgets.find(b => b._id === progress._id))}
                  className="flex-1 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleResetBudget(progress._id)}
                  className="flex-1 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 py-2 rounded-lg transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => handleDeleteBudget(progress._id)}
                  className="flex-1 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-300 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BudgetsPage
