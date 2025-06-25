// src/components/VoiceAgent.tsx
import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Phone, PhoneOff, Volume2, MessageSquare, Send } from 'lucide-react';

const VoiceAgent = ({ auctionData }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [conversation, setConversation] = useState([
    {
      type: 'agent',
      message: 'Hello! Welcome to AuctionVoice Pro. You can ask me to list products, get product info, or place a bid. How can I assist you?',
      timestamp: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const conversationEndRef = useRef(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (type, message) => {
    setConversation(prev => [...prev, { type, message, timestamp: Date.now() }]);
  };

  const simulateVoiceCommand = async (command) => {
    const lowerCommand = command.toLowerCase();
    try {
      if (lowerCommand.includes('list')) {
        const res = await fetch('http://localhost:3001/api/voice/list-products', { method: 'POST' });
        const data = await res.json();
        const list = data.products.map((p, i) => `${i + 1}. ${p.name} - $${p.currentBid}`).join('\n');
        addMessage('agent', `${data.response}\n\n${list}`);
      } else if (lowerCommand.includes('tell me about') || lowerCommand.includes('information')) {
        const match = lowerCommand.match(/\b(\d+)\b/);
        const index = match ? parseInt(match[1]) - 1 : null;
        const id = index !== null ? auctionData.products[index]?.id : null;
        if (id) {
          const res = await fetch(`http://localhost:3001/api/voice/product-info/${id}`, { method: 'POST' });
          const data = await res.json();
          addMessage('agent', data.response);
        } else {
          addMessage('agent', 'Please specify a valid product number or name.');
        }
      } else if (lowerCommand.includes('bid')) {
        const amountMatch = lowerCommand.match(/\$?(\d+(,\d{3})*(\.\d{2})?)/);
        const productMatch = lowerCommand.match(/\b(\d+)\b/);
        const index = productMatch ? parseInt(productMatch[1]) - 1 : null;
        const id = index !== null ? auctionData.products[index]?.id : null;
        const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, '')) : null;

        if (id && amount) {
          const res = await fetch(`http://localhost:3001/api/voice/place-bid/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, bidder: 'Voice Agent User' })
          });
          const data = await res.json();
          addMessage('agent', data.response);
        } else {
          addMessage('agent', 'Could not extract bid amount or product. Please try again.');
        }
      } else {
        addMessage('agent', 'I didn’t understand. Try saying "list products", "tell me about product 2", or "bid $10000 on product 1".');
      }
    } catch (err) {
      console.error(err);
      addMessage('agent', 'An error occurred while processing your request.');
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    addMessage('user', inputMessage);
    simulateVoiceCommand(inputMessage);
    setInputMessage('');
  };

  const handleVoice = () => {
    if (!isConnected) return;
    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      addMessage('system', 'Voice recognition started. Speak now.');
    } else {
      SpeechRecognition.stopListening();
      addMessage('user', transcript);
      simulateVoiceCommand(transcript);
      resetTranscript();
    }
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    addMessage('system', isConnected ? 'Disconnected from voice agent' : 'Connected to voice agent');
  };

  if (!browserSupportsSpeechRecognition) {
    return <p className="text-white">Your browser doesn’t support speech recognition.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${isConnected ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
              {isConnected ? <Phone className="text-green-400" /> : <PhoneOff className="text-gray-400" />}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Voice Agent Status</h2>
              <p className={`text-sm ${isConnected ? 'text-green-400' : 'text-gray-400'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleVoice} disabled={!isConnected} className={`p-3 rounded-full ${listening ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {listening ? <MicOff /> : <Mic />}
            </button>
            <button onClick={toggleConnection} className="px-4 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-400/30 rounded-lg">
              {isConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="bg-white/10 rounded-xl border border-white/20 h-96 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <MessageSquare className="mr-2" />
            Voice Conversation
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-lg max-w-md ${msg.type === 'user' ? 'bg-blue-500 text-white' : msg.type === 'system' ? 'bg-yellow-200 text-yellow-900' : 'bg-white/10 text-white border border-white/20'}`}>
                <p className="text-sm whitespace-pre-line">{msg.message}</p>
                <p className="text-xs opacity-50">{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          <div ref={conversationEndRef} />
        </div>
        <div className="p-4 border-t border-white/10 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type or speak a command..."
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none"
          />
          <button onClick={handleSendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgent;
