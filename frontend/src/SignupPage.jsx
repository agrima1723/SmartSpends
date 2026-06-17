// import React, { useState } from 'react'
// import { useAuth } from './AuthContext'

// export default function SignupPage({ onToggle }) {
//   const { signup, loading } = useAuth()
//   const [formData, setFormData] = useState({
//     email: '',
//     displayName: '',
//     password: '',
//     confirmPassword: '',
//     baseCurrency: 'USD',
//   })
//   const [error, setError] = useState('')

//   const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'INR']

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match')
//       return
//     }

//     if (formData.password.length < 8) {
//       setError('Password must be at least 8 characters')
//       return
//     }

//     try {
//       await signup(
//         formData.email,
//         formData.displayName,
//         formData.password,
//         formData.baseCurrency
//       )
//     } catch (err) {
//       setError(err.message || 'Signup failed')
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
//               Create your account
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
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="your@email.com"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                 Display Name
//               </label>
//               <input
//                 type="text"
//                 name="displayName"
//                 value={formData.displayName}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Your Name"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                 Base Currency
//               </label>
//               <select
//                 name="baseCurrency"
//                 value={formData.baseCurrency}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {currencies.map((curr) => (
//                   <option key={curr} value={curr}>
//                     {curr}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="••••••••"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="••••••••"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
//             >
//               {loading ? 'Creating account...' : 'Sign Up'}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-slate-600 dark:text-slate-400 text-sm">
//               Already have an account?{' '}
//               <button
//                 onClick={onToggle}
//                 className="text-blue-500 hover:text-blue-600 font-medium"
//               >
//                 Sign in
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
import React, { useState } from 'react'
import { useAuth } from './AuthContext'

export default function SignupPage({ onToggle }) {
  const { signup, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: '',
    confirmPassword: '',
    baseCurrency: 'USD',
  })
  const [error, setError] = useState('')

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'INR']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    try {
      await signup(
        formData.email,
        formData.displayName,
        formData.password,
        formData.baseCurrency
      )
    } catch (err) {
      setError(err.message || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-950 via-indigo-950 to-blue-950 flex flex-col justify-between relative overflow-x-hidden font-sans select-none">
      
      {/* Contained Ambient Light Fields (Prevents vertical page stretching) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-purple-600/15 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[650px] h-[650px] bg-blue-600/15 rounded-full blur-[160px]" />
      </div>

      {/* Main Structural Wrapper - Form Centered Alone */}
      <div className="w-full flex-1 flex items-center justify-center relative z-10 py-16 px-4">
        <div className="w-full max-w-xl transform transition-all duration-500 animate-in fade-in slide-in-from-bottom-8">
          <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-white/20 dark:border-slate-800/80 p-10 sm:p-12 relative overflow-hidden">
            
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            <div className="text-center mb-10 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center text-4xl shadow-lg shadow-cyan-500/20 mb-5 transform hover:rotate-12 transition-transform duration-300">
                💰
              </div>
              <h2 className="text-4xl font-black tracking-tight text-white mb-2">
                Create Account
              </h2>
              <p className="text-slate-300 font-bold text-xs uppercase tracking-widest">
                Deploy a new custom ledger session
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/40 text-red-200 rounded-xl text-sm font-semibold backdrop-blur-md flex items-center gap-3 animate-shake">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 mb-2">
                  System User ID (Email)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-slate-950/50 text-white text-base font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 shadow-inner"
                  placeholder="name@domain.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-slate-950/50 text-white text-base font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 shadow-inner"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 mb-2">
                  Base Currency
                </label>
                <div className="relative">
                  <select
                    name="baseCurrency"
                    value={formData.baseCurrency}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-slate-950/50 text-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 shadow-inner appearance-none cursor-pointer"
                  >
                    {currencies.map((curr) => (
                      <option key={curr} value={curr} className="bg-slate-950 text-white">
                        {curr}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                    ▼
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 mb-2">
                  Access Code (Password)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-slate-950/50 text-white text-base font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 mb-2">
                  Confirm Access Code
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-slate-950/50 text-white text-base font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-900 text-white font-extrabold rounded-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] shadow-lg text-base mt-4 uppercase tracking-widest"
              >
                {loading ? 'Registering Deployment...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-white/10 pt-5 relative z-10">
              <p className="text-slate-300 text-base font-medium">
                Already have an account?{' '}
                <button
                  onClick={onToggle}
                  className="text-cyan-400 hover:text-cyan-300 font-extrabold underline decoration-dotted underline-offset-4"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Premium Footer (Flush to the page bottom) */}
      <footer className="w-full border-t border-white/10 bg-slate-950/40 backdrop-blur-xl pt-16 pb-12 relative z-10">
        <div className="max-w-8xl mx-auto px-8 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 pb-12">
            
            {/* Column 1: Brand Identifier */}
            <div className="md:col-span-4 space-y-4 text-left">
              <div className="flex items-center space-x-3 text-white font-black text-2xl tracking-tight">
                <span>💰</span>
                <span>BUDGET TRACKER</span>
              </div>
              <p className="text-slate-400 text-base font-medium leading-relaxed max-w-sm">
                A simple, secure, and intuitive ledger application engineered to optimize personal cash flow management and balance forecasting.
              </p>
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>All Systems Operational</span>
              </div>
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
              &copy; {new Date().getFullYear()} Budget Tracker. All rights reserved.
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