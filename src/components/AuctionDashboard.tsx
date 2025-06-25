import React, { useState } from 'react';
import { Clock, DollarSign, User, History, AlertCircle } from 'lucide-react';
import BidModal from './BidModal';

const AuctionDashboard = ({ auctionData, onPlaceBid }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBidClick = (product) => {
    setSelectedProduct(product);
    setShowBidModal(true);
  };

  const handleBidSubmit = async (amount, bidder) => {
    try {
      await onPlaceBid(selectedProduct.id, amount, bidder);
      setShowBidModal(false);
      setSelectedProduct(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <User className="h-6 w-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Active Bidders</p>
              <p className="text-2xl font-bold text-white">{auctionData.stats.activeBidders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {auctionData.products.map((product) => (
          <div key={product.id} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.timeRemaining > 3600 
                    ? 'bg-green-500/80 text-white' 
                    : product.timeRemaining > 600 
                    ? 'bg-yellow-500/80 text-white' 
                    : 'bg-red-500/80 text-white'
                }`}>
                  <Clock className="inline h-3 w-3 mr-1" />
                  {formatTime(product.timeRemaining)}
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
              <p className="text-white/70 text-sm mb-4 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-white/70 text-sm">Current Bid</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    ${product.currentBid.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm">Bids</p>
                  <p className="text-xl font-semibold text-white">{product.bidHistory.length}</p>
                </div>
              </div>

              {product.timeRemaining > 0 ? (
                <button
                  onClick={() => handleBidClick(product)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Place Bid
                </button>
              ) : (
                <div className="w-full bg-red-500/20 border border-red-500/30 text-red-400 font-semibold py-3 px-4 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Auction Ended
                </div>
              )}

              {/* Recent Bids */}
              {product.bidHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/70 text-sm mb-2">Recent Bids</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {product.bidHistory.slice(-3).reverse().map((bid, index) => (
                      <div key={bid.id} className="flex justify-between items-center text-xs">
                        <span className="text-white/60">{bid.bidder}</span>
                        <span className="text-yellow-400 font-medium">
                          ${bid.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bid Modal */}
      {showBidModal && selectedProduct && (
        <BidModal
          product={selectedProduct}
          onClose={() => {
            setShowBidModal(false);
            setSelectedProduct(null);
          }}
          onSubmit={handleBidSubmit}
        />
      )}
    </div>
  );
};

export default AuctionDashboard;