import React from 'react'
// 🌟 Added Sparkles to the lucide-react import list
import { LayoutDashboard, TrendingUp, Wallet, BarChart3, Target, RotateCw, Briefcase, TrendingDown, Users, Clock, Upload, CreditCard, Tag, Gamepad2, Sparkles } from 'lucide-react'

export default function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    
    // 🌟 Placed the AI Budget Planner right under Analytics for a clean visual hierarchy
    { id: 'aiPlanner', label: 'AI Budget Planner', icon: Sparkles }, 

    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'recurring', label: 'Recurring', icon: RotateCw },
    { id: 'goals', label: 'Goals', icon: Briefcase },
    { id: 'budgetGame', label: 'BudgetQuest', icon: Gamepad2 }, // 🎮 Game item integrated cleanly here
    { id: 'warranty', label: 'Warranties', icon: Clock },
    { id: 'import', label: 'CSV Import', icon: Upload },
  ]

  return (
    <aside className="w-64 bg-slate-950/40 backdrop-blur-2xl border-r border-white/5 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.3)] overflow-y-auto z-20 shrink-0">
      <div className="p-6 group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform group-hover:rotate-12 transition-transform duration-300">
             <h2 className="text-xl font-bold text-white">💰</h2>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 mt-1">Budget</h1>
            <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Financial Engine</p>
          </div>
        </div>
      </div>

      <nav className="px-3 py-4 space-y-1.5 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 transform group border ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] scale-[1.02]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:border-white/5 hover:translate-x-1'
              }`}
            >
              <Icon size={18} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}