import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { AlertTriangle, TrendingDown, Zap } from 'lucide-react'

const ForecastPage = () => {
  const { token } = useAuth()
  const [forecast, setForecast] = useState(null)
  const [trend, setTrend] = useState([])
  const [period, setPeriod] = useState('30days')
  const [loading, setLoading] = useState(true)

  // Fetch latest forecast
  const fetchForecast = async () => {
    try {
      const response = await fetch(`/api/forecasts/period/${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setForecast(data)
      }
    } catch (error) {
      console.error('Failed to fetch forecast:', error)
    }
  }

  // Fetch spending trend
  const fetchTrend = async () => {
    try {
      const days = period === '7days' ? 7 : period === '90days' ? 90 : 30
      const response = await fetch(`/api/forecasts/trend?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setTrend(data.trend || [])
    } catch (error) {
      console.error('Failed to fetch trend:', error)
    }
  }

  // Generate new forecast
  const handleGenerateForecast = async () => {
    try {
      const response = await fetch('/api/forecasts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ period }),
      })

      if (response.ok) {
        await fetchForecast()
        alert('Forecast generated!')
      }
    } catch (error) {
      console.error('Error generating forecast:', error)
    }
  }

  useEffect(() => {
    fetchForecast()
    fetchTrend()
    setLoading(false)
  }, [token, period])

  if (loading) {
    return <div className="text-slate-600 dark:text-slate-400">Loading forecast...</div>
  }

  const getRiskColor = (risk) => {
    if (risk === 'high') return 'text-red-600 dark:text-red-400'
    if (risk === 'medium') return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  const getRiskBgColor = (risk) => {
    if (risk === 'high') return 'bg-red-100 dark:bg-red-900'
    if (risk === 'medium') return 'bg-yellow-100 dark:bg-yellow-900'
    return 'bg-green-100 dark:bg-green-900'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Financial Forecast</h1>
        <button
          onClick={handleGenerateForecast}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Zap size={20} />
          Generate
        </button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-3">
        {['7days', '30days', '90days'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg transition ${
              period === p
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {p === '7days' ? '7 Days' : p === '30days' ? '30 Days' : '90 Days'}
          </button>
        ))}
      </div>

      {forecast ? (
        <>
          {/* Risk Alert */}
          {forecast.riskLevel === 'high' || forecast.riskLevel === 'medium' && (
            <div className={`${getRiskBgColor(forecast.riskLevel)} p-4 rounded-lg border-l-4 ${
              forecast.riskLevel === 'high' ? 'border-red-600 dark:border-red-400' :
              forecast.riskLevel === 'medium' ? 'border-yellow-600 dark:border-yellow-400' :
              'border-green-600 dark:border-green-400'
            }`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={getRiskColor(forecast.riskLevel)} size={24} />
                <div>
                  <h3 className={`font-semibold ${getRiskColor(forecast.riskLevel)}`}>
                    {forecast.riskLevel === 'high' ? 'High Risk Alert' : 'Medium Risk Alert'}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {forecast.riskLevel === 'high'
                      ? 'Your projected balance will become negative. Consider reducing expenses or increasing income.'
                      : 'Your projected balance is lower than usual. Monitor your spending closely.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Current Balance</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                ${parseFloat(forecast.currentBalance.toString()).toFixed(2)}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Projected Income</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                +${parseFloat(forecast.projectedIncome.toString()).toFixed(2)}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Projected Expense</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                -${parseFloat(forecast.projectedExpense.toString()).toFixed(2)}
              </p>
            </div>

            <div className={`${getRiskBgColor(forecast.riskLevel)} p-6 rounded-lg border border-slate-200 dark:border-slate-700`}>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Projected Balance</p>
              <p className={`text-3xl font-bold ${
                parseFloat(forecast.projectedBalance.toString()) < 0 ? 'text-red-600 dark:text-red-400' :
                parseFloat(forecast.projectedBalance.toString()) < parseFloat(forecast.currentBalance.toString()) * 0.25 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-green-600 dark:text-green-400'
              }`}>
                ${parseFloat(forecast.projectedBalance.toString()).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Daily Averages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Daily Averages</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Average Daily Income</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ${parseFloat(forecast.averageDailyIncome.toString()).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Average Daily Spend</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    -${parseFloat(forecast.averageDailySpend.toString()).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Net Daily</span>
                  <span className={`font-semibold ${
                    parseFloat(forecast.averageDailyIncome.toString()) - parseFloat(forecast.averageDailySpend.toString()) >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    ${(parseFloat(forecast.averageDailyIncome.toString()) - parseFloat(forecast.averageDailySpend.toString())).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Risk Assessment</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Risk Level</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskBgColor(forecast.riskLevel)} ${getRiskColor(forecast.riskLevel)}`}>
                      {forecast.riskLevel.charAt(0).toUpperCase() + forecast.riskLevel.slice(1)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        forecast.riskLevel === 'high' ? 'bg-red-500 w-full' :
                        forecast.riskLevel === 'medium' ? 'bg-yellow-500 w-2/3' :
                        'bg-green-500 w-1/3'
                      }`}
                    />
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {forecast.riskLevel === 'high'
                    ? 'Your spending exceeds income. Take immediate action.'
                    : forecast.riskLevel === 'medium'
                    ? 'You are spending more than half your income. Monitor closely.'
                    : 'You are in good financial health.'}
                </p>
              </div>
            </div>
          </div>

          {/* Spending Trend Chart */}
          {trend.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Spending Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="daily"
                    stroke="#ef4444"
                    name="Daily Spend"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#3b82f6"
                    name="Cumulative"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Income vs Expense Chart */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Projected Income vs Expense</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                {
                  name: 'Forecast',
                  income: parseFloat(forecast.projectedIncome.toString()),
                  expense: parseFloat(forecast.projectedExpense.toString()),
                }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <TrendingDown size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-600 dark:text-slate-400 mb-4">No forecast available. Generate one to get started!</p>
          <button
            onClick={handleGenerateForecast}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Generate Forecast
          </button>
        </div>
      )}
    </div>
  )
}

export default ForecastPage
