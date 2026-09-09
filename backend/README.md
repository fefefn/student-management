# Student Management System – Backend API

REST API for the Student Management System, built with **Node.js, Express 5, TypeScript, MongoDB (Mongoose), JWT and bcrypt**.

## Setup

```bash
cd backend
npm install
cp .env.example .env        # then edit .env (MONGODB_URI, JWT_SECRET)
npm run dev                 # http://localhost:5000
```

## Scripts

| Command             | What it does                                     |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Start with hot reload (tsx watch)                |
| `npm run build`     | Compile TypeScript to `dist/`                    |
| `npm start`         | Run the compiled server                          |
| `npm run typecheck` | Type-check without emitting                      |
| `npm run smoke`     | End-to-end API test against a running server     |

## Structure

```
src/
├── config/        env loading, MongoDB connection
├── controllers/   parse request → call service → send response
├── middleware/    JWT protect, body validation, request logger, error handler
├── models/        Mongoose schemas (User, Student, Course)
├── routes/        Express routers, mounted under /api
├── services/      business logic and database access
├── utils/         ApiError, response helpers, JWT helpers
├── validators/    Zod schemas for request bodies and query strings
├── types/         Express Request augmentation (req.user)
├── app.ts         Express app (middleware + routes)
└── server.ts      Entry point (connect DB, listen, graceful shutdown)
```

## Response format

```json
{ "success": true,  "message": "optional", "data": { } }
{ "success": true,  "data": [ ], "pagination": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 } }
{ "success": false, "message": "Validation failed", "errors": [{ "field": "email", "message": "..." }] }
```

See the root [README](../README.md) for the full endpoint list.
