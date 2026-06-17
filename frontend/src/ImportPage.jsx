import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { Upload, Download, CheckCircle, XCircle, Clock } from 'lucide-react'
import { API_BASE } from './utils'

const ImportPage = () => {
  const { token } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [imports, setImports] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [csvText, setCsvText] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [importResult, setImportResult] = useState(null)

  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch accounts')
      const data = await res.json()
      const accountList = data.accounts || []
      setAccounts(accountList)
      if (accountList.length > 0) {
        setSelectedAccountId(accountList[0]._id)
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
    }
  }

  // Fetch summary/history
  const fetchImportHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/import/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch historical imports')
      const data = await res.json()
      setImports(data.imports || [])
    } catch (error) {
      console.error('Error fetching import history:', error)
    }
  }

  useEffect(() => {
    const loadInitialData = async () => {
      setPageLoading(true)
      await Promise.all([fetchAccounts(), fetchImportHistory()])
      setPageLoading(false)
    }

    if (token) {
      loadInitialData()
    }
  }, [token])

  const handleDownloadTemplate = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/import/template`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Template generation failed')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'budget-tracker-template.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading template:', error)
      alert('Could not download file template.')
    }
  }

  const handleUploadCSV = async (e) => {
    e.preventDefault()
    if (!selectedAccountId || !csvText.trim()) {
      alert('Please select an operational account and enter valid CSV rows.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/import/upload`, {
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
      if (res.ok) {
        setImportResult(data.importLog)
        setCsvText('')
        await fetchImportHistory()
        alert(`Import process concluded: ${data.importLog?.successfulImports || 0} successes, ${data.importLog?.failedRows || 0} rejections.`)
      } else {
        alert(`Failed to parse: ${data.message || 'Check syntax parameters.'}`)
      }
    } catch (error) {
      console.error('Error uploading CSV:', error)
      alert('Network pipeline rejection: Import failed.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-emerald-500" />
      case 'failed':
        return <XCircle size={20} className="text-rose-500" />
      case 'processing':
        return <Clock size={20} className="text-amber-500 animate-pulse" />
      default:
        return <Clock size={20} className="text-slate-400" />
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-600 dark:text-slate-400 font-medium">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
        Syncing system parameters...
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold dark:text-white text-slate-900">CSV Bulk Import</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form Area */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Import Transaction Bundles</h2>
          
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white py-2.5 rounded-lg transition font-semibold text-sm border border-slate-200 dark:border-transparent shadow-sm"
          >
            <Download size={18} /> Download Structural Template
          </button>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Target Destination Account
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer text-sm"
            >
              <option value="">Choose account structure...</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.accountName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Raw CSV Document String Content
            </label>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={'Date,Description,Category,Amount,Type\n2026-06-15,Supermarket Run,Groceries,74.50,expense'}
              rows="6"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition leading-relaxed"
            />
          </div>

          <button
            type="button"
            onClick={handleUploadCSV}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-2.5 rounded-lg transition font-semibold shadow-md"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Parsing Framework...
              </>
            ) : (
              <>
                <Upload size={18} /> Execute Data Import
              </>
            )}
          </button>

          {importResult && (
            <div className={`p-4 rounded-lg text-sm font-medium border animate-in fade-in duration-200 ${
              importResult.status === 'completed' 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-200/50' 
                : 'bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 border-rose-200/50'
            }`}>
              <p className="flex items-center gap-1.5 font-bold mb-1">
                Import Evaluation Logs:
              </p>
              <p>✓ {importResult.successfulImports || 0} rows compiled cleanly.</p>
              {(importResult.failedRows > 0) && (
                <p className="text-rose-600 dark:text-rose-400 mt-1">✗ {importResult.failedRows} elements flagged or rejected.</p>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Instructional Reference Framework */}
        <div className="bg-blue-50/60 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-300">Operational Instructions</h2>
          <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200/80">
            <div>
              <p className="font-bold text-blue-900 dark:text-blue-300">1. Acquire Master Template Structure</p>
              <p className="text-xs mt-0.5">Generate your base structural format configuration directly via the system action button download link.</p>
            </div>
            <div>
              <p className="font-bold text-blue-900 dark:text-blue-300">2. Complete Mandatory Values</p>
              <p className="text-xs mt-0.5">Ensure columns follow sequence definitions strictly: Date (YYYY-MM-DD), Description, Category, Amount, Type.</p>
            </div>
            <div>
              <p className="font-bold text-blue-900 dark:text-blue-300">3. Raw Output Matrix Integration</p>
              <p className="text-xs mt-0.5">Paste tabular lines cleanly into the field entry terminal wrapper text area module box.</p>
            </div>
            
            <div className="bg-blue-100/60 dark:bg-blue-950/40 p-3.5 rounded-lg border border-blue-200 dark:border-blue-900/40 space-y-1.5 text-xs">
              <p className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1">
                ⚠️ Processing Structural Restrictions:
              </p>
              <p>• Floating points require standard format models (<code className="font-mono bg-blue-200/50 dark:bg-blue-900/60 px-1 rounded">50.00</code>, never truncate integers like <code className="font-mono bg-blue-200/50 dark:bg-blue-900/60 px-1 rounded">50</code>).</p>
              <p>• Direction constraints are bounded to string tags: <code className="font-mono bg-blue-200/50 dark:bg-blue-900/60 px-1 rounded">expense</code> or <code className="font-mono bg-blue-200/50 dark:bg-blue-900/60 px-1 rounded">income</code> explicitly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Import History Table Visualized */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Historical Execution Tracklogs</h2>
        <div className="space-y-3">
          {imports.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm py-4 text-center">No transaction bulk packages ingested yet.</p>
          ) : (
            imports.map((imp) => (
              <div key={imp._id} className="p-3.5 bg-slate-50 dark:bg-slate-900/30 rounded-lg flex justify-between items-center border border-slate-100 dark:border-slate-700/60 hover:border-slate-200 dark:hover:border-slate-600 transition">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{imp.fileName || 'Untitled Ingestion Event'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {imp.accountId?.accountName || 'Orphaned Account Reference'} • {imp.createdAt ? new Date(imp.createdAt).toLocaleDateString() : 'Unknown Date'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {imp.successfulImports || 0} / {imp.totalRows || 0}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Processed Rows</p>
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