import React from 'react';
import { TrendingUp, Users, DollarSign, History, Clock, Award } from 'lucide-react';

const StatsPanel = ({ auctionData }) => {
  const topBidders = () => {
    const bidderStats = {};
    
    auctionData.products.forEach(product => {
      product.bidHistory.forEach(bid => {
        if (!bidderStats[bid.bidder]) {
          bidderStats[bid.bidder] = {
            name: bid.bidder,
            totalBids: 0,
            totalAmount: 0,
            highestBid: 0
          };
        }
        bidderStats[bid.bidder].totalBids++;
        bidderStats[bid.bidder].totalAmount += bid.amount;
        bidderStats[bid.bidder].highestBid = Math.max(bidderStats[bid.bidder].highestBid, bid.amount);
      });
    });
    
    return Object.values(bidderStats)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);
  };

  const recentActivity = () => {
    const allBids = [];
    auctionData.products.forEach(product => {
      product.bidHistory.forEach(bid => {
        allBids.push({
          ...bid,
          productName: product.name
        });
      });
    });
    
    return allBids
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  };

  const averageBidAmount = () => {
    const allBids = [];
    auctionData.products.forEach(product => {
      allBids.push(...product.bidHistory);
    });
    
    if (allBids.length === 0) return 0;
    return allBids.reduce((sum, bid) => sum + bid.amount, 0) / allBids.length;
  };

  const timeToEnd = () => {
    return Math.min(...auctionData.products.map(p => p.timeRemaining));
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500/20">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Total Value</p>
              <p className="text-2xl font-bold text-white">
                ${auctionData.stats.totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500/20">
              <History className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Total Bids</p>
              <p className="text-2xl font-bold text-white">{auctionData.stats.totalBids}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500/20">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Active Bidders</p>
              <p className="text-2xl font-bold text-white">{auctionData.stats.activeBidders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500/20">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Next Ending</p>
              <p className="text-2xl font-bold text-white">{formatTime(timeToEnd())}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Bidders */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Award className="h-6 w-6 mr-2 text-yellow-400" />
            Top Bidders
          </h3>
          <div className="space-y-4">
            {topBidders().map((bidder, index) => (
              <div key={bidder.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                    index === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-white/10 text-white/70'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">{bidder.name}</p>
                    <p className="text-white/60 text-sm">{bidder.totalBids} bids</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${bidder.totalAmount.toLocaleString()}</p>
                  <p className="text-white/60 text-sm">total bid value</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-blue-400" />
            Recent Activity
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivity().map((bid, index) => (
              <div key={`${bid.id}-${index}`} className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
                <div>
                  <p className="text-white font-medium">{bid.bidder}</p>
                  <p className="text-white/60 text-sm truncate max-w-48">{bid.productName}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">${bid.amount.toLocaleString()}</p>
                  <p className="text-white/60 text-xs">
                    {new Date(bid.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Product Performance</h3>
        <div className="space-y-6">
          {auctionData.products.map((product) => {
            const bidIncrease = product.currentBid - product.startingBid;
            const increasePercentage = ((bidIncrease / product.startingBid) * 100).toFixed(1);
            
            return (
              <div key={product.id} className="border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">{product.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.timeRemaining > 3600 
                      ? 'bg-green-500/20 text-green-400' 
                      : product.timeRemaining > 600 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {formatTime(product.timeRemaining)} remaining
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-white/60 text-sm">Starting Bid</p>
                    <p className="text-white font-bold">${product.startingBid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Current Bid</p>
                    <p className="text-yellow-400 font-bold">${product.currentBid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Total Bids</p>
                    <p className="text-white font-bold">{product.bidHistory.length}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Increase</p>
                    <p className="text-green-400 font-bold">+{increasePercentage}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
          <p className="text-white/70 text-sm mb-2">Average Bid Amount</p>
          <p className="text-2xl font-bold text-white">${averageBidAmount().toLocaleString()}</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
          <p className="text-white/70 text-sm mb-2">Highest Single Bid</p>
          <p className="text-2xl font-bold text-white">
            ${Math.max(...auctionData.products.map(p => p.currentBid)).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
          <p className="text-white/70 text-sm mb-2">Active Auctions</p>
          <p className="text-2xl font-bold text-white">
            {auctionData.products.filter(p => p.timeRemaining > 0).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;