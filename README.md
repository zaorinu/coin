# coin
Coin is a fictional banking system created to spend my time on something productive.

This repository provides a small API for user and transaction management. It includes a minimal SQLite-backed server and simple visualization endpoints.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Run in development mode (auto-reload):

```bash
npm run dev
```

3. Run in production mode:

```bash
npm start
# or
npm run start:prod
```

API docs

OpenAPI and a human-readable API summary are available at `/docs` once the server is running. For example: `http://localhost:3000/docs/API.md`.

Notes

- The server includes basic production hardening (Helmet, CORS, rate limiting, request logging).
- All JSON responses follow a universal format: `{ success: boolean, data?: any, error?: any }`.

Contributions are welcome via issues and pull requests.