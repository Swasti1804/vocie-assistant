import React, { useState, useEffect } from 'react';
import { Gavel, Mic, Phone, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import AuctionDashboard from './components/AuctionDashboard';
import VoiceAgent from './components/VoiceAgent';
import StatsPanel from './components/StatsPanel';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [auctionData, setAuctionData] = useState(null);
  const [ws, setWs] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    // Initialize WebSocket connection
    const websocket = new WebSocket('ws://localhost:3001');
    
    websocket.onopen = () => {
      console.log('Connected to WebSocket');
      setConnectionStatus('connected');
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleRealtimeUpdate(data);
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
      setConnectionStatus('disconnected');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };

    // Fetch initial data
    fetchAuctionData();

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const fetchAuctionData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auctions');
      const data = await response.json();
      setAuctionData(data);
    } catch (error) {
      console.error('Failed to fetch auction data:', error);
    }
  };

  const handleRealtimeUpdate = (data) => {
    if (data.type === 'new-bid') {
      setAuctionData(prev => ({
        ...prev,
        products: prev.products.map(product => 
          product.id === data.productId ? data.product : product
        ),
        stats: data.stats
      }));
    } else if (data.type === 'timer-update') {
      setAuctionData(prev => ({
        ...prev,
        products: data.products
      }));
    }
  };

  const placeBid = async (productId, amount, bidder) => {
    try {
      const response = await fetch(`http://localhost:3001/api/auctions/${productId}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, bidder }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  if (!auctionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading auction data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Gavel className="h-8 w-8 text-yellow-400" />
              <h1 className="text-2xl font-bold text-white">AuctionVoice Pro</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-400' : 
                connectionStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
              <span className="text-white text-sm capitalize">{connectionStatus}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black/10 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Auction Dashboard', icon: TrendingUp },
              { id: 'voice', label: 'Voice Agent', icon: Mic },
              { id: 'stats', label: 'Statistics', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <AuctionDashboard 
            auctionData={auctionData} 
            onPlaceBid={placeBid}
          />
        )}
        {activeTab === 'voice' && (
          <VoiceAgent 
            auctionData={auctionData}
          />
        )}
        {activeTab === 'stats' && (
          <StatsPanel 
            auctionData={auctionData}
          />
        )}
      </main>
    </div>
  );
}

export default App;