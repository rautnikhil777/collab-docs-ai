const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { routes } = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS CONFIG (FIXED - PRODUCTION READY)
  const allowedOrigins = [
    "http://localhost:5173",
    "https://collab-docs-ai.vercel.app"
  ];

  app.use(
    cors({
      origin: function (origin, callback) {
        // allow Postman / server-to-server
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("CORS blocked: Not allowed origin"));
      },
      credentials: false
    })
  );

  // JSON parser
  app.use(express.json({ limit: '2mb' }));

  // Rate limiter
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200
    })
  );

  // Health check
  app.get('/health', (req, res) => {
    res.json({ ok: true, message: "Backend is running" });
  });

  // API routes
  app.use('/api', routes);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };