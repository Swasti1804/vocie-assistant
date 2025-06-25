import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Volume2, MessageSquare, Send } from 'lucide-react';

const VoiceAgent = ({ auctionData }) => {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState([
    {
      type: 'agent',
      message: 'Hello! Welcome to AuctionVoice Pro. I can help you participate in live auctions using voice commands. You can ask me to list products, get product information, or place bids. How can I assist you today?',
      timestamp: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const conversationEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (type, message) => {
    setConversation(prev => [...prev, {
      type,
      message,
      timestamp: Date.now()
    }]);
  };

  const simulateVoiceCommand = async (command) => {
    const lowerCommand = command.toLowerCase();
    
    try {
      if (lowerCommand.includes('list') && (lowerCommand.includes('product') || lowerCommand.includes('item') || lowerCommand.includes('auction'))) {
        const response = await fetch('http://localhost:3001/api/voice/list-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        
        let productList = data.products.map((p, index) => {
          const hours = Math.floor(p.timeRemaining / 3600);
          const minutes = Math.floor((p.timeRemaining % 3600) / 60);
          const timeString = hours > 0 ? `${hours} hours ${minutes} minutes` : `${minutes} minutes`;
          return `${index + 1}. ${p.name} - Current bid: $${p.currentBid.toLocaleString()}, Time remaining: ${timeString}`;
        }).join('\n');
        
        addMessage('agent', `${data.response}\n\n${productList}\n\nWould you like more information about any specific item, or would you like to place a bid?`);
        
      } else if (lowerCommand.includes('information') || lowerCommand.includes('details') || lowerCommand.includes('tell me about')) {
        // Extract product reference (number or name)
        const productMatch = lowerCommand.match(/\b(\d+)\b/) || lowerCommand.match(/(rolex|picasso|ferrari)/i);
        
        if (productMatch) {
          let productId;
          if (productMatch[1] && !isNaN(productMatch[1])) {
            const productIndex = parseInt(productMatch[1]) - 1;
            productId = auctionData.products[productIndex]?.id;
          } else {
            const productName = productMatch[1] || productMatch[0];
            const product = auctionData.products.find(p => 
              p.name.toLowerCase().includes(productName.toLowerCase())
            );
            productId = product?.id;
          }
          
          if (productId) {
            const response = await fetch(`http://localhost:3001/api/voice/product-info/${productId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            addMessage('agent', data.response + '\n\nWould you like to place a bid on this item?');
          } else {
            addMessage('agent', 'I couldn\'t identify which product you\'re asking about. Please specify the product number (1, 2, or 3) or mention the product name.');
          }
        } else {
          addMessage('agent', 'Which product would you like information about? Please specify the product number or name.');
        }
        
      } else if (lowerCommand.includes('bid') || lowerCommand.includes('place')) {
        // Extract bid amount and product
        const amountMatch = lowerCommand.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
        const productMatch = lowerCommand.match(/\b(\d+)\b/) || lowerCommand.match(/(rolex|picasso|ferrari)/i);
        
        if (amountMatch && productMatch) {
          let productId;
          if (productMatch[1] && !isNaN(productMatch[1])) {
            const productIndex = parseInt(productMatch[1]) - 1;
            productId = auctionData.products[productIndex]?.id;
          } else {
            const productName = productMatch[1] || productMatch[0];
            const product = auctionData.products.find(p => 
              p.name.toLowerCase().includes(productName.toLowerCase())
            );
            productId = product?.id;
          }
          
          if (productId) {
            const amount = parseInt(amountMatch[1].replace(/,/g, ''));
            const response = await fetch(`http://localhost:3001/api/voice/place-bid/${productId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount, bidder: 'Voice Agent User' })
            });
            
            const data = await response.json();
            addMessage('agent', data.response);
          } else {
            addMessage('agent', 'I couldn\'t identify which product you want to bid on. Please specify the product number or name along with your bid amount.');
          }
        } else {
          addMessage('agent', 'To place a bid, please specify both the product (number or name) and the bid amount. For example: "Bid $20,000 on product 1" or "Place a bid of $50,000 on the Picasso"');
        }
        
      } else if (lowerCommand.includes('help') || lowerCommand === 'what can you do') {
        addMessage('agent', `I can help you with the following voice commands:

1. "List products" or "Show me auction items" - I'll list all available auction items
2. "Tell me about product [number]" or "Information about [product name]" - Get detailed information about a specific item
3. "Bid $[amount] on product [number]" or "Place a bid of $[amount] on [product name]" - Place a bid on an item

Examples:
• "List all products"
• "Tell me about product 1"
• "Bid $20,000 on the Rolex"
• "Place a bid of $50,000 on product 2"

What would you like to do?`);
        
      } else {
        addMessage('agent', `I didn't understand that command. I can help you with:
• Listing auction products
• Getting product information
• Placing bids

Try saying something like "list products", "tell me about product 1", or "bid $20,000 on the Rolex". You can also type "help" for more details.`);
      }
    } catch (error) {
      addMessage('agent', 'I apologize, but I encountered an error processing your request. Please try again.');
      console.error('Voice command error:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    addMessage('user', inputMessage);
    const command = inputMessage;
    setInputMessage('');
    
    // Simulate processing delay
    setTimeout(() => {
      simulateVoiceCommand(command);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      addMessage('system', 'Connected to voice agent');
    } else {
      addMessage('system', 'Disconnected from voice agent');
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (!isConnected) {
      addMessage('system', 'Please connect to the voice agent first');
      return;
    }
    
    setIsListening(!isListening);
    if (!isListening) {
      addMessage('system', 'Voice recognition activated - speak now');
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        addMessage('system', 'Voice recognition stopped');
      }, 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Connection Status */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${isConnected ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
              {isConnected ? <Phone className="h-6 w-6 text-green-400" /> : <PhoneOff className="h-6 w-6 text-gray-400" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Voice Agent Status</h3>
              <p className={`text-sm ${isConnected ? 'text-green-400' : 'text-gray-400'}`}>
                {isConnected ? 'Connected and ready' : 'Disconnected'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleListening}
              disabled={!isConnected}
              className={`p-3 rounded-full transition-all duration-200 ${
                isListening 
                  ? 'bg-red-500/20 text-red-400 animate-pulse' 
                  : isConnected 
                    ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                    : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>
            
            <button
              onClick={toggleConnection}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isConnected
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                  : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
              }`}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 h-96 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Voice Conversation
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.type === 'system'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-white/10 text-white border border-white/20'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={conversationEndRef} />
        </div>
        
        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or voice command..."
              className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Voice Commands Help */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Volume2 className="h-5 w-5 mr-2" />
          Voice Commands
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-white mb-2">Product Information</h4>
            <ul className="space-y-1 text-white/70">
              <li>• "List products" or "Show auction items"</li>
              <li>• "Tell me about product 1"</li>
              <li>• "Information about the Rolex"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Bidding Commands</h4>
            <ul className="space-y-1 text-white/70">
              <li>• "Bid $20,000 on product 1"</li>
              <li>• "Place a bid of $50,000 on the Picasso"</li>
              <li>• "I want to bid $2.5 million on the Ferrari"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgent;