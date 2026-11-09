import React from 'react';
import { TrendingUp, TrendingDown, Shield, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ProductsPageProps {
  onNavigate: (route: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-bold text-white font-sans">Arcum Financial Products</h1>
        <p className="text-base text-arcum-muted max-w-2xl mx-auto">
          Built on Robinhood Chain mainnet with USDG settlement. Four synchronized mechanisms designed to deliver everlasting options liquidity.
        </p>
      </div>

      <div className="space-y-8">
        {/* Product 1 */}
        <div className="bg-arcum-surface border border-arcum-border rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-arcum-up/10 text-arcum-up flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-bold text-white">Up Options (Calls)</h2>
            </div>
            <p className="text-sm text-arcum-muted leading-relaxed">
              Gain leveraged upside exposure to Stock Tokens (NVDA, TSLA, SPY, QQQ, AAPL). Pay a bounded USDG amount upfront. Zero margin calls or liquidations. Effective units decay continuously via the series normalization factor.
            </p>
            <div className="flex gap-4 text-xs font-mono text-arcum-gold">
              <span>Daily Speed (tau = 1d)</span>
              <span>•</span>
              <span>Weekly Speed (tau = 7d)</span>
            </div>
          </div>
          <div className="text-right">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 rounded-xl bg-arcum-up text-arcum-dark font-bold text-sm hover:opacity-95"
            >
              Trade Up Calls
            </button>
          </div>
        </div>

        {/* Product 2 */}
        <div className="bg-arcum-surface border border-arcum-border rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-arcum-down/10 text-arcum-down flex items-center justify-center font-bold">
                <TrendingDown className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-bold text-white">Down Options (Puts)</h2>
            </div>
            <p className="text-sm text-arcum-muted leading-relaxed">
              Profit from downside moves or hedge underlying synthetic equity. Strike selection gives pure non-linear put exposure without expiry constraints.
            </p>
          </div>
          <div className="text-right">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 rounded-xl bg-arcum-down text-white font-bold text-sm hover:opacity-95"
            >
              Trade Down Puts
            </button>
          </div>
        </div>

        {/* Product 3 */}
        <div className="bg-arcum-surface border border-arcum-border rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center gold-border-glow">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-arcum-gold/10 text-arcum-gold flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-bold text-white">Shield Portfolio Protection</h2>
            </div>
            <p className="text-sm text-arcum-muted leading-relaxed">
              The 1-click insurance desk for Stock Tokens. Shield inspects your wallet holding, selects an eligible listed Down series below the requested percentage floor, and executes exact bounded hedging.
            </p>
          </div>
          <div className="text-right">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-arcum-gold to-arcum-goldMuted text-arcum-dark font-bold text-sm hover:opacity-95"
            >
              Activate Shield
            </button>
          </div>
        </div>

        {/* Product 4 */}
        <div className="bg-arcum-surface border border-arcum-border rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-bold text-white">USDG Writer Pool</h2>
            </div>
            <p className="text-sm text-arcum-muted leading-relaxed">
              Underwrite everlasting options as a liquidity provider. Earn 80% protocol fee distribution + funding income. Governed by 24h deposit locks and 72h asynchronous withdrawal queues.
            </p>
          </div>
          <div className="text-right">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 rounded-xl bg-arcum-card border border-arcum-border hover:border-arcum-gold text-white font-bold text-sm"
            >
              Deposit Liquidity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
