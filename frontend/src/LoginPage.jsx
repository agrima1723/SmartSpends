// import React, { useState } from 'react'
// import { useAuth } from './AuthContext'

// export default function LoginPage({ onToggle, onForgotPassword }) {
//   const { login, loading } = useAuth()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')

//     try {
//       await login(email, password)
//     } catch (err) {
//       setError(err.message || 'Login failed')
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl p-8">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
//               💰 Budget Tracker
//             </h1>
//             <p className="text-slate-600 dark:text-slate-400">
//               Manage your finances smartly
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {error && (
//               <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="your@email.com"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="••••••••"
//                 required
//               />
//               <div className="text-right mt-1">
//                 <button
//                   type="button"
//                   onClick={onForgotPassword}
//                   className="text-xs text-blue-500 hover:text-blue-600 font-medium"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
//             >
//               {loading ? 'Signing in...' : 'Sign In'}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-slate-600 dark:text-slate-400 text-sm">
//               Don't have an account?{' '}
//               <button
//                 onClick={onToggle}
//                 className="text-blue-500 hover:text-blue-600 font-medium"
//               >
//                 Sign up
//               </button>
//             </p>
//           </div>

//           <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//             <p className="text-xs text-slate-600 dark:text-slate-400">
//               <strong>Demo credentials:</strong> Use any email/password to test
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
//2 

// import React, { useState } from 'react'
// import { useAuth } from './AuthContext'

// export default function LoginPage({ onToggle, onForgotPassword }) {
//   const { login, loading } = useAuth()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')

//     try {
//       await login(email, password)
//     } catch (err) {
//       setError(err.message || 'Login failed')
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-950 via-indigo-950 to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Dynamic Animated Ambient Background Orbs */}
//       <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse dynamic-delay pointer-events-none" />

//       <div className="w-full max-w-md relative z-10 transform transition-all duration-500 animate-in fade-in slide-in-from-bottom-8">
//         <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/10 dark:border-slate-800/60 p-8">
          
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-200 to-indigo-200 mb-2 drop-shadow-sm">
//               💰 Budget Tracker
//             </h1>
//             <p className="text-slate-300 font-medium text-sm tracking-wide">
//               Manage your finances smartly
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {error && (
//               <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl text-sm backdrop-blur-md animate-shake">
//                 {error}
//               </div>
//             )}

//             <div>
//               <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 dark:bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 shadow-inner"
//                 placeholder="your@email.com"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 dark:bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 shadow-inner"
//                 placeholder="••••••••"
//                 required
//               />
//               <div className="text-right mt-2">
//                 <button
//                   type="button"
//                   onClick={onForgotPassword}
//                   className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-800 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] shadow-lg"
//             >
//               {loading ? 'Signing in...' : 'Sign In'}
//             </button>
//           </form>

//           <div className="mt-8 text-center border-t border-white/10 pt-4">
//             <p className="text-slate-400 text-sm">
//               Don't have an account?{' '}
//               <button
//                 onClick={onToggle}
//                 className="text-cyan-400 hover:text-cyan-300 font-bold underline decoration-dotted underline-offset-4"
//               >
//                 Sign up
//               </button>
//             </p>
//           </div>

//           <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl border border-white/5 backdrop-blur-sm">
//             <p className="text-xs text-slate-300 leading-relaxed text-center">
//               💡 <strong>Demo credentials:</strong> Use any email/password combo to test drive.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
import React, { useState } from 'react'
import { useAuth } from './AuthContext'

export default function LoginPage({ onToggle, onForgotPassword }) {
  const { login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
    } catch (err) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-950 via-indigo-950 to-blue-950 flex flex-col justify-between relative overflow-x-hidden font-sans select-none">
      
      {/* Contained Ambient Light Fields (Wrapped to prevent vertical page stretching) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-purple-600/15 rounded-full blur-[180px]" />
        <div className="absolute top-[30%] right-[-20%] w-[850px] h-[850px] bg-cyan-600/15 rounded-full blur-[200px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[650px] h-[650px] bg-blue-600/15 rounded-full blur-[160px]" />
      </div>

      {/* Main Structural Wrapper */}
      <div className="w-full max-w-8xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10 py-20 px-6 sm:px-12">
        
        {/* Left Section: Advanced Platform Capabilities Checklist */}
        <div className="lg:col-span-7 space-y-12 text-left animate-in fade-in slide-in-from-left-8 duration-600">
          <div className="space-y-6">
            
            <h1 className="text-6xl sm:text-7xl xl:text-8xl font-black tracking-tight text-white leading-none">
              Professional accounting <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-300 drop-shadow-md">
                simplified for everyone.
              </span>
            </h1>
            <p className="text-slate-200 text-xl sm:text-2xl max-w-3xl font-medium leading-relaxed">
              An ecosystem engineered to provide absolute visibility over your capital. Track personal or team wealth channels, verify trend metrics in real time, and safely automate savings targets from a unified console.
            </p>
          </div>

          {/* Deep Feature Categorization Layout */}
          <div className="space-y-10">
            
            {/* Group 1: Core Bookkeeping & Infrastructure */}
            <div>
              <h3 className="text-base font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-3">
                <span className="h-px w-12 bg-slate-700 inline-block"></span> Core Ledger & Infrastructure
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 sm:p-7 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-start gap-5">
                    <span className="text-4xl p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">🧮</span>
                    <div>
                      <h4 className="text-white font-extrabold text-xl mb-2">Inline Math Expressions</h4>
                      <p className="text-slate-300 text-base leading-relaxed">
                        Skip external apps. Enter mathematical syntax like <code className="text-cyan-300 bg-slate-950/60 px-2 py-0.5 rounded font-mono text-sm">100+50+25</code> instantly inside any transaction field.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-start gap-5">
                    <span className="text-4xl p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">🏦</span>
                    <div>
                      <h4 className="text-white font-extrabold text-xl mb-2">Multi-Currency Portfolios</h4>
                      <p className="text-slate-300 text-base leading-relaxed">
                        Create diverse sub-accounts supporting custom initial asset configurations and cross-border currency conversions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-start gap-5">
                    <span className="text-4xl p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">📊</span>
                    <div>
                      <h4 className="text-white font-extrabold text-xl mb-2">Hub Dashboard</h4>
                      <p className="text-slate-300 text-base leading-relaxed">
                        Your central command center. Get a high-level, aggregate summary of all portfolio metrics and capital distributions instantly.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-start gap-5">
                    <span className="text-4xl p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">💸</span>
                    <div>
                      <h4 className="text-white font-extrabold text-xl mb-2">Ledger Log Audit</h4>
                      <p className="text-slate-300 text-base leading-relaxed">
                        A detailed chronological log of all past entries, allowing deep filtering, query searching, and structured transaction history.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Group 2: Intelligence & Visual Mapping */}
            <div>
              <h3 className="text-base font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-3">
                <span className="h-px w-12 bg-slate-700 inline-block"></span> Intelligence & Diagnostics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 sm:p-7 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-start gap-5">
                    <span className="text-4xl p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">📈</span>
                    <div>
                      <h4 className="text-white font-extrabold text-xl mb-2">Interactive Analytics</h4>
                      <p className="text-slate-300 text-base leading-relaxed">
                        Visualize dynamic income vs. expense bars, historical trend timelines, and category allocation donuts effortlessly.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-start gap-5">
                    <span className="text-4xl p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">🎯</span>
                    <div>
                      <h4 className="text-white font-extrabold text-xl mb-2">Goal & Budget Trackers</h4>
                      <p className="text-slate-300 text-base leading-relaxed">
                        Establish cap parameters by operational category, monitor real-time spent percentages, and lock down spending limits.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-start gap-5">
                    <span className="text-4xl p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">⏰</span>
                    <div>
                      <h4 className="text-white font-extrabold text-xl mb-2">Recurring Cycles</h4>
                      <p className="text-slate-300 text-base leading-relaxed">
                        Automate routine transactions. Setup repeating invoices, rolling subscriptions, and scheduled transfers without manual input.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-start gap-5">
                    <span className="text-4xl p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">🛡️</span>
                    <div>
                      <h4 className="text-white font-extrabold text-xl mb-2">Savings Targets</h4>
                      <p className="text-slate-300 text-base leading-relaxed">
                        Define distinct savings milestones with progress loading feeds that adapt automatically based on leftover ledger capital.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Group 3: Automation & Simulator */}
            <div>
              <h3 className="text-base font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-3">
                <span className="h-px w-12 bg-slate-700 inline-block"></span> Simulation & Advanced Utilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 sm:p-7 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-start gap-5">
                    <span className="text-4xl p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">🎮</span>
                    <div>
                      <h4 className="text-white font-extrabold text-xl mb-2">BudgetQuest Simulator</h4>
                      <p className="text-slate-300 text-base leading-relaxed">
                        Enter Sandbox mode to allocate trial funds, launch interactive financial stress tests, and improve your overall survival IQ.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-md hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-start gap-5">
                    <span className="text-4xl p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">📤</span>
                    <div>
                      <h4 className="text-white font-extrabold text-xl mb-2">Bulk CSV Data Importer</h4>
                      <p className="text-slate-300 text-base leading-relaxed">
                        Move off spreadsheet templates. Paste raw comma-separated ledger rows directly into specific active targets.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Glassmorphic Access Terminal Card */}
        <div className="lg:col-span-5 w-full max-w-xl mx-auto transform transition-all duration-500 animate-in fade-in slide-in-from-bottom-8">
          <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-white/20 dark:border-slate-800/80 p-12 relative overflow-hidden">
            
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            <div className="text-center mb-12 relative z-10">
              <div className="w-24 h-24 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center text-5xl shadow-lg shadow-cyan-500/20 mb-6 transform hover:rotate-12 transition-transform duration-300">
                💰
              </div>
              <h2 className="text-5xl font-black tracking-tight text-white mb-3">
              SmartSpends
              </h2>
              <p className="text-slate-300 font-bold text-sm uppercase tracking-widest">
                Enter credentials to initiate dashboard session
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              {error && (
                <div className="p-5 bg-red-500/20 border border-red-500/40 text-red-200 rounded-xl text-base font-semibold backdrop-blur-md flex items-center gap-3 animate-shake">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-slate-300 mb-3">
                  System User ID (Email)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-5 rounded-xl border border-white/10 bg-slate-950/50 text-white text-lg font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 shadow-inner"
                  placeholder="name@domain.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-bold uppercase tracking-widest text-slate-300">
                    Access Code (Password)
                  </label>
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-base text-cyan-400 hover:text-cyan-300 font-bold tracking-wide transition-colors"
                  >
                    Recover Code?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-5 rounded-xl border border-white/10 bg-slate-950/50 text-white text-lg font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 px-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-900 text-white font-extrabold rounded-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] shadow-lg text-lg mt-6 uppercase tracking-widest"
              >
                {loading ? 'Authenticating Profile...' : 'Initialize Session'}
              </button>
            </form>

            <div className="mt-12 text-center border-t border-white/10 pt-8 relative z-10">
              <p className="text-slate-300 text-lg font-medium">
                New deployment?{' '}
                <button
                  onClick={onToggle}
                  className="text-cyan-400 hover:text-cyan-300 font-extrabold underline decoration-dotted underline-offset-4"
                >
                  Register Account
                </button>
              </p>
            </div>

            {/* <div className="mt-8 p-5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl border border-white/5 backdrop-blur-sm relative z-10 text-center">
              <p className="text-base text-slate-300 leading-relaxed font-medium">
                💡 <strong>Sandbox Rule:</strong> Enter any temporary simulation email and password pattern combinations to evaluate UI features.
              </p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Clean Premium Broader Corporate Footer (Flush to the page bottom) */}
      <footer className="w-full border-t border-white/10 bg-slate-950/40 backdrop-blur-xl mt-auto pt-16 pb-12 relative z-10">
        <div className="max-w-8xl mx-auto px-8 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 pb-12">
            
            {/* Column 1: Brand Identifier */}
            <div className="md:col-span-4 space-y-4 text-left">
              <div className="flex items-center space-x-3 text-white font-black text-2xl tracking-tight">
                <span>💰</span>
                <span> SMART SPENDS</span>
              </div>
              <p className="text-slate-400 text-base font-medium leading-relaxed max-w-sm">
                A simple, secure, and intuitive ledger application engineered to optimize personal cash flow management and balance forecasting.
              </p>
              {/* <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>All Systems Operational</span>
              </div> */}
            </div>

            {/* Column 2: Core Features */}
            <div className="md:col-span-3 text-left space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-200">Core Essentials</h4>
              <ul className="space-y-2.5 text-base font-medium text-slate-400">
                <li className="hover:text-cyan-400 transition-colors duration-200 cursor-pointer">📊 Hub Dashboard</li>
                <li className="hover:text-cyan-400 transition-colors duration-200 cursor-pointer">🏦 Multi-Currency Portfolios</li>
                <li className="hover:text-cyan-400 transition-colors duration-200 cursor-pointer">💸 Ledger Log Audit</li>
                <li className="hover:text-cyan-400 transition-colors duration-200 cursor-pointer">📈 Interactive Analytics</li>
              </ul>
            </div>

            {/* Column 3: Advanced Utilities */}
            <div className="md:col-span-3 text-left space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-200">Advanced Utilities</h4>
              <ul className="space-y-2.5 text-base font-medium text-slate-400">
                <li className="hover:text-cyan-400 transition-colors duration-200 cursor-pointer">⏰ Recurring Cycles</li>
                <li className="hover:text-cyan-400 transition-colors duration-200 cursor-pointer">🛡️ Savings Targets</li>
                <li className="hover:text-cyan-400 transition-colors duration-200 cursor-pointer">🎮 BudgetQuest Simulator</li>
                <li className="hover:text-cyan-400 transition-colors duration-200 cursor-pointer">📤 Bulk CSV Importer</li>
              </ul>
            </div>

            {/* Column 4: Engineering Authorities */}
            <div className="md:col-span-2 text-left space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-200">Development</h4>
              <div className="space-y-3 text-base font-medium text-slate-400">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Designed & Built By</p>
                  <p className="text-slate-200 font-bold mt-0.5">Agrima Soni</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Support Desk</p>
                  <a 
                    href="mailto:agrimasoni.as2005@gmail.com" 
                    className="text-cyan-400 hover:text-cyan-300 underline font-bold transition-colors block mt-0.5 break-all"
                  >
                    agrimasoni.as2005@gmail.com
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Legal/Copyright Subbar */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-base font-medium text-slate-500">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} Smart Spends. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm font-bold text-slate-400">
              <span className="hover:text-slate-200 cursor-pointer transition-colors">Privacy Policy</span>
              <span>/</span>
              <span className="hover:text-slate-200 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
