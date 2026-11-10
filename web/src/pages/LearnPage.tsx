import React, { useState } from 'react';
import { Calculator, Activity } from 'lucide-react';
import { calculateAlpha, quoteOption } from '../utils/pricing';

export const LearnPage: React.FC = () => {
  const [calcSpot, setCalcSpot] = useState<number>(142.5);
  const [calcStrike, setCalcStrike] = useState<number>(145.0);
  const [calcIv, setCalcIv] = useState<number>(52);
  const [calcSpeed, setCalcSpeed] = useState<'DAILY' | 'WEEKLY'>('DAILY');

  const q = quoteOption(
    calcSpot,
    calcStrike,
    calcIv * 100,
    calcSpeed,
    true,
    1
  );

  const tau = calcSpeed === 'DAILY' ? 86400 : 604800;
  const alpha = calculateAlpha(calcIv * 100, tau);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-12">
      <div className="space-y-4 max-w-3xl">
        <span className="font-mono text-xs uppercase tracking-widest text-arcum-cyan font-bold">
          Quantitative Foundations
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
          Closed-Form Everlasting Pricing Sandbox
        </h1>
        <p className="text-base text-arcum-muted leading-relaxed">
          Arcum Everlasting Options solve the Euler-Cauchy partial differential equation under continuous geometric Brownian motion. 
          Interact with the live mathematical model below to observe characteristic parameter alpha (α), mark price, and Greeks.
        </p>
      </div>

      {/* Interactive Sandbox Card */}
      <div className="rounded-xl bg-arcum-bgElevated border border-white/10 p-6 sm:p-8 space-y-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-arcum-cyan" />
            <h2 className="text-lg font-display font-bold text-white">Euler-Cauchy ODE Solver</h2>
          </div>
          <span className="text-xs font-mono text-arcum-cyan px-2.5 py-1 rounded bg-arcum-cyan/10 border border-arcum-cyan/25">
            Solidity 0.8.28 Exact Parity
          </span>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-arcum-muted">Spot Price (S)</label>
            <input
              type="number"
              value={calcSpot}
              onChange={(e) => setCalcSpot(parseFloat(e.target.value) || 1)}
              className="w-full bg-arcum-surface border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-arcum-cyan/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-arcum-muted">Strike Price (K)</label>
            <input
              type="number"
              value={calcStrike}
              onChange={(e) => setCalcStrike(parseFloat(e.target.value) || 1)}
              className="w-full bg-arcum-surface border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-arcum-cyan/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-arcum-muted">Annualized IV (%)</label>
            <input
              type="number"
              value={calcIv}
              onChange={(e) => setCalcIv(parseFloat(e.target.value) || 1)}
              className="w-full bg-arcum-surface border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-arcum-cyan/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-arcum-muted">Funding Interval</label>
            <select
              value={calcSpeed}
              onChange={(e) => setCalcSpeed(e.target.value as 'DAILY' | 'WEEKLY')}
              className="w-full bg-arcum-surface border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-arcum-cyan/50"
            >
              <option value="DAILY">Daily (86,400s)</option>
              <option value="WEEKLY">Weekly (604,800s)</option>
            </select>
          </div>
        </div>

        {/* Live Mathematical Solution Output */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl bg-arcum-surface border border-white/5 font-mono text-xs">
          <div>
            <span className="text-arcum-muted block">Characteristic Alpha (α):</span>
            <span className="text-lg font-bold text-arcum-cyan font-tabular">{alpha.toFixed(4)}</span>
          </div>
          <div>
            <span className="text-arcum-muted block">Mark Price (V):</span>
            <span className="text-lg font-bold text-white font-tabular">${q.markPriceUsdg.toFixed(3)} USDG</span>
          </div>
          <div>
            <span className="text-arcum-muted block">Delta (Δ):</span>
            <span className="text-lg font-bold text-arcum-cyan font-tabular">{q.delta.toFixed(3)}</span>
          </div>
          <div>
            <span className="text-arcum-muted block">Gamma (Γ):</span>
            <span className="text-lg font-bold text-white font-tabular">{q.gamma.toFixed(5)}</span>
          </div>
        </div>

        {/* ODE Formula Reference Box */}
        <div className="p-4 rounded-xl bg-arcum-dark/90 border border-white/10 font-mono text-xs text-arcum-muted space-y-1.5 overflow-x-auto">
          <p className="text-white font-bold">// Euler-Cauchy Stationary ODE:</p>
          <p className="text-arcum-cyan">1/2 * σ² * S² * V''(S) - (1/τ) * V(S) + (1/τ) * Payoff(S) = 0</p>
          <p>α = (1 + sqrt(1 + 8 / (σ² * τ))) / 2</p>
          <p>If S ≤ K: V_call = (K / (2*α - 1)) * (S / K)^α</p>
          <p>If S &gt; K: V_call = (S - K) + (K / (2*α - 1)) * (K / S)^(α - 1)</p>
        </div>
      </div>
    </div>
  );
};
