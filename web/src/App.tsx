import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StockTickerBar } from './components/StockTickerBar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { LearnPage } from './pages/LearnPage';
import { ContractsPage } from './pages/ContractsPage';
import { ExitPage } from './pages/ExitPage';
import { INITIAL_STOCKS } from './data/protocol';
import { StockInfo, SessionKind } from './types';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [stocks, setStocks] = useState<StockInfo[]>(INITIAL_STOCKS);
  const [selectedStock, setSelectedStock] = useState<StockInfo>(INITIAL_STOCKS[0]);
  const [walletConnected, setWalletConnected] = useState<boolean>(true);
  const [session, setSession] = useState<SessionKind>('REGULAR');

  const handleConnectWallet = () => {
    setWalletConnected(!walletConnected);
  };

  return (
    <div className="min-h-screen bg-arcum-bg text-arcum-text flex flex-col font-sans selection:bg-arcum-gold/20 selection:text-arcum-gold">
      {/* Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
        walletConnected={walletConnected}
        onConnectWallet={handleConnectWallet}
        session={session}
      />

      {/* Live Underlying Stock Ticker Bar */}
      <StockTickerBar
        stocks={stocks}
        selectedStock={selectedStock}
        onSelectStock={setSelectedStock}
      />

      {/* Main Page Router */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <LandingPage
            onNavigate={setCurrentRoute}
            stocks={stocks}
            onSelectStock={setSelectedStock}
          />
        )}

        {currentRoute === 'dashboard' && (
          <DashboardPage
            stocks={stocks}
            selectedStock={selectedStock}
            onSelectStock={setSelectedStock}
            walletConnected={walletConnected}
            onConnectWallet={handleConnectWallet}
          />
        )}

        {(currentRoute === 'products' || currentRoute === 'markets' || currentRoute === 'protocol' || currentRoute === 'costs' || currentRoute === 'writers') && (
          <ProductsPage onNavigate={setCurrentRoute} />
        )}

        {currentRoute === 'learn' && <LearnPage />}

        {currentRoute === 'contracts' && <ContractsPage />}

        {currentRoute === 'exit' && <ExitPage />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={setCurrentRoute} />
    </div>
  );
}

export default App;
