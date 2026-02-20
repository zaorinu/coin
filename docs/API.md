# API Overview

Universal response format

All JSON responses follow this format:

- Success responses:

```
{ "success": true, "data": <resource>, "meta": <optional> }
```

- Error responses:

```
{ "success": false, "error": "Error message or object" }
```

Routes (summary)

- `POST /users` — Create a user
- `GET /users` — List users
- `GET /users/:id` — Get user
- `PUT /users/:id` — Update user
- `DELETE /users/:id` — Delete user
- `POST /users/:id/block` — Block user
- `GET /users/:id/balance` — Get user's balance
- `GET /users/:id/transactions` — List user's transactions

- `POST /transactions/transfer` — Transfer between users
- `POST /transactions/deposit` — Deposit to a user
- `POST /transactions/withdraw` — Withdraw from a user
- `GET /transactions` — List transactions

- `GET /visualization/audit` — Audit view
- `GET /visualization/totals/:userId` — Summary totals for a user

For a machine-readable spec, see `openapi.yaml` in this folder.
