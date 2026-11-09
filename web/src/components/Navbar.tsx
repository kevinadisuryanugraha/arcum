import React from 'react';
import { Activity, Shield, Wallet, ExternalLink, ChevronDown, CheckCircle2 } from 'lucide-react';
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
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-arcum-up/10 text-arcum-up border border-arcum-up/30">
            <span className="w-1.5 h-1.5 rounded-full bg-arcum-up animate-pulse" />
            NYSE Regular (Active)
          </span>
        );
      case 'EXTENDED':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Extended Hours
          </span>
        );
      case 'CLOSED':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-arcum-border text-arcum-muted border border-arcum-borderLight">
            <span className="w-1.5 h-1.5 rounded-full bg-arcum-muted" />
            Closed (Continuous Decay)
          </span>
        );
      case 'HALTED':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-arcum-down/10 text-arcum-down border border-arcum-down/30">
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
    <header className="sticky top-0 z-50 bg-arcum-bg/90 backdrop-blur-md border-b border-arcum-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-arcum-gold to-arcum-goldMuted flex items-center justify-center text-arcum-dark font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
              <span className="font-mono tracking-tighter">A</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-white font-sans group-hover:text-arcum-gold transition-colors">
                  ARCUM
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-arcum-card border border-arcum-border text-arcum-goldMuted font-mono">
                  4663
                </span>
              </div>
              <p className="text-[10px] text-arcum-muted tracking-wider uppercase">Everlasting Options</p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentRoute === link.id
                    ? 'text-arcum-gold bg-arcum-gold/10'
                    : 'text-arcum-muted hover:text-white hover:bg-arcum-surface'
                }`}
              >
                {link.label}
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

          {/* Network Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-arcum-surface border border-arcum-border text-arcum-muted">
            <span className="w-2 h-2 rounded-full bg-arcum-gold" />
            Robinhood Chain
          </div>

          {/* Wallet Button */}
          <button
            onClick={onConnectWallet}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              walletConnected
                ? 'bg-arcum-surface border border-arcum-gold/40 text-arcum-gold hover:border-arcum-gold'
                : 'bg-gradient-to-r from-arcum-gold to-arcum-goldMuted text-arcum-dark font-semibold hover:opacity-95 shadow-md shadow-arcum-gold/10'
            }`}
          >
            <Wallet className="w-4 h-4" />
            {walletConnected ? (
              <span className="font-mono text-xs">0x71C8...a49B (5,000 USDG)</span>
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
