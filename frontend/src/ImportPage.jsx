import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { Upload, Download, CheckCircle, XCircle, Clock } from 'lucide-react'

const ImportPage = () => {
  const { token } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [imports, setImports] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [csvText, setCsvText] = useState('')
  const [loading, setLoading] = useState(false)
  const [importResult, setImportResult] = useState(null)

  useEffect(() => {
    fetchAccounts()
    fetchImportHistory()
  }, [token])

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setAccounts(data.accounts || [])
      if (data.accounts && data.accounts.length > 0) {
        setSelectedAccountId(data.accounts[0]._id)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchImportHistory = async () => {
    try {
      const res = await fetch('/api/import/history', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setImports(data.imports || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const res = await fetch('/api/import/template', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'budget-tracker-template.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleUploadCSV = async (e) => {
    e.preventDefault()
    if (!selectedAccountId || !csvText.trim()) {
      alert('Please select an account and enter CSV data')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/import/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountId: selectedAccountId,
          csvData: csvText,
          fileName: 'bank-import.csv',
        }),
      })
      const data = await res.json()
      setImportResult(data.importLog)
      setCsvText('')
      await fetchImportHistory()
      alert(`Import complete: ${data.importLog.successfulImports} successful, ${data.importLog.failedRows} failed`)
    } catch (error) {
      console.error('Error:', error)
      alert('Import failed')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-600" />
      case 'failed':
        return <XCircle size={20} className="text-red-600" />
      case 'processing':
        return <Clock size={20} className="text-amber-600" />
      default:
        return <Clock size={20} className="text-slate-600" />
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white dark:text-white">CSV Import</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Import Transactions</h2>
          
          <button
            onClick={handleDownloadTemplate}
            className="w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white py-2 rounded-lg transition"
          >
            <Download size={18} /> Download Template
          </button>

          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Select Account
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="">Choose account...</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.accountName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              CSV Data (Date, Description, Category, Amount, Type)
            </label>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={'Date,Description,Category,Amount,Type\n2024-01-15,Grocery,Groceries,50.00,expense'}
              rows="6"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm"
            />
          </div>

          <button
            onClick={handleUploadCSV}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-2 rounded-lg transition"
          >
            <Upload size={18} /> {loading ? 'Importing...' : 'Import CSV'}
          </button>

          {importResult && (
            <div className={`p-3 rounded-lg text-sm ${importResult.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
              <p>✓ {importResult.successfulImports} transactions imported</p>
              {importResult.failedRows > 0 && <p>✗ {importResult.failedRows} rows failed</p>}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">How to Use</h2>
          <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
            <div>
              <p className="font-semibold mb-1">1. Download Template</p>
              <p>Click "Download Template" to get the correct format</p>
            </div>
            <div>
              <p className="font-semibold mb-1">2. Fill in Data</p>
              <p>Edit the template with your transactions. Format: Date (YYYY-MM-DD), Description, Category, Amount, Type</p>
            </div>
            <div>
              <p className="font-semibold mb-1">3. Copy & Paste</p>
              <p>Paste the CSV data into the text area above</p>
            </div>
            <div>
              <p className="font-semibold mb-1">4. Import</p>
              <p>Select the destination account and click Import CSV</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded border border-blue-200 dark:border-blue-700">
              <p className="font-semibold">⚠️ Note:</p>
              <p>Amount format: use decimals (50.00, not 50)</p>
              <p>Type: expense or income</p>
            </div>
          </div>
        </div>
      </div>

      {/* Import History */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Imports</h2>
        <div className="space-y-3">
          {imports.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">No imports yet</p>
          ) : (
            imports.map((imp) => (
              <div key={imp._id} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{imp.fileName}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {imp.accountId?.accountName} • {new Date(imp.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {imp.successfulImports}/{imp.totalRows}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">successful</p>
                  </div>
                  {getStatusIcon(imp.status)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ImportPage
