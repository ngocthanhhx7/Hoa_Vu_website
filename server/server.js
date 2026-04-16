const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

if (config.trustProxy !== false) {
  app.set('trust proxy', config.trustProxy);
}

const allowedOrigins = new Set(config.corsOrigins);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { success: false, message: 'Quá nhiều yêu cầu, vui lòng thử lại sau' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'HOA VU API is running', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = config.port;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 HOA VU Server running on port ${PORT} in ${config.nodeEnv} mode`);
    console.log(`🌐 Allowed CORS origins: ${config.corsOrigins.join(', ')}`);
    console.log(`🗂️ Upload provider: ${config.uploadProvider}${config.uploadProvider === 's3' ? ` (${config.aws.bucket || 'missing-bucket'})` : ''}`);
    console.log(`🚦 Rate limit: ${config.rateLimit.max} requests / ${config.rateLimit.windowMs}ms`);
    console.log(`🛡️ Trust proxy: ${String(config.trustProxy)}`);
  });
};

startServer();

module.exports = app;
