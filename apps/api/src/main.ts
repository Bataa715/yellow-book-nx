import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:9002',
    ],
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Error handling
app.use((err: any, req: any, res: any, _next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.warn(`🚀 API Server running on http://localhost:${PORT}`);
  console.warn(`📚 Yellow Books endpoint: http://localhost:${PORT}/api/yellow-books`);
});

export default app;
