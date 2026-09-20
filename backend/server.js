import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import analyzeRoutes from './routes/analyzeRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
      process.exit(1);
    }
    console.error('Server error:', err);
  });
};

startServer();

export default app;
