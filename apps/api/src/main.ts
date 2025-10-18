import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Enhanced logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get('User-Agent') || 'Unknown';

  console.log(`\n🔵 [${timestamp}] ${method} ${url}`);
  console.log(`👤 User-Agent: ${userAgent.substring(0, 50)}...`);

  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📦 Request Body:`, JSON.stringify(req.body, null, 2));
  }

  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`🔍 Query Params:`, req.query);
  }

  // Log response
  const originalSend = res.send;
  res.send = function (body) {
    const statusCode = res.statusCode;
    const statusIcon = statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';

    console.log(`${statusIcon} [${timestamp}] Response ${statusCode} for ${method} ${url}`);

    if (body && typeof body === 'string') {
      try {
        const parsed = JSON.parse(body);
        if (parsed.data && Array.isArray(parsed.data)) {
          console.log(`📊 Returned ${parsed.data.length} items`);
        } else if (parsed.error) {
          console.log(`💥 Error: ${parsed.error}`);
        }
      } catch {
        console.log(`📄 Response length: ${body.length} characters`);
      }
    }

    console.log(`⏱️  Request completed in ${Date.now() - new Date(timestamp).getTime()}ms\n`);

    return originalSend.call(this, body);
  };

  next();
});

// CORS Middleware with proper OPTIONS handling
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:9002',
      'http://localhost:8000', // API Monitor Dashboard
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

// Handle preflight requests for all routes
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log(`🔵 [${new Date().toISOString()}] OPTIONS ${req.url}`);
    console.log(`👤 User-Agent: ${req.get('User-Agent')?.substring(0, 50) || 'Unknown'}...`);
    console.log(`✅ [${new Date().toISOString()}] Response 200 for OPTIONS ${req.url}`);
    console.log(`⏱️  Request completed in 0ms\n`);

    res.status(200).end();
  } else {
    next();
  }
});

app.use(express.json());

// Root route - API Dashboard
app.get('/', (req, res) => {
  res.json({
    name: 'Yellow Book API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      yellowBooks: '/api/yellow-books',
      categories: '/api/categories',
      search: '/api/yellow-books?search=keyword',
      businessDetails: '/api/yellow-books/:id',
    },
    documentation: 'Yellow Book API - Монголын бизнесийн лавлагаа',
    message: '🚀 API ажиллаж байна!',
  });
});

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
