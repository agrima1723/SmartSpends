import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sparkles, Loader2, CheckCircle, AlertCircle, Wallet, Target, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AiPlanner() {
  const [formData, setFormData] = useState({ monthlyIncome: '', financialGoal: '', savingsTarget: '' });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [uiError, setUiError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUiError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication session missing. Please sign back in.');

      const response = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Server dropped calculation pipeline tracking.');
      
      const result = await response.json();
      setPlan(result);
    } catch (err) {
      console.error('Error generating AI plan:', err);
      setUiError(err.message || 'Failed to sync with layout data engine.');
    } finally {
      setLoading(false);
    }
  };

  // Vibrant custom color palette array for the dynamic bars
  const COLORS = ['#a855f7', '#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-white">
            <Sparkles className="text-cyan-400 fill-cyan-400/20 animate-pulse" size={36} /> 
            AI Financial Strategist
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-xl">
            Leverage advanced predictive analysis. Our engine maps your historic 30-day transactional history against core milestone targets to compute optimized blueprints.
          </p>
        </div>
      </div>

      {uiError && (
        <div className="p-4 bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-300 rounded-xl flex items-center gap-3 shadow-lg">
          <AlertCircle size={20} className="text-red-400 shrink-0" /> 
          <span className="text-sm font-medium">{uiError}</span>
        </div>
      )}

      {/* Inputs Form Section */}
      <form onSubmit={handleGenerate} className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-500" />
        
        <div className="space-y-2">
          <label className="text-xs uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1.5">
            <Wallet size={14} /> Monthly Disposable Income
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500 font-bold">$</span>
            <input type="number" required value={formData.monthlyIncome} onChange={e => setFormData({...formData, monthlyIncome: e.target.value})} className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition font-medium" placeholder="e.g. 6500" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-black tracking-widest text-purple-400 flex items-center gap-1.5">
            <Target size={14} /> Savings Milestone Target
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500 font-bold">$</span>
            <input type="number" required value={formData.savingsTarget} onChange={e => setFormData({...formData, savingsTarget: e.target.value})} className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition font-medium" placeholder="e.g. 1500" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-black tracking-widest text-indigo-400 flex items-center gap-1.5">
            <HelpCircle size={14} /> Strategic Milestone Focus
          </label>
          <input type="text" required value={formData.financialGoal} onChange={e => setFormData({...formData, financialGoal: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition font-medium" placeholder="e.g. Eliminate High Interest Debt, Down Payment" />
        </div>

        <button type="submit" disabled={loading} className="md:col-span-3 mt-2 w-full py-3.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 transition shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <>
              <Loader2 className="animate-spin text-white" size={18} /> 
              <span>Synthesizing Transaction Topologies & Formatting Matrix...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} className="fill-white/10" /> 
              <span>Compile AI Allocation Model</span>
            </>
          )}
        </button>
      </form>

      {/* Comprehensive Report Presentation */}
      {plan && (
        <div className="space-y-8 animate-fade-in">
          {/* Executive Summary Metrics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/40 p-6 rounded-2xl border border-white/5 shadow-xl">
              <p className="text-xs tracking-widest font-bold text-slate-500 uppercase">Target Income Ceiling</p>
              <p className="text-3xl font-black text-white mt-2">${Number(formData.monthlyIncome).toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/40 p-6 rounded-2xl border border-white/5 shadow-xl">
              <p className="text-xs tracking-widest font-bold text-slate-500 uppercase">Target Savings Goal</p>
              <p className="text-3xl font-black text-cyan-400 mt-2">${Number(formData.savingsTarget).toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/40 p-6 rounded-2xl border border-white/5 shadow-xl">
              <p className="text-xs tracking-widest font-bold text-slate-500 uppercase">Objective Scope</p>
              <p className="text-lg font-bold text-purple-400 mt-2 truncate capitalize">"{formData.financialGoal}"</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Visual Analytics Chart Card Layout */}
            <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-2xl lg:col-span-7 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">Macro Allocation Blueprint</h2>
                <p className="text-slate-400 text-xs mt-1">Recommended target balances designed to fulfill requested savings profiles.</p>
              </div>
              <div className="mt-6 w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={plan.allocations} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0d" />
                    <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 10, fontWeight: 600 }} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} formatter={(v) => `$${v}`} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }}
                      contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      formatter={(val, name, props) => [`$${val.toLocaleString()} (${props.payload.percentage}%)`, 'Recommended Allocation']}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                      {plan.allocations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strategic Insights Cards Checklist Panel */}
            <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-2xl lg:col-span-5 flex flex-col">
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" size={22} /> Strategic Framework Insights
              </h2>
              <p className="text-slate-400 text-xs mt-1">Granular optimization suggestions computed based on recent real spending patterns.</p>
              
              <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
                {plan.insights.map((tip, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/50 border border-white/5 flex gap-3 items-start hover:border-white/10 transition duration-300">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/15 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black text-indigo-400 border border-indigo-500/20">
                      {idx + 1}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed font-medium">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New Element: Descriptive Ledger Breakdown Table View */}
          <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-2xl">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Granular Category Matrix</h2>
            <p className="text-slate-400 text-xs mt-1">Detailed numerical breakdown of the tactical spending architecture.</p>
            
            <div className="mt-6 overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-left border-collapse bg-slate-950/20">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-950/80 text-xs font-black uppercase tracking-widest text-slate-400">
                    <th className="py-4 px-6">Category Strategy Item</th>
                    <th className="py-4 px-6 text-right">Target Allocation Vol</th>
                    <th className="py-4 px-6 text-right">Income Multiplier Ratio</th>
                    <th className="py-4 px-6">Strategic Tactical Intent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                  {plan.allocations.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition">
                      <td className="py-4 px-6 font-bold text-white capitalize flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full shadow-md" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        {item.category}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-slate-100">${item.amount.toLocaleString()}</td>
                      <td className="py-4 px-6 text-right font-mono text-cyan-400 font-semibold">{item.percentage}%</td>
                      <td className="py-4 px-6 text-xs text-slate-400 italic max-w-xs md:max-w-md font-medium leading-relaxed">
                        {item.description || `Optimized boundary set to ensure structural velocity towards your goal.`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}