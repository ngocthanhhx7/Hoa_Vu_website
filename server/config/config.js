const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const rawCorsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174';
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
const awsRegion = process.env.AWS_REGION || '';
const awsS3Bucket = process.env.AWS_S3_BUCKET || '';
const requestedUploadProvider = (process.env.UPLOAD_PROVIDER || '').trim().toLowerCase();
const isS3Configured = Boolean(awsAccessKeyId && awsSecretAccessKey && awsRegion && awsS3Bucket);
const uploadProvider = requestedUploadProvider || (isS3Configured ? 's3' : 'local');

function parseInteger(value, fallback) {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseTrustProxy(value) {
  if (value === undefined || value === null || value === '') {
    return false;
  }

  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;

  const parsed = parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : normalized;
}

module.exports = {
  port: parseInteger(process.env.PORT, 9999),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hoavu_platform',
  jwtSecret: process.env.JWT_SECRET || 'hoavu_dev_secret_2024',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite-preview',
  geminiApiBaseUrl: process.env.GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
  geminiTimeoutMs: parseInteger(process.env.GEMINI_TIMEOUT_MS, 15000),
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  uploadProvider,
  maxFileSize: parseInteger(process.env.MAX_FILE_SIZE, 5 * 1024 * 1024),
  corsOrigins: rawCorsOrigin.split(',').map((origin) => origin.trim()).filter(Boolean),
  nodeEnv: process.env.NODE_ENV || 'development',
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
  rateLimit: {
    windowMs: parseInteger(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    max: parseInteger(process.env.RATE_LIMIT_MAX, 100),
  },
  aws: {
    region: awsRegion,
    bucket: awsS3Bucket,
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
    publicBaseUrl: process.env.AWS_S3_PUBLIC_BASE_URL || '',
    endpoint: process.env.AWS_S3_ENDPOINT || '',
    isConfigured: isS3Configured,
  },
};
