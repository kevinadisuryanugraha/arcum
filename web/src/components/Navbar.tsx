import React, { useState } from 'react';
import { Shield, Wallet, ExternalLink, ChevronDown } from 'lucide-react';
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
  const [networkMode, setNetworkMode] = useState<'mainnet' | 'testnet'>('mainnet');

  const navLinks = [
    { id: 'dashboard', label: 'Swap' },
    { id: 'markets', label: 'Pools' },
    { id: 'positions', label: 'Positions' },
    { id: 'products', label: 'Shield' },
    { id: 'writers', label: 'Writer Pool' },
    { id: 'protocol', label: 'Analytics' },
    { id: 'docs', label: 'Docs' },
    { id: 'contracts', label: 'Contracts' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-arcum-bg/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand Group */}
        <div className="flex items-center gap-7">
          <button
            onClick={() => onNavigate('home')}
            className="group flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
            aria-label="Arcum home"
          >
            {/* Asterra-style Rotating Mark */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-arcum-cyan via-arcum-cobalt to-arcum-violet p-[1.5px] transition-transform duration-500 ease-out group-hover:rotate-90 shadow-[0_0_16px_rgba(25,230,255,0.4)]">
              <div className="w-full h-full bg-arcum-bg rounded-[6px] flex items-center justify-center font-display font-black text-arcum-cyan text-xs">
                A
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-semibold text-white tracking-tight text-sm">
                Arcum
              </span>
              <span className="text-[10px] font-mono text-arcum-cyan px-1.5 py-0.5 rounded bg-arcum-cyan/10 border border-arcum-cyan/30">
                4663
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links (exact AsterraPools styling) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                currentRoute === link.id ||
                (link.id === 'dashboard' && currentRoute === 'dashboard') ||
                (link.id === 'positions' && currentRoute === 'dashboard');
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id === 'positions' ? 'dashboard' : link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'text-white bg-white/[0.08] shadow-sm'
                      : 'text-arcum-muted hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Status & Actions */}
        <div className="flex items-center gap-3">
          {/* Network Switcher: Testnet / Mainnet */}
          <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-arcum-surface border border-white/[0.08] text-[11px] font-mono">
            <button
              onClick={() => setNetworkMode('testnet')}
              className={`px-2 py-1 rounded-md transition-all ${
                networkMode === 'testnet'
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-arcum-muted hover:text-white'
              }`}
            >
              Testnet
            </button>
            <button
              onClick={() => setNetworkMode('mainnet')}
              className={`px-2 py-1 rounded-md transition-all ${
                networkMode === 'mainnet'
                  ? 'bg-arcum-cyan/20 text-arcum-cyan font-semibold border border-arcum-cyan/30'
                  : 'text-arcum-muted hover:text-white'
              }`}
            >
              Mainnet
            </button>
          </div>

          {/* Robinhood Chain Status */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-arcum-surface/80 text-[11px] font-mono text-arcum-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-arcum-cyan animate-pulse" />
            <span>Robinhood Chain</span>
          </div>

          {/* Connect / Wallet Button */}
          <button
            onClick={onConnectWallet}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-arcum-cyan to-arcum-cobalt text-black font-semibold text-xs hover:opacity-95 transition-all shadow-[0_0_20px_rgba(25,230,255,0.3)] active:scale-95"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>{walletConnected ? '0x71C8...a49B' : 'Connect'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
