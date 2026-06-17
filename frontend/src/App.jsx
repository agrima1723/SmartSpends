import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import ForgotPasswordPage from './ForgotPasswordPage'
import Dashboard from './DashboardPage'
import Transactions from './TransactionsPage'
import Analytics from './AnalyticsPage'
import BudgetsPage from './BudgetsPage'
import RecurringPage from './RecurringPage'
import GoalsPage from './GoalsPage'
import WarrantyPage from './WarrantyPage'
import ImportPage from './ImportPage'
import AccountsPage from './AccountsPage'
import CategoriesPage from './CategoriesPage'
import ProfileEditPage from './ProfileEditPage'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import BudgetGamePage from './BudgetGamePage.jsx'
import AiPlanner from './AiPlanner';
export default function App() {
  // ALL hooks must live up here together unconditionally!
  const { isAuthenticated, user } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showSignup, setShowSignup] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  // Always start with login for security - no automatic token restoration
  if (!isAuthenticated) {
    if (showForgotPassword) {
      return <ForgotPasswordPage onBack={() => setShowForgotPassword(false)} />
    }
    return showSignup ? (
      <SignupPage onToggle={() => setShowSignup(false)} />
    ) : (
      <LoginPage onToggle={() => setShowSignup(true)} onForgotPassword={() => setShowForgotPassword(true)} />
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'transactions':
        return <Transactions />
      case 'analytics':
        return <Analytics />
      case 'budgets':
        return <BudgetsPage />
      case 'recurring':
        return <RecurringPage />
      case 'goals':
        return <GoalsPage />
      case 'accounts':
        return <AccountsPage />
      case 'categories':
        return <CategoriesPage />
      case 'warranty':
        return <WarrantyPage />
      case 'import':
        return <ImportPage />
      case 'budgetGame': // Naya Game Page Case 🎮
        return <BudgetGamePage />
      case 'aiPlanner': 
        return <AiPlanner />
      case 'profile-edit':
        return <ProfileEditPage />
      default:
        return <Dashboard />
    }
  }

 // Inside App.jsx, replace ONLY the final return statement with this:

  return (
    <div className="flex h-screen bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-slate-950 via-slate-900 to-indigo-950 text-slate-100 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Floating Animated Ambient Orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] animate-glow-slow pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[160px] animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Your existing routing logic works perfectly inside this new wrapper */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Navbar />
        {/* Transparent main content area allowing the cosmic background to shine through */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-transparent">
          <div className="max-w-7xl mx-auto space-y-8">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  )
}
// import React, { useState } from 'react'
// import { 
//   LayoutDashboard, Wallet, CreditCard, BarChart3, PieChart, 
//   Target, RefreshCw, Trophy, ShieldAlert, FileInput, LogOut, ChevronRight 
// } from 'lucide-react'

// // Import your page components here
// import DashboardPage from './DashboardPage'
// import LoyaltyCardsPage from './LoyaltyCardsPage'
// import WarrantyPage from './WarrantyPage'
// // import TransactionsPage from './TransactionsPage' etc...

// export default function App() {
//   // Keeps track of which tab from image_3746c9.png is currently displayed
//   const [activeTab, setActiveTab] = useState('Dashboard')
  
//   // Mock user data matching the profile chip in the top-right corner
//   const user = { name: 'agrima' }

//   // Complete navigation array matching your sidebar exactly
//   const menuItems = [
//     { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
//     { id: 'Transactions', label: 'Transactions', icon: Wallet },
//     { id: 'Accounts', label: 'Accounts', icon: CreditCard },
//     { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
//     { id: 'Budgets', label: 'Budgets', icon: PieChart },
//     { id: 'Categories', label: 'Categories', icon: Target },
//     { id: 'Recurring', label: 'Recurring', icon: RefreshCw },
//     { id: 'Goals', label: 'Goals', icon: Trophy },
//     { id: 'BudgetQuest', label: 'BudgetQuest', icon: Trophy },
//     { id: 'Warranties', label: 'Warranties', icon: ShieldAlert },
//     { id: 'CSV Import', label: 'CSV Import', icon: FileInput },
//   ]

//   // Conditional rendering engine for the main workspace view
//   const renderContent = () => {
//     switch (activeTab) {
//       case 'Dashboard':
//         return <DashboardPage />
//       case 'Warranties':
//         return <WarrantyPage />
//       case 'Accounts':
//         // Fallback or actual component if you have it implemented
//         return <LoyaltyCardsPage /> 
//       default:
//         return (
//           <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-12 rounded-2xl text-center">
//             <h3 className="text-xl font-bold text-slate-300 mb-2">{activeTab} View</h3>
//             <p className="text-slate-500 text-sm">This section is fully linked to the new cosmic design grid.</p>
//           </div>
//         )
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
//       {/* Dynamic Animated Ambient Background Orbs */}
//       <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] animate-glow-slow pointer-events-none" />
//       <div className="absolute bottom-[10%] right-[-5%] w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[160px] animate-float pointer-events-none" />

//       {/* --- SIDEBAR CONTAINER --- */}
//       <aside className="w-72 bg-slate-950/40 backdrop-blur-2xl border-r border-white/5 flex flex-col justify-between p-6 shrink-0 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.3)]">
//         <div>
//           {/* Top App Identity Brand Chip */}
//           <div className="flex items-center gap-3 px-2 mb-10 group">
//             <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform group-hover:rotate-12 transition-transform duration-300">
//               <span className="text-xl">💰</span>
//             </div>
//             <div>
//               <h2 className="text-md font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
//                 Budget Tracker
//               </h2>
//               <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Financial Engine</p>
//             </div>
//           </div>

//           {/* Interactive Navigation Rows */}
//           <nav className="space-y-1">
//             {menuItems.map((item) => {
//               const Icon = item.icon
//               const isActive = activeTab === item.id
//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => setActiveTab(item.id)}
//                   className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 transform group border ${
//                     isActive 
//                       ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] scale-[1.02]' 
//                       : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:border-white/5 hover:translate-x-1'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3.5">
//                     <Icon size={18} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
//                     <span>{item.label}</span>
//                   </div>
//                   {isActive && <ChevronRight size={14} className="text-cyan-400 animate-pulse" />}
//                 </button>
//               )
//             })}
//           </nav>
//         </div>

//         {/* Dynamic Action Area: Logout Anchor */}
//         <div className="border-t border-white/5 pt-4 mt-6">
//           <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200">
//             <LogOut size={16} />
//             <span>Sign Out Session</span>
//           </button>
//         </div>
//       </aside>

//       {/* --- WORKSPACE WINDOW AREA --- */}
//       <div className="flex-1 flex flex-col min-w-0 relative z-10">
        
//         {/* Upper Integrated Navigation Strip */}
//         <header className="h-20 bg-slate-950/20 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 relative z-20">
//           <div className="flex items-center gap-3">
//             <h1 className="text-xl font-extrabold tracking-tight text-white/90">
//               Financial Control Center
//             </h1>
//             <span className="bg-white/5 text-slate-400 border border-white/10 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
//               Live Core
//             </span>
//           </div>

//           <div className="flex items-center gap-6">
//             {/* Active Currency Badge indicator */}
//             <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
//               <span className="text-xs font-bold text-slate-400 tracking-wider">CURRENCY:</span>
//               <span className="text-xs font-black text-cyan-400">INR (₹)</span>
//             </div>

//             {/* Profile Interface Capsule */}
//             <div className="flex items-center gap-3 bg-gradient-to-r from-white/5 to-white/0 pl-3 pr-1.5 py-1.5 rounded-xl border border-white/10">
//               <div className="text-right">
//                 <p className="text-xs font-black text-slate-200 tracking-wide">{user.name}</p>
//                 <p className="text-[10px] text-slate-400 font-medium">Premium Workspace</p>
//               </div>
//               <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center border border-white/20 uppercase shadow-md shadow-cyan-500/10">
//                 {user.name.slice(0, 2)}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Component Display Sub-Container mount */}
//         <main className="flex-1 p-8 overflow-y-auto">
//           <div className="max-w-7xl mx-auto">
//             {renderContent()}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }