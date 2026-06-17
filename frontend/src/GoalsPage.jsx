import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { Plus, Trash2, Edit2, Target, TrendingUp } from 'lucide-react'
import { API_BASE } from './utils'

const GoalsPage = () => {
  const { token } = useAuth()
  const [goals, setGoals] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Target',
    color: '#3B82F6',
    targetAmount: '',
    deadline: '',
    category: 'General',
    priority: 'medium',
  })

  // Fetch goals
  const fetchGoals = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to fetch goals:', errorData)
        setGoals([])
        return
      }

      const data = await response.json()
      setGoals(data.goals || [])
    } catch (error) {
      console.error('Failed to fetch goals:', error)
      setGoals([])
    }
  }

  // Fetch summary
  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/goals/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to fetch summary:', errorData)
        setSummary(null)
        return
      }

      const data = await response.json()
      setSummary(data)
    } catch (error) {
      console.error('Failed to fetch summary:', error)
      setSummary(null)
    }
  }

  // Unified data loading lifecycle pipeline
  useEffect(() => {
    const loadAllPageData = async () => {
      setLoading(true)
      await Promise.all([fetchGoals(), fetchSummary()])
      setLoading(false)
    }

    if (token) {
      loadAllPageData()
    }
  }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetAmount' ? (value === '' ? '' : parseFloat(value)) : value,
    }))
  }

  const handleCreateGoal = async (e) => {
    e.preventDefault()
    try {
      const method = editingGoal ? 'PATCH' : 'POST'
      const url = editingGoal
        ? `${API_BASE}/api/goals/${editingGoal._id}`
        : `${API_BASE}/api/goals`

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await Promise.all([fetchGoals(), fetchSummary()])
        setFormData({
          name: '',
          description: '',
          icon: 'Target',
          color: '#3B82F6',
          targetAmount: '',
          deadline: '',
          category: 'General',
          priority: 'medium',
        })
        setEditingGoal(null)
        setShowForm(false)
        alert(editingGoal ? 'Goal updated!' : 'Goal created successfully!')
      } else {
        const err = await response.json().catch(() => ({}))
        alert(`Error: ${err.error || 'Failed to save goal'}`)
      }
    } catch (error) {
      console.error('Error handling form submit:', error)
    }
  }

  const handleEditGoal = (goal) => {
    if (!goal) return
    setEditingGoal(goal)
    setFormData({
      name: goal.name || '',
      description: goal.description || '',
      icon: goal.icon || 'Target',
      color: goal.color || '#3B82F6',
      targetAmount: goal.targetAmount ? parseFloat(goal.targetAmount.toString()) : '',
      deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
      category: goal.category || 'General',
      priority: goal.priority || 'medium',
    })
    setShowForm(true)
  }

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return

    try {
      const response = await fetch(`${API_BASE}/api/goals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        await Promise.all([fetchGoals(), fetchSummary()])
        alert('Goal deleted!')
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const handleAddSavings = async (id) => {
    const amount = prompt('Enter amount to add to your savings:')
    if (!amount || parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) return

    try {
      const response = await fetch(`${API_BASE}/api/goals/${id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      })

      if (response.ok) {
        await Promise.all([fetchGoals(), fetchSummary()])
        alert('Savings added successfully!')
      } else {
        const err = await response.json().catch(() => ({}))
        alert(`Error: ${err.error || 'Failed to add savings'}`)
      }
    } catch (error) {
      console.error('Error adding savings:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-600 dark:text-slate-400 font-medium">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mr-3"></div>
        Loading goals dashboard...
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white text-slate-900">Financial Goals</h1>
        <button
          onClick={() => {
            setEditingGoal(null)
            setFormData({
              name: '',
              description: '',
              icon: 'Target',
              color: '#3B82F6',
              targetAmount: '',
              deadline: '',
              category: 'General',
              priority: 'medium',
            })
            setShowForm(!showForm)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md"
        >
          <Plus size={20} />
          New Goal
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Goals</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.total || 0}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{summary.active || 0} active</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Target Amount</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              ${(summary.totalTarget || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Saved</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${(summary.totalSaved || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Overall Progress</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {(summary.overallProgress || 0).toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Form Area */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {editingGoal ? 'Edit Target Goal' : 'Configure New Goal'}
          </h2>
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Goal Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., House Downpayment"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optional targets, motivations, or contextual benchmarks"
                rows="2"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Amount ($) *
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Personal, Travel, Investment"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority Bracket
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-semibold shadow-sm"
              >
                {editingGoal ? 'Save Modifications' : 'Launch Goal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingGoal(null)
                }}
                className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white py-2 rounded-lg transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals Content Area */}
      {goals.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <Target size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No financial goals set yet. Build your first tracking milestone!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map(goal => {
            const saved = goal.savedAmount ? parseFloat(goal.savedAmount.toString()) : 0
            const target = goal.targetAmount ? parseFloat(goal.targetAmount.toString()) : 0
            const progressPct = goal.progress != null ? goal.progress : (target > 0 ? (saved / target) * 100 : 0)

            return (
              <div key={goal._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{goal.name}</h3>
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                        {goal.category || 'General'} • {((goal.priority || 'medium').charAt(0).toUpperCase() + (goal.priority || 'medium').slice(1))} Priority
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      goal.status === 'completed' ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400' :
                      goal.status === 'active' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400' :
                      'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {(goal.status || 'Active').toUpperCase()}
                    </span>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-lg border border-slate-100 dark:border-transparent">
                      {goal.description}
                    </p>
                  )}
                </div>

                <div className="space-y-4 mt-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-500 dark:text-slate-400">Target Progress</span>
                      <span className="text-slate-900 dark:text-white">
                        ${saved.toLocaleString('en-US', { minimumFractionDigits: 2 })} / ${target.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-200/50 dark:border-transparent">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, progressPct)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>{progressPct.toFixed(1)}% Complete</span>
                    <span>Deadline: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'N/A'}</span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                    <button
                      onClick={() => handleAddSavings(goal._id)}
                      className="flex-1 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition border border-green-200/40 dark:border-transparent"
                    >
                      <TrendingUp size={14} />
                      Add Capital
                    </button>
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3.5 py-2 rounded-lg flex items-center justify-center text-xs font-bold transition border border-blue-200/40 dark:border-transparent"
                      title="Edit Goal"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal._id)}
                      className="bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-3.5 py-2 rounded-lg flex items-center justify-center text-xs font-bold transition border border-red-200/40 dark:border-transparent"
                      title="Delete Goal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default GoalsPage