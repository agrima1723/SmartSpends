import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { Plus, Users, Copy, LogOut, Trash2 } from 'lucide-react'

const GroupsPage = () => {
  const { token } = useAuth()
  const [groups, setGroups] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [joinCode, setJoinCode] = useState('')

  useEffect(() => {
    fetchGroups()
  }, [token])

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/groups', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setGroups(data.groups || [])
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        await fetchGroups()
        setFormData({ name: '', description: '' })
        setShowCreateForm(false)
        alert('Group created!')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleJoinGroup = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/groups/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ joinCode }),
      })
      if (res.ok) {
        await fetchGroups()
        setJoinCode('')
        setShowJoinForm(false)
        alert('Joined group!')
      } else {
        alert('Invalid join code')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const copyJoinCode = (code) => {
    navigator.clipboard.writeText(code)
    alert('Join code copied!')
  }

  const handleDeleteGroup = async (id) => {
    if (!window.confirm('Delete this group?')) return
    try {
      const res = await fetch(`/api/groups/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        await fetchGroups()
        alert('Group deleted!')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Groups</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus size={20} />
            Create Group
          </button>
          <button
            onClick={() => setShowJoinForm(!showJoinForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Users size={20} />
            Join Group
          </button>
        </div>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateGroup} className="bg-white dark:bg-slate-800 p-6 rounded-lg space-y-4">
          <input
            type="text"
            placeholder="Group name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Create</button>
            <button type="button" onClick={() => setShowCreateForm(false)} className="flex-1 bg-slate-300 dark:bg-slate-600 py-2 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      {showJoinForm && (
        <form onSubmit={handleJoinGroup} className="bg-white dark:bg-slate-800 p-6 rounded-lg space-y-4">
          <input
            type="text"
            placeholder="Join code (8 characters)"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength="8"
            required
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg">Join</button>
            <button type="button" onClick={() => setShowJoinForm(false)} className="flex-1 bg-slate-300 dark:bg-slate-600 py-2 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      {groups.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg">
          <Users size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-600 dark:text-slate-400">No groups yet. Create one or join!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {groups.map(group => (
            <div key={group._id} className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{group.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{group.description}</p>
                </div>
                <button
                  onClick={() => copyJoinCode(group.joinCode)}
                  className="bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 text-blue-600 dark:text-blue-300 px-3 py-1 rounded flex items-center gap-2 text-sm transition"
                >
                  <Copy size={14} />
                  {group.joinCode}
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {group.members?.length || 0} members
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedGroup(group._id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteGroup(group._id)}
                  className="bg-red-100 dark:bg-red-900 hover:bg-red-200 text-red-600 dark:text-red-300 px-4 py-2 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedGroup && (
        <GroupDetails groupId={selectedGroup} token={token} onClose={() => setSelectedGroup(null)} fetchGroups={fetchGroups} />
      )}
    </div>
  )
}

// Group Details Component
const GroupDetails = ({ groupId, token, onClose, fetchGroups }) => {
  const [group, setGroup] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [settlements, setSettlements] = useState([])
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' })

  useEffect(() => {
    fetchGroupData()
  }, [groupId])

  const fetchGroupData = async () => {
    try {
      const [groupRes, expensesRes, settlementsRes] = await Promise.all([
        fetch(`/api/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/groups/${groupId}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/groups/${groupId}/settlements`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const groupData = await groupRes.json()
      const expensesData = await expensesRes.json()
      const settlementsData = await settlementsRes.json()

      setGroup(groupData)
      setExpenses(expensesData.expenses || [])
      setSettlements(settlementsData.settlements || [])
    } catch (error) {
      console.error('Error fetching group data:', error)
    }
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/groups/${groupId}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newExpense,
          groupId,
          amount: parseFloat(newExpense.amount),
        }),
      })
      if (res.ok) {
        setNewExpense({ description: '', amount: '' })
        await fetchGroupData()
        alert('Expense added!')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSettleDebt = async (settlementId) => {
    try {
      const res = await fetch(`/api/groups/settlement/${settlementId}/settle`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        await fetchGroupData()
        alert('Debt settled!')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (!group) return <div>Loading...</div>

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{group.name}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add Expense */}
          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Add Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-3">
              <input
                type="text"
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                step="0.01"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition">
                Add Expense
              </button>
            </form>
          </div>

          {/* Expenses */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Recent Expenses</h3>
            <div className="space-y-2">
              {expenses.slice(0, 5).map(exp => (
                <div key={exp._id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded text-sm">
                  <p className="text-slate-900 dark:text-white font-medium">{exp.description}</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Paid by: {exp.paidBy?.displayName} - ${parseFloat(exp.amount.toString()).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Settlements */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Who Owes Who</h3>
            <div className="space-y-2">
              {settlements.map(settle => (
                <div key={settle._id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded text-sm flex justify-between items-center">
                  <div>
                    <p className="text-slate-900 dark:text-white font-medium">
                      {settle.fromUser?.displayName} owes {settle.toUser?.displayName}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">${parseFloat(settle.amount.toString()).toFixed(2)}</p>
                  </div>
                  {settle.status === 'pending' && (
                    <button
                      onClick={() => handleSettleDebt(settle._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Settled
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupsPage
