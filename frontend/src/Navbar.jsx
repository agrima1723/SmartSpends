import React from 'react'
import { useAuth } from './AuthContext'
import { LogOut, User, Settings } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = React.useState(false)

  const formatCurrency = (value) => {
    const currencies = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      JPY: '¥',
      AUD: 'A$',
    }
    return currencies[user?.baseCurrency] || '$'
  }

  // In Navbar.jsx, modify the <nav> container and the user dropdown:

  return (
    <nav className="bg-slate-950/20 backdrop-blur-md border-b border-white/5 shadow-sm relative z-20">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-xl font-extrabold tracking-tight text-white/90">
            Workspace Hub
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner hidden sm:flex">
            <span className="text-xs font-bold text-slate-400 tracking-wider">BASE:</span>
            <span className="text-xs font-black text-cyan-400">
              {user?.baseCurrency && `${formatCurrency(1)} ${user.baseCurrency}`}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 bg-gradient-to-r from-white/5 to-white/0 pl-3 pr-1.5 py-1.5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-200 tracking-wide">{user?.displayName || 'User'}</p>
                <p className="text-[10px] text-cyan-400 font-medium">Active Member</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center border border-white/20 uppercase shadow-md shadow-cyan-500/10">
                <User size={16} className="text-white" />
              </div>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden animate-fadeIn">
                <div className="p-1.5 space-y-1">
                  <button
                    onClick={() => {
                      logout()
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-rose-500/10 text-rose-400 text-sm font-semibold transition-colors"
                  >
                    <LogOut size={16} />
                    Terminate Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
