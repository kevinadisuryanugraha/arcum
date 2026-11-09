import React from 'react';
import { ArrowRight, Shield, Zap, TrendingUp, DollarSign, Lock, AlertTriangle, ChevronRight, BarChart3, CheckCircle2 } from 'lucide-react';
import { StockInfo } from '../types';

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
  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        {/* Glow backdrop */}
        <div className="absolute inset-0 -top-24 max-w-4xl mx-auto h-[450px] bg-gradient-to-b from-arcum-gold/10 via-arcum-surface/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-arcum-card border border-arcum-gold/30 text-xs text-arcum-goldMuted font-mono">
          <span className="w-2 h-2 rounded-full bg-arcum-gold animate-pulse" />
          Live on Robinhood Chain Mainnet (Chain ID 4663)
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-sans max-w-4xl mx-auto leading-tight">
          Everlasting Options for{' '}
          <span className="bg-gradient-to-r from-arcum-gold via-arcum-goldLight to-arcum-goldMuted bg-clip-text text-transparent">
            Stock Tokens.
          </span>
        </h1>

        {/* Subhead */}
        <p className="text-lg sm:text-xl text-arcum-muted max-w-2xl mx-auto leading-relaxed">
          Continuous funding. Zero expiration dates. Liquid USDG settlement. Buy Up & Down exposure, protect synthetic equity via Shield, or earn yields in the USDG Writer Pool.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-arcum-gold to-arcum-goldMuted text-arcum-dark font-semibold text-base flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-arcum-gold/20"
          >
            Launch Trading App <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('products')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-arcum-surface border border-arcum-border hover:border-arcum-gold/40 text-white font-medium text-base transition-all"
          >
            Explore Mechanisms
          </button>
        </div>

        {/* Key Metrics Banner */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="bg-arcum-card/60 border border-arcum-border rounded-xl p-5 text-left">
            <div className="text-xs font-mono text-arcum-muted uppercase">Base Trade Fee</div>
            <div className="text-2xl font-bold text-white font-tabular mt-1">3 bps</div>
            <div className="text-[11px] text-arcum-muted mt-0.5">0.03% on execution</div>
          </div>
          <div className="bg-arcum-card/60 border border-arcum-border rounded-xl p-5 text-left">
            <div className="text-xs font-mono text-arcum-muted uppercase">Funding Speeds</div>
            <div className="text-2xl font-bold text-arcum-gold font-tabular mt-1">Daily & Weekly</div>
            <div className="text-[11px] text-arcum-muted mt-0.5">Continuous norm decay</div>
          </div>
          <div className="bg-arcum-card/60 border border-arcum-border rounded-xl p-5 text-left">
            <div className="text-xs font-mono text-arcum-muted uppercase">Writer Pool NAV</div>
            <div className="text-2xl font-bold text-white font-tabular mt-1">$2.50M USDG</div>
            <div className="text-[11px] text-arcum-up mt-0.5">Conservative entry bound</div>
          </div>
          <div className="bg-arcum-card/60 border border-arcum-border rounded-xl p-5 text-left">
            <div className="text-xs font-mono text-arcum-muted uppercase">Admin Security</div>
            <div className="text-2xl font-bold text-white font-tabular mt-1">48h Timelock</div>
            <div className="text-[11px] text-arcum-muted mt-0.5">No instant key upgrades</div>
          </div>
        </div>
      </section>

      {/* Stock Token Chains Preview */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-arcum-gold uppercase tracking-wider">Launch Assets</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Robinhood Chain Stock Tokens</h2>
          </div>
          <p className="text-sm text-arcum-muted max-w-md">
            Everlasting options reference tokenized equities using high-fidelity feeds with automated NYSE market session guards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              className="bg-arcum-surface border border-arcum-border hover:border-arcum-gold/40 rounded-xl p-5 space-y-4 transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-white font-mono">{stock.symbol}</span>
                <span className={`text-xs font-mono font-medium ${stock.change24h >= 0 ? 'text-arcum-up' : 'text-arcum-down'}`}>
                  {stock.change24h >= 0 ? '+' : ''}{stock.change24h.toFixed(2)}%
                </span>
              </div>
              <div>
                <div className="text-xs text-arcum-muted truncate">{stock.name}</div>
                <div className="text-2xl font-bold text-white font-tabular mt-0.5">${stock.price.toFixed(2)}</div>
              </div>
              <div className="pt-2 border-t border-arcum-border/60 flex items-center justify-between text-xs font-mono text-arcum-muted">
                <span>Daily IV</span>
                <span className="text-arcum-gold">{(stock.ivDailyBps / 100).toFixed(0)}%</span>
              </div>
              <button
                onClick={() => {
                  onSelectStock(stock);
                  onNavigate('dashboard');
                }}
                className="w-full py-2 rounded-lg bg-arcum-card hover:bg-arcum-gold/10 hover:text-arcum-gold text-white text-xs font-medium border border-arcum-border transition-colors flex items-center justify-center gap-1"
              >
                Trade Options <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Core Protocol Pillars */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-mono text-arcum-gold uppercase tracking-wider">Financial Mechanics</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Engineered for Robustness</h2>
          <p className="text-arcum-muted">
            Arcum replaces traditional fixed-expiry option rolling with continuous funding and conservative liquidity management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-arcum-surface border border-arcum-border rounded-2xl p-8 space-y-5">
            <div className="w-12 h-12 rounded-xl bg-arcum-up/10 border border-arcum-up/20 flex items-center justify-center text-arcum-up">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Up & Down Exposure</h3>
            <p className="text-sm text-arcum-muted leading-relaxed">
              Buy Calls (Up) or Puts (Down) on tokenized stocks. Pay bounded USDG upfront with zero margin debt and zero liquidation risk. Holding cost continuously decays effective units via normalization factor Norm_t.
            </p>
            <ul className="text-xs space-y-2 text-arcum-muted font-mono pt-2 border-t border-arcum-border">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-arcum-up" /> No roll-over fee or maturity date
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-arcum-up" /> Daily (tau = 1d) & Weekly (tau = 7d)
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="bg-arcum-surface border border-arcum-border rounded-2xl p-8 space-y-5">
            <div className="w-12 h-12 rounded-xl bg-arcum-gold/10 border border-arcum-gold/20 flex items-center justify-center text-arcum-gold">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Automated Shield</h3>
            <p className="text-sm text-arcum-muted leading-relaxed">
              Protect existing Stock Token holdings against market drawdowns. Shield reads your wallet balance and purchases the optimal eligible Weekly Down option at or below the selected protection strike.
            </p>
            <ul className="text-xs space-y-2 text-arcum-muted font-mono pt-2 border-t border-arcum-border">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-arcum-gold" /> 1-Click portfolio downside protection
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-arcum-gold" /> Supported across NVDA, TSLA, AAPL, SPY, QQQ
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="bg-arcum-surface border border-arcum-border rounded-2xl p-8 space-y-5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">USDG Writer Pool</h3>
            <p className="text-sm text-arcum-muted leading-relaxed">
              Provide USDG liquidity to underwrite options and capture continuous holding-cost funding and trade fees. The pool maintains spot hedges and enforces conservative liability bounds on capital entry and exit.
            </p>
            <ul className="text-xs space-y-2 text-arcum-muted font-mono pt-2 border-t border-arcum-border">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> 24h deposit lock + 72h withdrawal queue
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> 35% NAV total liability cap
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Holding Cost Decay Explainer */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-arcum-surface to-arcum-card border border-arcum-border rounded-2xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="text-xs font-mono text-arcum-gold uppercase tracking-wider">Trader Education</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Understanding Holding Cost & Norm Decay</h2>
            <p className="text-sm text-arcum-muted leading-relaxed">
              Because Arcum options have no expiration date, buyers pay continuous funding for optionality. Unlike perpetual futures where funding is settled via cash margin calls, Arcum uses an in-kind <strong className="text-white">normalization factor (Norm_t)</strong>:
            </p>
            <div className="bg-arcum-bg p-4 rounded-xl border border-arcum-border font-mono text-xs text-arcum-goldMuted space-y-1">
              <div>Effective Units = Token Balance × Norm(t)</div>
              <div className="text-arcum-muted text-[11px]">Norm starts at 1.0 and decays continuously based on time value / tau.</div>
            </div>
            <p className="text-xs text-arcum-muted leading-relaxed">
              Even though your wallet ERC-20 token count remains identical, the exercisable payout reduces over elapsed time. Weekend and closed-market hours continue to decay the norm.
            </p>
          </div>

          <div className="bg-arcum-bg/80 border border-arcum-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-arcum-muted">Holding Speed Comparison</span>
              <span className="text-arcum-gold font-bold">14-Day Simulation</span>
            </div>
            {/* Visual Bar 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-white font-medium">Daily Speed (tau = 1d)</span>
                <span className="text-arcum-muted font-mono">~35% of original norm remaining</span>
              </div>
              <div className="h-3 w-full bg-arcum-surface rounded-full overflow-hidden border border-arcum-border">
                <div className="h-full bg-arcum-gold rounded-full" style={{ width: '35%' }} />
              </div>
              <p className="text-[10px] text-arcum-muted">Higher decay rate, lower upfront mark spread. Best for day intraday swings.</p>
            </div>
            {/* Visual Bar 2 */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-white font-medium">Weekly Speed (tau = 7d)</span>
                <span className="text-arcum-muted font-mono">~72% of original norm remaining</span>
              </div>
              <div className="h-3 w-full bg-arcum-surface rounded-full overflow-hidden border border-arcum-border">
                <div className="h-full bg-arcum-up rounded-full" style={{ width: '72%' }} />
              </div>
              <p className="text-[10px] text-arcum-muted">Lower daily decay rate. Best for Shield portfolio protection and multi-week trends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="bg-arcum-card border border-arcum-gold/30 rounded-3xl p-12 max-w-4xl mx-auto space-y-6 gold-glow">
          <h2 className="text-3xl font-bold text-white">Ready to trade Everlasting Options?</h2>
          <p className="text-arcum-muted max-w-xl mx-auto text-sm">
            Connect your Web3 wallet, switch to Robinhood Chain (ID 4663), and start trading tokenized equity options with USDG settlement.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-arcum-gold to-arcum-goldMuted text-arcum-dark font-semibold text-base flex items-center gap-2 hover:opacity-95 shadow-md shadow-arcum-gold/20"
            >
              Enter Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
