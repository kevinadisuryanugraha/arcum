import React, { useState } from 'react';
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  Zap,
  Lock,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Activity,
  Sparkles,
  BarChart3,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { StockInfo } from '../types';
import { CONTRACT_ADDRESSES, CHAIN_CONFIG } from '../data/protocol';
import { quoteOption } from '../utils/pricing';

interface LandingPageProps {
  onNavigate: (route: string) => void;
  stocks: StockInfo[];
  onSelectStock: (stock: StockInfo) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  stocks,
  onSelectStock,
}) => {
  const [selectedStock, setSelectedStock] = useState<StockInfo>(stocks[0]);
  const [optionSide, setOptionSide] = useState<'UP' | 'DOWN'>('UP');
  const [optionSpeed, setOptionSpeed] = useState<'DAILY' | 'WEEKLY'>('DAILY');
  const [copiedContract, setCopiedContract] = useState<string | null>(null);

  // Quick live quote for interactive hero card
  const heroQuote = quoteOption(
    selectedStock.price,
    selectedStock.price,
    optionSpeed === 'DAILY' ? selectedStock.ivDailyBps : selectedStock.ivWeeklyBps,
    optionSpeed,
    optionSide === 'UP',
    10
  );

  const handleCopy = (key: string, addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedContract(key);
    setTimeout(() => setCopiedContract(null), 2000);
  };

  return (
    <div className="space-y-0 selection:bg-arcum-cyan/20 selection:text-arcum-cyan">
      {/* Top Announcement Bar (matching asterrapools.tech) */}
      <div className="border-b border-white/[0.08] bg-arcum-surface/60 py-1.5 px-4 text-center text-xs font-mono text-arcum-muted flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-arcum-cyan animate-pulse" />
        <span>Current updates @ArcumProtocol</span>
        <span className="text-white/20">•</span>
        <span className="text-white">Robinhood Chain Mainnet (Chain ID 4663)</span>
      </div>

      {/* SECTION 0: HERO SECTION (exact AsterraPools grid & layout) */}
      <section className="relative overflow-hidden border-b border-white/[0.08] pt-12 pb-20 lg:py-24">
        {/* Background Cobalt Glow */}
        <div className="pointer-events-none absolute -right-32 top-0 size-[550px] rounded-full bg-arcum-cobalt/20 blur-[140px]" />
        <div className="pointer-events-none absolute -left-32 bottom-0 size-[450px] rounded-full bg-arcum-cyan/15 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-12">
          {/* Left Column: Typography & CTAs */}
          <div className="space-y-7 z-10">
            {/* Status Pill */}
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-arcum-surface/90 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-arcum-muted shadow-sm">
                <span className="inline-block size-2 rounded-full bg-arcum-cyan animate-pulse" />
                Robinhood Chain
                <span className="text-white/30">•</span>
                <span className="text-arcum-cyan font-semibold">Live</span>
              </p>
            </div>

            {/* Giant Display H1 (Unbounded with text-prism animate-prism-pan on 'flow') */}
            <h1 className="text-4xl sm:text-6xl font-display font-semibold tracking-tight text-white leading-[1.1]">
              Built for the{' '}
              <span className="text-prism animate-prism-pan">
                flow
              </span>{' '}
              of everlasting options.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-arcum-muted max-w-xl leading-relaxed">
              Arcum builds deep derivative liquidity on Robinhood Chain. Continuous in-kind funding decay, zero Friday expirations, 
              and one closed-form ODE engine that quotes tokenized US equity options in real time.
            </p>

            {/* Hero Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-arcum-cyan to-arcum-cobalt text-black font-display font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-[0_0_28px_rgba(25,230,255,0.4)] active:scale-95 flex items-center gap-2"
              >
                <span>Launch app</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('markets')}
                className="px-5 py-3 rounded-xl bg-arcum-surface/80 border border-white/10 hover:border-white/20 text-white font-mono text-xs transition-all hover:bg-white/[0.04]"
              >
                Explore strikes
              </button>

              <button
                onClick={() => onNavigate('docs')}
                className="px-4 py-3 text-xs font-mono text-arcum-cyan hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>Read the docs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CA Banner */}
            <div className="pt-2">
              <p className="text-[11px] font-mono text-arcum-muted flex items-center gap-2">
                <span className="text-white/40">ARCUM ENGINE CA</span>
                <span className="text-arcum-cyan font-bold">{CONTRACT_ADDRESSES.engineProxy}</span>
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Live Route & Pricing Card (Asterra Route Card) */}
          <div className="relative z-10">
            <div className="rounded-2xl border border-white/10 bg-arcum-bgElevated/90 p-6 shadow-2xl backdrop-blur-xl space-y-6 glow-cyan-subtle">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-arcum-cyan animate-pulse" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                    Live Engine Route • Chain 4663
                  </span>
                </div>
                <span className="text-[11px] font-mono text-arcum-cyan px-2 py-0.5 rounded bg-arcum-cyan/10 border border-arcum-cyan/30">
                  Euler-Cauchy ODE
                </span>
              </div>

              {/* Stock Selector Pills */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono text-arcum-muted uppercase">Select Tokenized Stock:</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {stocks.map((s) => (
                    <button
                      key={s.symbol}
                      onClick={() => setSelectedStock(s)}
                      className={`p-2 rounded-lg text-center transition-all ${
                        selectedStock.symbol === s.symbol
                          ? 'bg-arcum-cyan/20 border border-arcum-cyan/50 text-white font-bold'
                          : 'bg-arcum-surface border border-white/5 text-arcum-muted hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-mono">{s.symbol}</div>
                      <div className="text-[10px] text-arcum-muted mt-0.5">${s.price.toFixed(1)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Up / Down & Speed Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex rounded-lg bg-arcum-surface p-1 border border-white/5 font-mono text-xs">
                  <button
                    onClick={() => setOptionSide('UP')}
                    className={`flex-1 py-1.5 rounded text-center transition-all ${
                      optionSide === 'UP'
                        ? 'bg-arcum-up/20 text-arcum-up font-bold border border-arcum-up/30'
                        : 'text-arcum-muted'
                    }`}
                  >
                    Up (Call)
                  </button>
                  <button
                    onClick={() => setOptionSide('DOWN')}
                    className={`flex-1 py-1.5 rounded text-center transition-all ${
                      optionSide === 'DOWN'
                        ? 'bg-arcum-down/20 text-arcum-down font-bold border border-arcum-down/30'
                        : 'text-arcum-muted'
                    }`}
                  >
                    Down (Put)
                  </button>
                </div>

                <div className="flex rounded-lg bg-arcum-surface p-1 border border-white/5 font-mono text-xs">
                  <button
                    onClick={() => setOptionSpeed('DAILY')}
                    className={`flex-1 py-1.5 rounded text-center transition-all ${
                      optionSpeed === 'DAILY'
                        ? 'bg-white/15 text-white font-bold'
                        : 'text-arcum-muted'
                    }`}
                  >
                    Daily (τ=1d)
                  </button>
                  <button
                    onClick={() => setOptionSpeed('WEEKLY')}
                    className={`flex-1 py-1.5 rounded text-center transition-all ${
                      optionSpeed === 'WEEKLY'
                        ? 'bg-white/15 text-white font-bold'
                        : 'text-arcum-muted'
                    }`}
                  >
                    Weekly (τ=7d)
                  </button>
                </div>
              </div>

              {/* Visualized Execution Route */}
              <div className="p-3.5 rounded-xl bg-arcum-dark/90 border border-white/5 font-mono text-xs space-y-2 text-arcum-muted">
                <div className="flex justify-between items-center text-white">
                  <span className="text-[11px] text-arcum-muted">Settlement:</span>
                  <span className="font-bold text-arcum-cyan">USDG (6 Decimals)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Mark Price:</span>
                  <span className="text-white font-bold">${heroQuote.markPriceUsdg.toFixed(3)} USDG / unit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Base Trade Fee (3 bps):</span>
                  <span className="text-white">${heroQuote.feeUsdg.toFixed(4)} USDG</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delta (Δ):</span>
                  <span className="text-arcum-cyan font-bold">{heroQuote.delta.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5 text-white font-bold">
                  <span>Total Order (10 Units):</span>
                  <span className="text-arcum-up text-sm font-tabular">${heroQuote.totalCostUsdg.toFixed(2)} USDG</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full py-3 rounded-xl bg-arcum-surface hover:bg-arcum-cyan/15 hover:border-arcum-cyan/40 border border-white/10 text-white font-display text-xs font-semibold uppercase tracking-wider transition-all text-center"
              >
                Trade {selectedStock.symbol} Options on Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 01: NATIVE TO ROBINHOOD CHAIN (exact Asterra Section 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 space-y-12">
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-wider text-arcum-cyan font-semibold">
            01 Native to Robinhood Chain
          </p>
          <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight">
            Derivatives where tokenized markets live.
          </h2>
          <p className="text-base text-arcum-muted max-w-2xl leading-relaxed">
            Robinhood Chain brings US equities, ETH and USDG onto one high-throughput EVM rollup. 
            Arcum is the derivatives engine underneath: synthetic Up & Down exposure, continuous in-kind funding decay, and automated Shield hedging.
          </p>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-arcum-surface/80 border border-white/10 space-y-2 hover:border-arcum-cyan/30 transition-all">
            <span className="text-xs font-mono uppercase text-arcum-muted">Total Option Volume</span>
            <p className="text-3xl font-display font-bold text-white font-tabular">$18.42M</p>
            <span className="text-[11px] text-arcum-muted">Cumulative USDG notional traded</span>
          </div>

          <div className="p-6 rounded-2xl bg-arcum-surface/80 border border-white/10 space-y-2 hover:border-arcum-cyan/30 transition-all">
            <span className="text-xs font-mono uppercase text-arcum-muted">Writer Pool Liquidity</span>
            <p className="text-3xl font-display font-bold text-arcum-cyan font-tabular">$2.50M</p>
            <span className="text-[11px] text-arcum-muted">ERC-4626 vault with 12-decimal shares</span>
          </div>

          <div className="p-6 rounded-2xl bg-arcum-surface/80 border border-white/10 space-y-2 hover:border-arcum-cyan/30 transition-all">
            <span className="text-xs font-mono uppercase text-arcum-muted">Base Protocol Fee</span>
            <p className="text-3xl font-display font-bold text-emerald-400 font-tabular">3 bps</p>
            <span className="text-[11px] text-arcum-muted">0.03% on buys and sells</span>
          </div>

          <div className="p-6 rounded-2xl bg-arcum-surface/80 border border-white/10 space-y-2 hover:border-arcum-cyan/30 transition-all">
            <span className="text-xs font-mono uppercase text-arcum-muted">Settlement Latency</span>
            <p className="text-3xl font-display font-bold text-white font-tabular">&lt; 0.4s</p>
            <span className="text-[11px] text-arcum-muted">Cancun EVM rollup block execution</span>
          </div>
        </div>
      </section>

      {/* SECTION 02: TWO ENGINES / TWO SPEEDS (exact Asterra Section 2) */}
      <section className="border-y border-white/[0.08] bg-arcum-bgElevated/60 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-wider text-arcum-cyan font-semibold">
              02 Two Speeds
            </p>
            <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight">
              Daily for precision. Weekly for depth.
            </h2>
            <p className="text-base text-arcum-muted max-w-2xl leading-relaxed">
              Different market horizons need different funding intervals. Tight, intraday speculation wants funding settled hour by hour. 
              Stock portfolio hedging wants calm, wide coverage without daily rolling friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Engine A: Daily Speed */}
            <div className="p-8 rounded-2xl bg-arcum-surface border border-white/10 space-y-5 hover:border-arcum-cyan/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white">
                  Daily Speed (τ = 86,400s)
                </span>
                <span className="text-xs font-mono text-arcum-cyan">15 bps spread</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                Intraday delta & earnings momentum
              </h3>
              <p className="text-sm text-arcum-muted leading-relaxed">
                The series trades tight around intraday equity moves. Fast decay rate aligns mark price closely with spot prices, 
                making it the optimal weapon for day traders, news events, and technical breakouts.
              </p>
              <div className="p-4 rounded-xl bg-arcum-dark/80 border border-white/5 font-mono text-xs space-y-1.5 text-arcum-muted">
                <div className="flex justify-between">
                  <span>Funding Interval:</span>
                  <span className="text-white">1 Day (86,400s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Accrual Cadence:</span>
                  <span className="text-white">1 Hour automated keeper</span>
                </div>
                <div className="flex justify-between">
                  <span>Primary Use:</span>
                  <span className="text-arcum-cyan">Day trading & momentum</span>
                </div>
              </div>
            </div>

            {/* Engine B: Weekly Speed */}
            <div className="p-8 rounded-2xl bg-arcum-surface border border-white/10 space-y-5 hover:border-arcum-cyan/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white">
                  Weekly Speed (τ = 604,800s)
                </span>
                <span className="text-xs font-mono text-arcum-cyan">25 bps spread</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                Institutional holding & Shield protection
              </h3>
              <p className="text-sm text-arcum-muted leading-relaxed">
                Slow funding decay rate provides durable, multi-week insurance against severe stock drawdowns. 
                This is the native engine powering 1-Click Automated Shield protection for equity token holders.
              </p>
              <div className="p-4 rounded-xl bg-arcum-dark/80 border border-white/5 font-mono text-xs space-y-1.5 text-arcum-muted">
                <div className="flex justify-between">
                  <span>Funding Interval:</span>
                  <span className="text-white">7 Days (604,800s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Decay Rate:</span>
                  <span className="text-white">7x slower than Daily</span>
                </div>
                <div className="flex justify-between">
                  <span>Primary Use:</span>
                  <span className="text-emerald-400">1-Click Shield Portfolio Hedge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: ONE ECOSYSTEM (exact Asterra Section 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 space-y-12">
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-wider text-arcum-cyan font-semibold">
            03 One Ecosystem
          </p>
          <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight">
            Hold the position. Protect the downside.
          </h2>
          <p className="text-base text-arcum-muted max-w-2xl leading-relaxed">
            Every option position is an ERC-20 token minted by the engine. Every trade is quoted with closed-form mathematical precision, 
            settles instantly against the Writer Pool in USDG, and can be managed autonomously by AI Agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-arcum-surface/80 border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-arcum-cyan/10 border border-arcum-cyan/30 flex items-center justify-center text-arcum-cyan">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">1-Click Automated Shield</h3>
            <p className="text-sm text-arcum-muted leading-relaxed">
              Synthetic equity token holders can purchase optimal weekly put protection in a single transaction. 
              The engine scans active strikes, picks the optimal floor 5% or 10% below spot, and transfers exact USDG without manual math.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-arcum-surface/80 border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-arcum-cobalt/10 border border-arcum-cobalt/30 flex items-center justify-center text-arcum-cobalt">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">3-Layer Writer Pool Waterfall</h3>
            <p className="text-sm text-arcum-muted leading-relaxed">
              Writer Pool LPs are shielded by an institutional defense waterfall: First-Loss Reserve Fund ($250k buffer) → 
              Second-Loss LMNS Staking → Core LP NAV. Proved 100% solvent during simulated -15% market shocks.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 04: STEP INSIDE — THE APP IS RIGHT HERE (exact Asterra Section 4) */}
      <section className="border-y border-white/[0.08] bg-arcum-bgElevated/60 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-wider text-arcum-cyan font-semibold">
              04 Step Inside
            </p>
            <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight">
              The app is right here.
            </h2>
            <p className="text-sm text-arcum-muted leading-relaxed">
              No waitlist, no teaser. Trade through the live engine, or explore the strike chain directly on the dashboard.
            </p>
          </div>

          {/* Embedded Interactive Gateway Card */}
          <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-arcum-surface border border-white/10 shadow-2xl space-y-6 glow-cyan-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-xs font-mono text-arcum-muted uppercase">Ready to trade:</span>
                <p className="text-lg font-display font-bold text-white">NVDA Everlasting Up & Down Series</p>
              </div>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-arcum-cyan to-arcum-cobalt text-black font-display font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-[0_0_20px_rgba(25,230,255,0.4)]"
              >
                Open Full Terminal
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-arcum-dark/60 border border-white/5">
                <span className="text-xs font-mono text-arcum-muted">NVDA Spot Price</span>
                <p className="text-xl font-bold text-white font-tabular mt-1">$142.50 USDG</p>
                <span className="text-[11px] text-emerald-400 font-mono">+3.42% (NYSE Regular)</span>
              </div>
              <div className="p-4 rounded-xl bg-arcum-dark/60 border border-white/5">
                <span className="text-xs font-mono text-arcum-muted">Implied Volatility</span>
                <p className="text-xl font-bold text-arcum-cyan font-tabular mt-1">52.0% IV</p>
                <span className="text-[11px] text-arcum-muted font-mono">VolOracle EIP-712 verified</span>
              </div>
              <div className="p-4 rounded-xl bg-arcum-dark/60 border border-white/5">
                <span className="text-xs font-mono text-arcum-muted">Writer Pool Yield</span>
                <p className="text-xl font-bold text-arcum-gold font-tabular mt-1">24.8% APY</p>
                <span className="text-[11px] text-arcum-muted font-mono">Continuous norm capture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: THE CONTRACTS BEHIND EVERY FEATURE (exact Asterra Section 5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 space-y-10">
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-wider text-arcum-cyan font-semibold">
            05 Verify Everything
          </p>
          <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight">
            The contracts behind every feature.
          </h2>
          <p className="text-base text-arcum-muted max-w-2xl leading-relaxed">
            Every address the app talks to, on Robinhood Chain (Chain ID: 4663). 
            Core contracts are compiled with Solidity 0.8.28 (Cancun EVM with EIP-1153 transient storage) and verified on Sourcify.
          </p>
        </div>

        {/* Contracts Table (matching Asterra's Section 5) */}
        <div className="rounded-2xl border border-white/10 bg-arcum-surface/80 overflow-hidden">
          <div className="divide-y divide-white/[0.08]">
            {Object.entries(CONTRACT_ADDRESSES).map(([name, addr]) => (
              <div
                key={name}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 hover:bg-white/[0.03] transition-colors"
              >
                <div>
                  <div className="font-display font-bold text-white text-sm capitalize">
                    {name}
                  </div>
                  <div className="font-mono text-xs text-arcum-muted mt-0.5">
                    {addr}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => handleCopy(name, addr)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-arcum-muted hover:text-white transition-all flex items-center gap-1.5"
                  >
                    {copiedContract === name ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`${CHAIN_CONFIG.blockExplorer}/address/${addr}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-arcum-muted hover:text-white transition-all"
                    title="View on Explorer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 06: GO WITH THE FLOW (exact Asterra Section 6) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-arcum-surface to-arcum-bgElevated p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-arcum-cyan/10 via-arcum-cobalt/10 to-arcum-violet/10 blur-2xl" />

          <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight z-10 relative">
            Go with the{' '}
            <span className="text-prism animate-prism-pan">
              flow.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-arcum-muted max-w-xl mx-auto z-10 relative">
            Trade, protect, route. Everlasting options on Robinhood Chain, everything in one place.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 z-10 relative">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-arcum-cyan to-arcum-cobalt text-black font-display font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-[0_0_28px_rgba(25,230,255,0.4)] active:scale-95"
            >
              Launch app
            </button>
            <button
              onClick={() => onNavigate('docs')}
              className="px-6 py-3.5 rounded-xl bg-arcum-surface border border-white/10 hover:border-white/20 text-white font-mono text-xs transition-all hover:bg-white/[0.04]"
            >
              Read documentation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
