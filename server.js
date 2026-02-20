const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const db = require('./utils/database');

const universalResponse = require('./utils/universal-response');
const errorHandler = require('./utils/error-handler');

const IS_PROD = process.env.NODE_ENV === 'production';

// Basic hardening
app.use(helmet());
app.use(cors());

// Logging
app.use(morgan(IS_PROD ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Basic rate limiting for production
app.use(
    rateLimit({
        windowMs: IS_PROD ? 15 * 60 * 1000 : 60 * 1000, // 15m prod, 1m dev
        max: IS_PROD ? 200 : 1000,
    })
);

// Universal response wrapper for existing handlers
app.use(universalResponse);

// Routes
app.use('/users', require('./modules/users'));
app.use('/transactions', require('./modules/transactions'));
app.use('/visualization', require('./modules/visualization'));

// Serve docs (OpenAPI and human-friendly API.md)
app.use('/docs', express.static(path.join(__dirname, 'docs')));

// Lightweight debug endpoint (kept behind env check)
if (!IS_PROD) {
    app.get('/debug/db', (req, res) => {
        db.all(`SELECT * FROM users`, [], (err, users) => {
            if (err) return res.status(500).json({ error: err.message });
            db.all(`SELECT * FROM transactions`, [], (err2, txs) => {
                if (err2) return res.status(500).json({ error: err2.message });
                res.json({ users, transactions: txs });
            });
        });
    });
}

// Centralized error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));
