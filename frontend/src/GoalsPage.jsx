import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { Plus, Trash2, Edit2, Target, TrendingUp } from 'lucide-react'

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
      const response = await fetch('/api/goals', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json()
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
      const response = await fetch('/api/goals/summary', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json()
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

  useEffect(() => {
    fetchGoals()
    fetchSummary()
    setLoading(false)
  }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetAmount' ? parseFloat(value) : value,
    }))
  }

  const handleCreateGoal = async (e) => {
    e.preventDefault()
    try {
      const method = editingGoal ? 'PATCH' : 'POST'
      const url = editingGoal
        ? `/api/goals/${editingGoal._id}`
        : '/api/goals'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchGoals()
        await fetchSummary()
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
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEditGoal = (goal) => {
    setEditingGoal(goal)
    setFormData({
      name: goal.name,
      description: goal.description,
      icon: goal.icon,
      color: goal.color,
      targetAmount: parseFloat(goal.targetAmount.toString()),
      deadline: goal.deadline.split('T')[0],
      category: goal.category,
      priority: goal.priority,
    })
    setShowForm(true)
  }

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Delete this goal?')) return

    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        await fetchGoals()
        await fetchSummary()
        alert('Goal deleted!')
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const handleAddSavings = async (id) => {
    const amount = prompt('Enter amount to add:')
    if (!amount || amount <= 0) return

    try {
      const response = await fetch(`/api/goals/${id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      })

      if (response.ok) {
        await fetchGoals()
        await fetchSummary()
        alert('Savings added!')
      }
    } catch (error) {
      console.error('Error adding savings:', error)
    }
  }

  if (loading) {
    return <div className="text-slate-600 dark:text-slate-400">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white dark:text-white">Financial Goals</h1>
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} />
          New Goal
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Goals</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary.total}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{summary.active} active</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Target Amount</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              ${summary.totalTarget.toFixed(0)}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Saved</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${summary.totalSaved.toFixed(2)}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Overall Progress</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {summary.overallProgress.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            {editingGoal ? 'Edit Goal' : 'Create New Goal'}
          </h2>
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Goal Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Buy a Laptop"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optional description"
                rows="3"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Amount
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Personal, Travel"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium"
              >
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingGoal(null)
                }}
                className="flex-1 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-900 dark:text-white py-2 rounded-lg transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <Target size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-600 dark:text-slate-400">No goals yet. Create one to start!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {goals.map(goal => (
            <div key={goal._id} className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{goal.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {goal.category} • {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  goal.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                  goal.status === 'active' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                  'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                </span>
              </div>

              {goal.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{goal.description}</p>
              )}

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Progress</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ${parseFloat(goal.savedAmount.toString()).toFixed(2)} / ${parseFloat(goal.targetAmount.toString()).toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-green-500 transition-all"
                      style={{ width: `${Math.min(100, goal.progress)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>{goal.progress.toFixed(1)}% Complete</span>
                  <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleAddSavings(goal._id)}
                  className="flex-1 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 text-green-600 dark:text-green-300 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <TrendingUp size={16} />
                  Add Savings
                </button>
                <button
                  onClick={() => handleEditGoal(goal)}
                  className="flex-1 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteGoal(goal._id)}
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

export default GoalsPage
