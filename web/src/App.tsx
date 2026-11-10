import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StockTickerBar } from './components/StockTickerBar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { LearnPage } from './pages/LearnPage';
import { ContractsPage } from './pages/ContractsPage';
import { DocsPage } from './pages/DocsPage';
import { ExitPage } from './pages/ExitPage';
import { INITIAL_STOCKS } from './data/protocol';
import { StockInfo, SessionKind } from './types';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [activeTab, setActiveTab] = useState<string>('trade');
  const [stocks, setStocks] = useState<StockInfo[]>(INITIAL_STOCKS);
  const [selectedStock, setSelectedStock] = useState<StockInfo>(INITIAL_STOCKS[0]);
  const [walletConnected, setWalletConnected] = useState<boolean>(true);
  const [session, setSession] = useState<SessionKind>('REGULAR');

  const handleNavigate = (route: string, tab?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab) {
      setActiveTab(tab);
      setCurrentRoute('dashboard');
    } else if (route === 'dashboard') {
      if (!tab) setActiveTab('trade');
      setCurrentRoute('dashboard');
    } else {
      setCurrentRoute(route);
    }
  };

  const handleSelectStock = (stock: StockInfo) => {
    setSelectedStock(stock);
  };

  const handleConnectWallet = () => {
    setWalletConnected(!walletConnected);
  };

  return (
    <div className="min-h-screen bg-arcum-bg text-arcum-text flex flex-col font-sans selection:bg-arcum-cyan/20 selection:text-arcum-cyan">
      {/* Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        walletConnected={walletConnected}
        onConnectWallet={handleConnectWallet}
        session={session}
      />

      {/* Live Underlying Stock Ticker Bar */}
      <StockTickerBar
        stocks={stocks}
        selectedStock={selectedStock}
        onSelectStock={handleSelectStock}
        onNavigate={handleNavigate}
      />

      {/* Main Page Router */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <LandingPage
            onNavigate={handleNavigate}
            stocks={stocks}
            onSelectStock={handleSelectStock}
          />
        )}

        {currentRoute === 'dashboard' && (
          <DashboardPage
            stocks={stocks}
            selectedStock={selectedStock}
            onSelectStock={handleSelectStock}
            walletConnected={walletConnected}
            onConnectWallet={handleConnectWallet}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'products' && (
          <ProductsPage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'learn' && <LearnPage />}

        {currentRoute === 'docs' && <DocsPage />}

        {currentRoute === 'contracts' && <ContractsPage />}

        {currentRoute === 'exit' && <ExitPage />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
