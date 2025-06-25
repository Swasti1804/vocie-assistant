// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Gavel, Mic, TrendingUp, Users } from 'lucide-react';
import AuctionDashboard from './components/AuctionDashboard';
import VoiceAgent from './components/VoiceAgent';
import StatsPanel from './components/StatsPanel';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [auctionData, setAuctionData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => setConnectionStatus('connected');
    ws.onerror = () => setConnectionStatus('error');
    ws.onclose = () => setConnectionStatus('disconnected');
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'new-bid') {
        setAuctionData(prev => ({
          ...prev,
          products: prev.products.map(p => p.id === data.productId ? data.product : p),
          stats: data.stats
        }));
      } else if (data.type === 'timer-update') {
        setAuctionData(prev => ({ ...prev, products: data.products }));
      }
    };

    fetch('http://localhost:3001/api/auctions')
      .then(res => res.json())
      .then(data => setAuctionData(data))
      .catch(err => console.error('Failed to fetch:', err));

    return () => ws.close();
  }, []);

  const placeBid = async (productId, amount, bidder) => {
    const res = await fetch(`http://localhost:3001/api/auctions/${productId}/bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, bidder })
    });
    return await res.json();
  };

  if (!auctionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading auction data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 border-b border-white/10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Gavel className="text-yellow-400" />
          <h1 className="text-white text-xl font-bold">AuctionVoice Pro</h1>
        </div>
        <div className={`h-2 w-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}></div>
      </header>

      {/* Nav */}
      <nav className="bg-black/10 border-b border-white/10 flex justify-center gap-6 py-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
          { id: 'voice', label: 'Voice Agent', icon: Mic },
          { id: 'stats', label: 'Stats', icon: Users },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${
              activeTab === tab.id ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-white/70'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main */}
      <main className="p-4">
        {activeTab === 'dashboard' && <AuctionDashboard auctionData={auctionData} onPlaceBid={placeBid} />}
        {activeTab === 'voice' && auctionData?.products && <VoiceAgent auctionData={auctionData} />}
        {activeTab === 'stats' && <StatsPanel auctionData={auctionData} />}
      </main>
    </div>
  );
}

export default App;
