import React, { useState } from 'react';
import { BookOpen, Calculator, Clock, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { calculateAlpha, quoteOption } from '../utils/pricing';

export const LearnPage: React.FC = () => {
  const [calcSpot, setCalcSpot] = useState<number>(100);
  const [calcStrike, setCalcStrike] = useState<number>(100);
  const [calcIv, setCalcIv] = useState<number>(50);
  const [calcSpeed, setCalcSpeed] = useState<'DAILY' | 'WEEKLY'>('DAILY');

  const q = quoteOption(
    calcSpot,
    calcStrike,
    calcIv * 100,
    calcSpeed,
    true,
    1
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-arcum-gold/10 text-arcum-gold border border-arcum-gold/30 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" /> Quantitative Option Mechanics
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white">Arcum Knowledge Center</h1>
        <p className="text-sm text-arcum-muted max-w-xl mx-auto">
          Understand closed-form everlasting options pricing, in-kind norm decay, NYSE equity session guards, and Shield portfolio hedging.
        </p>
      </div>

      {/* Interactive Pricing Calculator */}
      <div className="bg-arcum-surface border border-arcum-border rounded-2xl p-8 space-y-6 gold-glow">
        <div className="flex items-center justify-between border-b border-arcum-border pb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-arcum-gold" />
            <h2 className="text-lg font-bold text-white">Closed-Form Everlasting Pricing Sandbox</h2>
          </div>
          <span className="text-xs font-mono text-arcum-gold">Euler-Cauchy ODE Model</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-mono text-arcum-muted">Spot Price (S)</label>
            <input
              type="number"
              value={calcSpot}
              onChange={(e) => setCalcSpot(parseFloat(e.target.value) || 1)}
              className="w-full bg-arcum-card border border-arcum-border rounded-lg px-3 py-2 text-white font-mono text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-arcum-muted">Strike Price (K)</label>
            <input
              type="number"
              value={calcStrike}
              onChange={(e) => setCalcStrike(parseFloat(e.target.value) || 1)}
              className="w-full bg-arcum-card border border-arcum-border rounded-lg px-3 py-2 text-white font-mono text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-arcum-muted">Implied Vol (IV %)</label>
            <input
              type="number"
              value={calcIv}
              onChange={(e) => setCalcIv(parseFloat(e.target.value) || 1)}
              className="w-full bg-arcum-card border border-arcum-border rounded-lg px-3 py-2 text-white font-mono text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-arcum-muted">Speed (Tau)</label>
            <select
              value={calcSpeed}
              onChange={(e) => setCalcSpeed(e.target.value as 'DAILY' | 'WEEKLY')}
              className="w-full bg-arcum-card border border-arcum-border rounded-lg px-3 py-2 text-white font-mono text-sm mt-1"
            >
              <option value="DAILY">Daily (1d)</option>
              <option value="WEEKLY">Weekly (7d)</option>
            </select>
          </div>
        </div>

        <div className="bg-arcum-card border border-arcum-border rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs text-center">
          <div>
            <div className="text-arcum-muted">Mark Price</div>
            <div className="text-lg font-bold text-white font-tabular mt-1">${q.markPriceUsdg.toFixed(3)}</div>
          </div>
          <div>
            <div className="text-arcum-muted">Delta ($\Delta$)</div>
            <div className="text-lg font-bold text-arcum-gold font-tabular mt-1">{q.delta.toFixed(3)}</div>
          </div>
          <div>
            <div className="text-arcum-muted">Gamma ($\Gamma$)</div>
            <div className="text-lg font-bold text-white font-tabular mt-1">{q.gamma.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-arcum-muted">Est. Daily Decay</div>
            <div className="text-lg font-bold text-amber-400 font-tabular mt-1">-${q.dailyDecayUsdg.toFixed(3)}</div>
          </div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Core Educational Modules</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-arcum-surface border border-arcum-border rounded-xl p-6 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-arcum-gold" /> Daily Holding Cost & In-Kind Norm Decay
            </h3>
            <p className="text-xs text-arcum-muted leading-relaxed">
              Traditional perpetuals settle funding in cash, triggering liquidation risks. Arcum everlasting options settle holding cost continuously in-kind through the normalization factor (Norm_t).
            </p>
          </div>

          <div className="bg-arcum-surface border border-arcum-border rounded-xl p-6 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-arcum-up" /> Shield Protection Architecture
            </h3>
            <p className="text-xs text-arcum-muted leading-relaxed">
              Shield buys listed Weekly Down put options matching your tokenized stock inventory. Learn why Shield buys protection rather than promising an eternal static portfolio floor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
