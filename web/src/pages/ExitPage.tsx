import React from 'react';
import { ShieldAlert, Download, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';
import { CONTRACT_ADDRESSES, CHAIN_CONFIG } from '../data/protocol';

export const ExitPage: React.FC = () => {
  const downloadStandaloneExitGuide = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Arcum Protocol — Standalone Independent Exit Guide</title>
  <style>
    body { font-family: monospace; background: #070B19; color: #F8FAFC; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #D4AF37; }
    .box { background: #0B132B; border: 1px solid #1E2A4A; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; }
    code { background: #101B3A; color: #10B981; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Arcum Protocol — Emergency Direct On-Chain Exit Guide</h1>
  <p>This document is self-contained and allows you to interact directly with your funds and positions on <strong>Robinhood Chain (Chain ID 4663)</strong> even if the Arcum web interface or API is offline.</p>
  
  <div class="box">
    <h3>1. Selling an Open Option Directly On-Chain</h3>
    <p>Target Contract (Engine): <code>${CONTRACT_ADDRESSES.engineProxy}</code></p>
    <p>Function: <code>sell(bytes32 id, uint128 tokens, uint128 minProceedsUsdg, uint64 deadline, address recipient)</code></p>
    <p><em>Note: Sells are NEVER blocked by administrative pauses. If market is in HALTED session, sell will queue and issue a withdrawal ticket.</em></p>
  </div>

  <div class="box">
    <h3>2. Writer Pool Withdrawal Queue</h3>
    <p>Target Contract (WriterPool): <code>${CONTRACT_ADDRESSES.writerPoolProxy}</code></p>
    <p>Step A (Request): <code>requestWithdrawal(uint256 shares)</code> — opens 72-hour notice ticket.</p>
    <p>Step B (Claim): <code>claimWithdrawal(uint256 ticketId)</code> — burns shares and pays USDG at claim-time valuation within 7-day window.</p>
  </div>

  <div class="box">
    <h3>3. Official Explorer & RPC</h3>
    <p>RPC: <code>${CHAIN_CONFIG.rpcUrl}</code></p>
    <p>Blockscout Explorer: <code>${CHAIN_CONFIG.blockExplorer}</code></p>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arcum-independent-exit-guide.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-8 space-y-4">
        <div className="flex items-center gap-3 text-amber-400">
          <ShieldAlert className="w-8 h-8 flex-shrink-0" />
          <h1 className="text-2xl font-bold text-white">Independent Direct Exit Guide (`/exit`)</h1>
        </div>
        <p className="text-sm text-arcum-muted leading-relaxed">
          Arcum is committed to true DeFi self-custody. Even if our website, hosting, or API servers experience total downtime, your assets and options remain accessible directly on Robinhood Chain mainnet (`4663`).
        </p>
        <div>
          <button
            onClick={downloadStandaloneExitGuide}
            className="px-6 py-3 rounded-xl bg-arcum-gold text-arcum-dark font-bold text-sm flex items-center gap-2 hover:opacity-95 shadow-md shadow-arcum-gold/15"
          >
            <Download className="w-4 h-4" /> Download Standalone Offline Exit Guide (HTML)
          </button>
        </div>
      </div>

      <div className="bg-arcum-surface border border-arcum-border rounded-xl p-6 space-y-6 font-mono text-xs">
        <h3 className="text-sm font-bold text-white">Command-Line Direct Execution via Cast (`foundry`)</h3>

        <div className="space-y-2">
          <div className="text-arcum-muted">1. Direct Option Sell via Engine:</div>
          <div className="bg-arcum-card p-3 rounded-lg border border-arcum-border text-arcum-up overflow-x-auto">
            cast send {CONTRACT_ADDRESSES.engineProxy} "sell(bytes32,uint128,uint128,uint64,address)" $SERIES_ID $TOKENS 0 9999999999 $YOUR_ADDRESS --rpc-url {CHAIN_CONFIG.rpcUrl} --private-key $KEY
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-arcum-muted">2. Direct Writer Pool Withdrawal Claim:</div>
          <div className="bg-arcum-card p-3 rounded-lg border border-arcum-border text-arcum-up overflow-x-auto">
            cast send {CONTRACT_ADDRESSES.writerPoolProxy} "claimWithdrawal(uint256)" $TICKET_ID --rpc-url {CHAIN_CONFIG.rpcUrl} --private-key $KEY
          </div>
        </div>
      </div>
    </div>
  );
};
