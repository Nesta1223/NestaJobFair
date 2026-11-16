# nesta — Online Job Fair Registration

Project #3 · 2110503 Software Development · 2026/1

Developed from Assignment 7.2.

## Run

1. Copy `config/config.env.example` to `config/config.env`.
2. Set `MONGO_URI` and a random `JWT_SECRET` (>=32 characters).
3. `npm ci`, then `npm start`.

API: `http://127.0.0.1:5000/api/v1`. Health check: `GET /health`.

## Routes

| Method | Path | Access / purpose |
|---|---|---|
| POST | `/auth/register` | name/tel/email/password; always user |
| POST | `/auth/login` | email/password |
| GET | `/auth/me` | Current authenticated account |
| GET | `/auth/logout` | Replace cookie; client discards Bearer token |
| GET | `/companies` | Company list (authenticated) |
| GET | `/companies/:id` | Company detail (authenticated) |

Hospital/Appointment files from Assignment 7.2 remain for comparison but are not mounted.
