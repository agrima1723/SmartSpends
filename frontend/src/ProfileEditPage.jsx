import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { User, Save, X } from 'lucide-react'

const ProfileEditPage = () => {
  const { user, token } = useAuth()
  const [formData, setFormData] = useState({
    displayName: '',
    baseCurrency: 'USD',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        baseCurrency: user.baseCurrency || 'USD',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({
          displayName: data.user.displayName,
          baseCurrency: data.user.baseCurrency,
        })
        setMessage('Profile updated successfully!')
        setMessageType('success')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await response.json()
        setMessage(error.error || 'Failed to update profile')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Error updating profile: ' + error.message)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Profile</h1>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 flex justify-between items-center ${
            messageType === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <span className={messageType === 'success'
              ? 'text-green-700 dark:text-green-300'
              : 'text-red-700 dark:text-red-300'
            }>
              {message}
            </span>
            <button
              onClick={() => setMessage('')}
              className="p-1 hover:bg-white/20 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Base Currency
            </label>
            <select
              name="baseCurrency"
              value={formData.baseCurrency}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="AUD">AUD - Australian Dollar</option>
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              This currency will be used throughout the app for all amounts
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white rounded-lg font-medium transition"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <h3 className="font-medium text-slate-900 dark:text-white mb-2">Current Information</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Email: {user?.email}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Member since {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileEditPage
