import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// In-memory auction data store
let auctionData = {
  products: [
    {
      id: '1',
      name: 'Vintage Rolex Submariner',
      description: 'Rare 1960s Rolex Submariner in pristine condition',
      currentBid: 15000,
      startingBid: 10000,
      timeRemaining: 3600, // seconds
      bidHistory: [
        { id: uuidv4(), amount: 10000, bidder: 'Anonymous', timestamp: Date.now() - 600000 },
        { id: uuidv4(), amount: 12000, bidder: 'Collector123', timestamp: Date.now() - 300000 },
        { id: uuidv4(), amount: 15000, bidder: 'WatchLover', timestamp: Date.now() - 60000 }
      ],
      imageUrl: 'https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      name: 'Original Picasso Sketch',
      description: 'Authenticated Pablo Picasso pencil sketch from 1940s',
      currentBid: 45000,
      startingBid: 25000,
      timeRemaining: 7200,
      bidHistory: [
        { id: uuidv4(), amount: 25000, bidder: 'ArtDealer', timestamp: Date.now() - 900000 },
        { id: uuidv4(), amount: 35000, bidder: 'MuseumBuyer', timestamp: Date.now() - 400000 },
        { id: uuidv4(), amount: 45000, bidder: 'PrivateCollector', timestamp: Date.now() - 120000 }
      ],
      imageUrl: 'https://images.pexels.com/photos/1153213/pexels-photo-1153213.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      name: 'Classic Ferrari 250 GT',
      description: '1962 Ferrari 250 GT, fully restored, matching numbers',
      currentBid: 2500000,
      startingBid: 2000000,
      timeRemaining: 10800,
      bidHistory: [
        { id: uuidv4(), amount: 2000000, bidder: 'CarEnthusiast', timestamp: Date.now() - 1200000 },
        { id: uuidv4(), amount: 2300000, bidder: 'ClassicCarDealer', timestamp: Date.now() - 600000 },
        { id: uuidv4(), amount: 2500000, bidder: 'FerrariCollector', timestamp: Date.now() - 180000 }
      ],
      imageUrl: 'https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ],
  stats: {
    totalBids: 9,
    activeBidders: 8,
    totalValue: 2560000
  }
};

// WebSocket connections
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('New WebSocket connection');

  ws.on('close', () => {
    clients.delete(ws);
    console.log('WebSocket connection closed');
  });
});

function broadcastUpdate(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

setInterval(() => {
  let updated = false;
  auctionData.products.forEach(product => {
    if (product.timeRemaining > 0) {
      product.timeRemaining--;
      updated = true;
    }
  });

  if (updated) {
    broadcastUpdate({ type: 'timer-update', products: auctionData.products });
  }
}, 1000);

app.get('/api/auctions', (req, res) => {
  res.json(auctionData);
});

app.get('/api/auctions/:id', (req, res) => {
  const product = auctionData.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/auctions/:id/bid', (req, res) => {
  const { amount, bidder } = req.body;
  const productId = req.params.id;
  if (!amount || !bidder) return res.status(400).json({ error: 'Amount and bidder are required' });

  const product = auctionData.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (product.timeRemaining <= 0) return res.status(400).json({ error: 'Auction has ended' });
  if (amount <= product.currentBid) return res.status(400).json({ error: `Bid must be higher than current bid of $${product.currentBid.toLocaleString()}` });

  const newBid = {
    id: uuidv4(),
    amount: parseInt(amount),
    bidder,
    timestamp: Date.now()
  };

  product.bidHistory.push(newBid);
  product.currentBid = parseInt(amount);
  auctionData.stats.totalBids++;
  auctionData.stats.totalValue = auctionData.products.reduce((sum, p) => sum + p.currentBid, 0);

  broadcastUpdate({ type: 'new-bid', productId, product, stats: auctionData.stats });

  res.json({ success: true, bid: newBid, product });
});

app.post('/api/voice/list-products', (req, res) => {
  const products = auctionData.products.map(p => ({ id: p.id, name: p.name, currentBid: p.currentBid, timeRemaining: p.timeRemaining }));
  res.json({ response: `There are ${products.length} items currently available for auction.`, products });
});

app.post('/api/voice/product-info/:id', (req, res) => {
  const product = auctionData.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const hours = Math.floor(product.timeRemaining / 3600);
  const minutes = Math.floor((product.timeRemaining % 3600) / 60);
  const timeString = hours > 0 ? `${hours} hours and ${minutes} minutes` : `${minutes} minutes`;
  res.json({ response: `${product.name}: ${product.description}. Current highest bid is $${product.currentBid.toLocaleString()}. Time remaining: ${timeString}.`, product });
});

app.post('/api/voice/place-bid/:id', (req, res) => {
  const { amount, bidder = 'Voice User' } = req.body;
  const product = auctionData.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ response: 'Sorry, I could not find that product.', error: 'Product not found' });
  if (product.timeRemaining <= 0) return res.status(400).json({ response: 'Sorry, this auction has already ended.', error: 'Auction has ended' });
  if (amount <= product.currentBid) return res.status(400).json({ response: `Your bid of $${parseInt(amount).toLocaleString()} is too low. The current highest bid is $${product.currentBid.toLocaleString()}. Please bid higher.`, error: 'Bid too low' });

  const newBid = {
    id: uuidv4(),
    amount: parseInt(amount),
    bidder,
    timestamp: Date.now()
  };

  product.bidHistory.push(newBid);
  product.currentBid = parseInt(amount);
  auctionData.stats.totalBids++;
  auctionData.stats.totalValue = auctionData.products.reduce((sum, p) => sum + p.currentBid, 0);

  broadcastUpdate({ type: 'new-bid', productId: req.params.id, product, stats: auctionData.stats });

  res.json({ response: `Congratulations! Your bid of $${parseInt(amount).toLocaleString()} for ${product.name} has been placed successfully. You are now the highest bidder.`, success: true, bid: newBid, product });
});

// Omni voice agent integration route
app.post('/api/voice/query', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });
  try {
    const omniRes = await axios.post(
      'https://api.omni.chat/v1/query',
      { input: message, sessionId: 'auction-session' },
      { headers: { Authorization: `Bearer bYV5tHRXnjKGRoC0jfOfnCRLKAe1TgoV5XcUCU2vqt0`, 'Content-Type': 'application/json' } }
    );
    res.json({ response: omniRes.data.response });
  } catch (err) {
    console.error('Omni API Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch from Omni API' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Auction server running on port ${PORT}`);
  console.log(`📊 WebSocket server ready for real-time updates`);
});
