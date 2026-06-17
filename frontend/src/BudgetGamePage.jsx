import React, { useState } from 'react';
import { 
  DollarSign, CheckCircle2, AlertTriangle, Play, RotateCcw, 
  Home, ShoppingCart, Lightbulb, Clapperboard, HeartPulse, Car, 
  HelpCircle, Sparkles, Trophy, Skull, X, Coins, HelpCircle as MiscIcon
} from 'lucide-react';

const INITIAL_CARDS = [
  { id: 'rent', label: 'Rent & Housing', icon: Home, border: 'border-blue-200', defaultMin: 800, hint: 'Survival tip: Shelter keeps you alive!' },
  { id: 'food', label: 'Groceries & Food', icon: ShoppingCart, border: 'border-emerald-200', defaultMin: 300, hint: 'You need calories to maintain health score.' },
  { id: 'utilities', label: 'Bills & Utilities', icon: Lightbulb, border: 'border-amber-200', defaultMin: 150, hint: 'Electricity, water, and internet bills.' },
  { id: 'transport', label: 'Transport / Gas', icon: Car, border: 'border-purple-200', defaultMin: 100, hint: 'Commuting to work or managing fuel costs.' },
  { id: 'health', label: 'Healthcare & Ins.', icon: HeartPulse, border: 'border-rose-200', defaultMin: 100, hint: 'Emergency backup in case of random events.' },
  { id: 'fun', label: 'Fun & Entertainment', icon: Clapperboard, border: 'border-pink-200', defaultMin: 50, hint: 'Mental health buffer! Going completely zero hurts mood.' },
  { id: 'others', label: 'Others / Misc', icon: MiscIcon, border: 'border-slate-300', defaultMin: 0, hint: 'Shopping, gifts, or any random dynamic expenses.' }, // 🌟 Added the Others Card cleanly!
];

export default function BudgetGamePage() {
  const [totalBudget, setTotalBudget] = useState(2500);
  const [cardAmounts, setCardAmounts] = useState({
    rent: '', food: '', utilities: '', transport: '', health: '', fun: '', others: ''
  });
  const [activeCard, setActiveCard] = useState(INITIAL_CARDS[0].id);
  const [isSimulated, setIsSimulated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  const handleAmountChange = (id, val) => {
    setCardAmounts(prev => ({ ...prev, [id]: val }));
  };

  // Live Stats calculations
  const currentSpent = Object.values(cardAmounts).reduce((sum, amt) => sum + (Number(amt) || 0), 0);
  const remainingWallet = totalBudget - currentSpent;

  const runSurvivalCheck = () => {
    setIsSimulated(true);
    
    setTimeout(() => {
      let brokenRules = [];
      let criticalFailures = 0;

      // 1. Bankrupt check
      if (currentSpent > totalBudget) {
        brokenRules.push(`Overspent! Account went into debt by $${Math.abs(remainingWallet)}.`);
        criticalFailures += 3;
      }

      // 2. Threshold checks
      INITIAL_CARDS.forEach(card => {
        const userAmt = Number(cardAmounts[card.id]) || 0;
        // If they skipped rent/food completely
        if ((card.id === 'rent' || card.id === 'food') && userAmt === 0) {
          brokenRules.push(`Skipped ${card.label} entirely! You can't survive without this.`);
          criticalFailures += 2;
        } else if (userAmt > 0 && userAmt < card.defaultMin) {
          brokenRules.push(`Underallocated ${card.label}! Spent $${userAmt} but safe minimum was $${card.defaultMin}.`);
          criticalFailures += 1;
        }
      });

      // Gamified Win/Loss Logic
      let isWin = criticalFailures === 0 && remainingWallet >= 0;
      let title = isWin ? "VICTORY! PERFECT STRATEGY" : "GAME OVER! FINANCIAL CRASH";
      let score = 100 - (criticalFailures * 20);
      if (remainingWallet < 0) score = Math.max(10, score - 30);
      score = Math.max(0, Math.min(100, score));

      setGameResult({
        success: isWin,
        title,
        score,
        savings: remainingWallet > 0 ? remainingWallet : 0,
        rulesBreached: brokenRules,
      });

      setIsSimulated(false);
      setShowModal(true); 
    }, 1200);
  };

  const resetGame = () => {
    setCardAmounts({ rent: '', food: '', utilities: '', transport: '', health: '', fun: '', others: '' });
    setGameResult(null);
    setShowModal(false);
    setActiveCard(INITIAL_CARDS[0].id);
  };

  const activeCardData = INITIAL_CARDS.find(c => c.id === activeCard);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-800 dark:text-slate-100 relative">
      
      {/* Top Hud Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="text-yellow-400 fill-yellow-400 animate-pulse" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Sandbox Mode</span>
          </div>
          <h1 className="text-3xl font-black mt-1">BudgetQuest Simulator</h1>
          <p className="text-slate-300 text-sm">Tap cards, allocate money optionally, and instantly test your financial IQ.</p>
        </div>

        <div className="flex gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 w-full md:w-auto justify-around">
          <div className="text-center px-2">
            <span className="text-xs text-slate-400 block font-medium">Target Income</span>
            <input 
              type="number" 
              value={totalBudget} 
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="text-xl font-black bg-transparent border-b-2 border-indigo-500/40 focus:border-indigo-400 w-24 text-center outline-none"
            />
          </div>
          <div className="w-[1px] bg-white/10 self-stretch"></div>
          <div className="text-center px-2">
            <span className="text-xs text-slate-400 block font-medium">Potential Savings</span>
            <span className={`text-xl font-black block ${remainingWallet < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              ${remainingWallet < 0 ? 0 : remainingWallet}
            </span>
          </div>
        </div>
      </div>

      {/* Main Rack Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">🎴 Click Cards to Edit</h2>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Unused cards count as $0</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {INITIAL_CARDS.map((card) => {
              const CardIcon = card.icon;
              const currentVal = cardAmounts[card.id];
              const isFilled = currentVal && Number(currentVal) > 0;
              const isSelected = activeCard === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => setActiveCard(card.id)}
                  className={`relative p-5 rounded-xl border-2 cursor-pointer bg-white dark:bg-slate-800 transition-all duration-200 select-none ${
                    isSelected 
                      ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-md -translate-y-1' 
                      : `${card.border} hover:border-slate-400 shadow-sm`
                  }`}
                >
                  {isFilled && (
                    <span className="absolute top-2 right-2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                      ${currentVal}
                    </span>
                  )}
                  
                  <div className={`p-3 w-fit rounded-lg mb-4 ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
                    <CardIcon size={22} />
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white">{card.label}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Safety Limit: ${card.defaultMin}</p>
                </div>
              );
            })}
          </div>

          {/* CHECK SCORE BUTTON */}
          <button
            onClick={runSurvivalCheck}
            disabled={isSimulated}
            className="w-full mt-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all text-lg tracking-wide flex items-center justify-center gap-2"
          >
            {isSimulated ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>🎮 RUN BUDGET STRESS TEST</>
            )}
          </button>
        </div>

        {/* Right Side Control Panel */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm h-fit space-y-4">
          {activeCardData && (
            <>
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                  <activeCardData.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{activeCardData.label}</h3>
                  <span className="text-xs text-slate-400">Enter expected limit</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg flex items-start gap-2">
                <HelpCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                {activeCardData.hint}
              </p>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Allocated Cash</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="number"
                    placeholder="0"
                    value={cardAmounts[activeCardData.id]}
                    onChange={(e) => handleAmountChange(activeCardData.id, e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent font-bold text-lg outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= WIN/LOSS MODAL POPUP ================= */}
      {showModal && gameResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl p-8 text-center shadow-2xl relative border transform transition-all scale-100 duration-300 ${
            gameResult.success 
              ? 'bg-gradient-to-b from-emerald-50 via-white to-white dark:from-emerald-950 dark:via-slate-900 dark:to-slate-900 border-emerald-500/30' 
              : 'bg-gradient-to-b from-rose-50 via-white to-white dark:from-rose-950 dark:via-slate-900 dark:to-slate-900 border-rose-500/30'
          }`}>
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center justify-center space-y-2 mt-2">
              {gameResult.success ? (
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
                  <Trophy size={44} />
                </div>
              ) : (
                <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/40 rounded-full flex items-center justify-center text-rose-600 animate-pulse">
                  <Skull size={44} />
                </div>
              )}
              
              <h2 className={`text-2xl font-black tracking-tight mt-4 ${gameResult.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {gameResult.title}
              </h2>
            </div>

            <div className="my-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Financial Survival Rating</span>
              <div className="text-5xl font-black text-slate-900 dark:text-white mt-1">{gameResult.score}%</div>
              
              <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-700 flex justify-around text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">Total Expenses</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">${currentSpent}</span>
                </div>
                <div className="w-[1px] bg-slate-200 dark:bg-slate-700 self-stretch"></div>
                <div>
                  <span className="text-slate-400 block text-xs">Max Saved Capital</span>
                  <span className="font-extrabold text-emerald-500 flex items-center gap-1 justify-center">
                    <Coins size={14} /> ${gameResult.savings}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left space-y-2 max-h-36 overflow-y-auto mb-6 px-1">
              {gameResult.success ? (
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-xl text-center">
                  🔥 Incredible! Your layout matches every macro necessity while keeping a safe savings buffer. You win!
                </p>
              ) : (
                gameResult.rulesBreached.map((rule, idx) => (
                  <div key={idx} className="p-3 bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs rounded-xl flex items-start gap-2 font-medium">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5 text-rose-500" />
                    <span>{rule}</span>
                  </div>
                ))
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-sm transition text-slate-700 dark:text-slate-200"
              >
                Inspect Layout
              </button>
              <button
                onClick={resetGame}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition"
              >
                Try Better Strategy
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}