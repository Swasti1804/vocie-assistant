import React, { useState } from 'react';
import { X, DollarSign, User, AlertTriangle } from 'lucide-react';

const BidModal = ({ product, onClose, onSubmit }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [bidderName, setBidderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const minBid = product.currentBid + 100; // Minimum increment of $100

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const amount = parseInt(bidAmount);
    
    if (amount <= product.currentBid) {
      setError(`Bid must be higher than current bid of $${product.currentBid.toLocaleString()}`);
      setIsSubmitting(false);
      return;
    }

    if (!bidderName.trim()) {
      setError('Please enter your name');
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(amount, bidderName.trim());
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Place Bid</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Info */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-2">{product.name}</h4>
            <p className="text-white/70 text-sm mb-4">
              Current highest bid: <span className="text-yellow-400 font-bold">
                ${product.currentBid.toLocaleString()}
              </span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-400 mr-2 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* Bid Amount */}
          <div>
            <label className="block text-white font-medium mb-2">
              Your Bid Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={minBid}
                step="100"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder={`Minimum: $${minBid.toLocaleString()}`}
                required
              />
            </div>
            <p className="text-white/60 text-xs mt-1">
              Minimum bid: ${minBid.toLocaleString()}
            </p>
          </div>

          {/* Bidder Name */}
          <div>
            <label className="block text-white font-medium mb-2">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                type="text"
                value={bidderName}
                onChange={(e) => setBidderName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidModal;