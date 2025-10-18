// Environment variables configuration
export const env = {
  NODE_ENV: process.env['NODE_ENV'] || 'development',
  PORT: parseInt(process.env['PORT'] || '3001', 10),
  DATABASE_URL: process.env['DATABASE_URL'] || 'file:./dev.db',
  CORS_ORIGIN: process.env['CORS_ORIGIN'] || 'http://localhost:9002',
  JWT_SECRET: process.env['JWT_SECRET'] || 'your-secret-key',
  REVALIDATE_SECRET: process.env['REVALIDATE_SECRET'] || 'your-revalidate-secret',
} as const;

// API Configuration
export const apiConfig = {
  baseUrl: process.env['API_BASE_URL'] || 'http://localhost:3001',
  endpoints: {
    yellowBooks: '/api/yellow-books',
    categories: '/api/categories',
    reviews: '/api/reviews',
    revalidate: '/api/revalidate',
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  cache: {
    revalidate: 60, // ISR cache duration in seconds
    staticRevalidate: 3600, // SSG cache duration in seconds
  },
} as const;

// Database Configuration
export const dbConfig = {
  url: env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
} as const;

// CORS Configuration
export const corsConfig = {
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
} as const;

// Validation Configuration
export const validationConfig = {
  skipInputValidation: false,
  skipOutputValidation: env.NODE_ENV === 'production',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
} as const;

// Logging Configuration
export const logConfig = {
  level: env.NODE_ENV === 'production' ? 'error' : 'debug',
  format: env.NODE_ENV === 'production' ? 'json' : 'dev',
} as const;

// Features flags
export const features = {
  enableReviews: true,
  enableImageUpload: false,
  enableGoogleMaps: true,
  enableLeafletMaps: true,
  enableAnalytics: false,
} as const;