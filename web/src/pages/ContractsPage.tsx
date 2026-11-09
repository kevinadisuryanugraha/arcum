import React from 'react';
import { ExternalLink, CheckCircle2, ShieldCheck, Copy } from 'lucide-react';
import { CONTRACT_ADDRESSES, CHAIN_CONFIG } from '../data/protocol';

export const ContractsPage: React.FC = () => {
  const contracts = [
    {
      name: 'LemniscateEngine (Proxy)',
      address: CONTRACT_ADDRESSES.engineProxy,
      role: 'Core trading engine: quote, buy, sell, Shield, accrual, and queued sells',
      verified: true,
    },
    {
      name: 'WriterPool (Proxy)',
      address: CONTRACT_ADDRESSES.writerPoolProxy,
      role: 'USDG Writer Pool taking counterparty risk, spot hedges, and liability bounds',
      verified: true,
    },
    {
      name: 'AgentRouter',
      address: CONTRACT_ADDRESSES.agentRouter,
      role: 'Owner-controlled policy delegation router for AI agents and MCP tools',
      verified: true,
    },
    {
      name: 'Reserve (First Loss Vault)',
      address: CONTRACT_ADDRESSES.reserve,
      role: 'First-loss capital layer absorbing pool shortfalls',
      verified: true,
    },
    {
      name: 'FeeRouter',
      address: CONTRACT_ADDRESSES.feeRouter,
      role: 'Protocol fee distribution waterfall (80% workers, 10% treasury, 5% stakers, 5% burn)',
      verified: true,
    },
    {
      name: 'Timelock Controller',
      address: CONTRACT_ADDRESSES.timelock,
      role: '48-hour timelock on admin upgrades and parameter adjustments',
      verified: true,
    },
    {
      name: 'USDG Settlement Token',
      address: CHAIN_CONFIG.usdgAddress,
      role: 'Canonical 6-decimal settlement stablecoin on Robinhood Chain',
      verified: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Verified Smart Contracts</h1>
        <p className="text-sm text-arcum-muted">
          All contracts are deployed on <strong className="text-white">Robinhood Chain (Chain ID 4663)</strong> and verified on Sourcify under Solc 0.8.28 with Cancun EVM settings.
        </p>
      </div>

      <div className="bg-arcum-surface border border-arcum-border rounded-2xl overflow-hidden">
        <div className="divide-y divide-arcum-border font-mono text-xs">
          {contracts.map((c) => (
            <div key={c.address} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-arcum-card/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-sans text-sm">{c.name}</span>
                  {c.verified && (
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-arcum-up/10 text-arcum-up border border-arcum-up/30">
                      <CheckCircle2 className="w-3 h-3" /> Sourcify Verified
                    </span>
                  )}
                </div>
                <div className="text-xs text-arcum-muted font-sans">{c.role}</div>
                <div className="text-arcum-gold text-xs">{c.address}</div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://repo.sourcify.dev/4663/${c.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-arcum-card border border-arcum-border hover:border-arcum-gold text-white text-xs flex items-center gap-1 font-sans transition-colors"
                >
                  Sourcify <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`${CHAIN_CONFIG.blockExplorer}/address/${c.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-arcum-card border border-arcum-border hover:border-arcum-gold text-white text-xs flex items-center gap-1 font-sans transition-colors"
                >
                  Blockscout <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
