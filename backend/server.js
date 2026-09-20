import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import analyzeRoutes from './routes/analyzeRoutes.js';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api', analyzeRoutes);
app.use('/', analyzeRoutes);

app.get('/', (req, res) => {
  res.json({
    name: 'NaukriShield API',
    status: 'running',
    endpoints: {
      analyze: 'POST /api/analyze',
      history: 'GET /api/history',
      stats: 'GET /api/stats',
      health: 'GET /api/health'
    }
  });
});

const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is currently occupied. Please stop existing process or specify another port.`);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer();

export default app;
