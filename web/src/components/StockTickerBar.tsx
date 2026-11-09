import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StockInfo } from '../types';

interface StockTickerBarProps {
  stocks: StockInfo[];
  selectedStock: StockInfo;
  onSelectStock: (stock: StockInfo) => void;
}

export const StockTickerBar: React.FC<StockTickerBarProps> = ({
  stocks,
  selectedStock,
  onSelectStock,
}) => {
  return (
    <div className="bg-arcum-surface/80 border-b border-arcum-border overflow-x-auto scrollbar-none py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4 min-w-max">
        <span className="text-xs uppercase tracking-wider text-arcum-muted font-medium pr-2 border-r border-arcum-border flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-arcum-gold animate-pulse" />
          Stock Tokens (USDG)
        </span>

        {stocks.map((stock) => {
          const isSelected = selectedStock.symbol === stock.symbol;
          const isPositive = stock.change24h >= 0;

          return (
            <button
              key={stock.symbol}
              onClick={() => onSelectStock(stock)}
              className={`flex items-center gap-3 px-3 py-1 rounded-md text-xs font-mono transition-all ${
                isSelected
                  ? 'bg-arcum-card border border-arcum-gold/40 text-white shadow-sm'
                  : 'hover:bg-arcum-card/50 text-arcum-muted hover:text-white border border-transparent'
              }`}
            >
              <div className="font-bold font-sans text-arcum-text">{stock.symbol}</div>
              <div className="font-tabular font-medium text-white">${stock.price.toFixed(2)}</div>
              <div
                className={`flex items-center gap-0.5 font-tabular font-medium ${
                  isPositive ? 'text-arcum-up' : 'text-arcum-down'
                }`}
              >
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? '+' : ''}{stock.change24h.toFixed(2)}%
              </div>
              <div className="text-[10px] text-arcum-muted bg-arcum-bg px-1.5 py-0.5 rounded border border-arcum-border">
                IV {(stock.ivDailyBps / 100).toFixed(0)}%
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
