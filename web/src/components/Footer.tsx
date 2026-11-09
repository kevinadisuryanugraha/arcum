import React from 'react';
import { Shield, ExternalLink, Terminal, BookOpen, FileText, Lock } from 'lucide-react';
import { CONTRACT_ADDRESSES, CHAIN_CONFIG } from '../data/protocol';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-arcum-surface/90 border-t border-arcum-border text-arcum-muted text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-arcum-gold to-arcum-goldMuted flex items-center justify-center text-arcum-dark font-bold font-mono text-xs">
                A
              </div>
              <span className="font-bold text-base text-white tracking-tight">ARCUM</span>
            </div>
            <p className="text-arcum-muted leading-relaxed mb-4">
              Everlasting options protocol for Robinhood Chain Stock Tokens settled in USDG. Continuous funding, no expiry dates, and institutional Writer Pool liquidity.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-arcum-goldMuted font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-arcum-up" />
              Target Network: Robinhood Chain (ID 4663)
            </div>
          </div>

          {/* Protocol Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Protocol</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-arcum-gold transition-colors">
                  Trading Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-arcum-gold transition-colors">
                  Products & Shield
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('markets')} className="hover:text-arcum-gold transition-colors">
                  Markets & Chains
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('writers')} className="hover:text-arcum-gold transition-colors">
                  Writer Pool Yield
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('costs')} className="hover:text-arcum-gold transition-colors">
                  Fee Structure (3 bps)
                </button>
              </li>
            </ul>
          </div>

          {/* Developers & Architecture */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Developers & Verification</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('contracts')} className="hover:text-arcum-gold transition-colors flex items-center gap-1">
                  Verified Contracts <ExternalLink className="w-3 h-3 text-arcum-muted" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('learn')} className="hover:text-arcum-gold transition-colors flex items-center gap-1">
                  Learning Center <BookOpen className="w-3 h-3 text-arcum-muted" />
                </button>
              </li>
              <li>
                <a
                  href={CHAIN_CONFIG.blockExplorer}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-arcum-gold transition-colors flex items-center gap-1"
                >
                  Blockscout Explorer <ExternalLink className="w-3 h-3 text-arcum-muted" />
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('exit')} className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1">
                  Emergency Exit Guide <Shield className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Security & Legal</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-arcum-muted">
                <Lock className="w-3.5 h-3.5 text-arcum-gold" />
                48-Hour Admin Timelock
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-arcum-gold transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-arcum-gold transition-colors">
                  Product Terms
                </button>
              </li>
              <li className="text-[11px] text-arcum-muted pt-2">
                Settled exclusively in USDG. Everlasting holding cost continuously decays effective units.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-arcum-border flex flex-col sm:flex-row items-center justify-between gap-4 text-arcum-muted text-[11px]">
          <div>
            © 2026 Arcum Protocol. Built on Robinhood Chain mainnet. Pinned upstream commit: <span className="font-mono text-arcum-goldMuted">1d434a3a</span> under MIT License.
          </div>
          <div className="flex items-center gap-4">
            <span>Settlement: USDG (0x5fc5...d168)</span>
            <span>•</span>
            <span>Cancun EVM</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
