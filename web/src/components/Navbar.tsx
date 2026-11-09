import React from 'react';
import { Shield, Wallet, ArrowUpRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import { SessionKind } from '../types';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  walletConnected: boolean;
  onConnectWallet: () => void;
  session: SessionKind;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  walletConnected,
  onConnectWallet,
  session,
}) => {
  const getSessionBadge = () => {
    switch (session) {
      case 'REGULAR':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-arcum-up/10 text-arcum-up border border-arcum-up/30 shadow-up-bloom/20">
            <span className="w-1.5 h-1.5 rounded-full bg-arcum-up animate-pulse" />
            NYSE Regular
          </span>
        );
      case 'EXTENDED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Extended
          </span>
        );
      case 'CLOSED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-white/5 text-arcum-muted border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-arcum-muted" />
            Closed (Decay Active)
          </span>
        );
      case 'HALTED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-arcum-down/10 text-arcum-down border border-arcum-down/30">
            <span className="w-1.5 h-1.5 rounded-full bg-arcum-down animate-ping" />
            Market Halted
          </span>
        );
    }
  };

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Products' },
    { id: 'markets', label: 'Markets' },
    { id: 'protocol', label: 'Protocol' },
    { id: 'costs', label: 'Costs' },
    { id: 'writers', label: 'Writers' },
    { id: 'learn', label: 'Learn' },
    { id: 'contracts', label: 'Contracts' },
  ];

  return (
    <div className="sticky top-3 z-50 px-4 sm:px-6 max-w-7xl mx-auto w-full transition-all">
      <header className="glass-island rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between border border-white/10">
        {/* Brand Group */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group transition-transform active:scale-[0.98]"
          >
            {/* Double-bezel hardware emblem */}
            <div className="w-9 h-9 rounded-xl p-0.5 bg-gradient-to-b from-arcum-gold to-arcum-goldDark/30 ring-1 ring-arcum-gold/40 shadow-gold-bloom/30 flex items-center justify-center">
              <div className="w-full h-full rounded-[9px] bg-arcum-dark flex items-center justify-center text-arcum-gold font-bold text-base font-brand">
                A
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-wider text-white font-brand group-hover:text-arcum-gold transition-colors">
                  ARCUM
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-arcum-gold font-mono font-medium">
                  4663
                </span>
              </div>
              <p className="text-[9px] text-arcum-muted font-mono tracking-widest uppercase">Everlasting Options</p>
            </div>
          </button>

          {/* Navigation Links with Hover Spotlight */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-medium tracking-wide transition-all ${
                  currentRoute === link.id
                    ? 'text-white bg-white/[0.08] shadow-inner font-semibold'
                    : 'text-arcum-muted hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {link.label}
                {currentRoute === link.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-arcum-gold shadow-gold-bloom" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Market Session Pill */}
          <div className="hidden sm:block">
            {getSessionBadge()}
          </div>

          {/* Network Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-white/[0.04] border border-white/[0.08] text-arcum-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-arcum-gold" />
            Robinhood Chain
          </div>

          {/* Button-in-Button Wallet Pill */}
          <button
            onClick={onConnectWallet}
            className={`group pl-3.5 pr-1.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2.5 active:scale-[0.98] ${
              walletConnected
                ? 'bg-white/[0.06] border border-arcum-gold/40 text-arcum-gold hover:border-arcum-gold'
                : 'bg-gradient-to-r from-arcum-gold to-arcum-goldMuted text-arcum-dark font-bold shadow-gold-bloom'
            }`}
          >
            {walletConnected ? (
              <>
                <span className="font-mono text-[11px]">0x71C8...a49B</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-arcum-gold/15 text-arcum-gold font-mono font-bold">
                  5,000 USDG
                </span>
              </>
            ) : (
              <>
                <span>Connect Wallet</span>
                <div className="w-6 h-6 rounded-full bg-arcum-dark/20 flex items-center justify-center text-arcum-dark group-hover:translate-x-0.5 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </>
            )}
          </button>
        </div>
      </header>
    </div>
  );
};
