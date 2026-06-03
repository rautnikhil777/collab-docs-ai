const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { routes } = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || true,
      credentials: false
    })
  );

  app.use(express.json({ limit: '2mb' }));

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200
    })
  );

  app.get('/health', (req, res) => {
    res.json({ ok: true });
  });

  app.use('/api', routes);

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

