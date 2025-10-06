/**
 * Environment configuration
 */
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

/**
 * API configuration
 */
export const apiConfig = {
  port: process.env.API_PORT || 3001,
  host: process.env.API_HOST || 'localhost',
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:9002',
  ],
};

/**
 * Database configuration
 */
export const dbConfig = {
  url: process.env.DATABASE_URL || 'file:./dev.db',
};

/**
 * Web app configuration
 */
export const webConfig = {
  port: process.env.WEB_PORT || 3000,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
};

/**
 * Pagination defaults
 */
export const paginationConfig = {
  defaultLimit: 20,
  maxLimit: 100,
};

/**
 * Get configuration value with fallback
 */
export function getConfig<T>(key: string, fallback: T): T {
  const value = process.env[key];
  if (value === undefined) {
    return fallback;
  }
  return value as T;
}
