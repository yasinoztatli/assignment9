# Reading List — Full-Stack App (Express 5 + React)

A full-stack Reading List application built with an Express 5 REST API backend and a React (Vite) frontend.

## Tech Stack

- **Backend:** Node.js, Express 5, `cors` (restricted to `CLIENT_ORIGIN`), in-memory async immutable store
- **Frontend:** React, Vite, native Fetch API (`URLSearchParams`, `AbortController`)

## Project Structure

```text
assignment9/
├── server/
│   ├── package.json
│   ├── server.js
│   ├── booksStore.js
│   └── validate.js
├── client/
│   ├── .env.example
│   ├── index.html
│   └── src/
│       ├── api/books.js
│       ├── components/
│       │   ├── StatsPanel.jsx
│       │   ├── FilterBar.jsx
│       │   ├── BookForm.jsx
│       │   └── BookList.jsx
│       ├── App.jsx
│       ├── App.css
│       └── index.css
├── .gitignore
└── README.md


## API Verification (`curl` Tests)

All endpoints, status codes, validation rules, error handling, and CORS preflight headers were verified against `http://localhost:3000`:

```bash
# 200 OK — List books
curl -i http://localhost:3000/api/books

# 201 Created — Create book (returns Location: /api/books/7)
curl -i -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Foundation","author":"Isaac Asimov","year":1951,"genre":"science","read":true,"rating":5}'

# 409 Conflict — Duplicate title + author
curl -i -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Foundation","author":"Isaac Asimov","year":1951,"genre":"science","read":true,"rating":5}'

# 400 Bad Request — Validation rule (rating requires read: true)
curl -i -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","author":"Tester","year":2020,"genre":"other","read":false,"rating":4}'

# 400 Bad Request — Malformed JSON handled as JSON (not HTML)
curl -i -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{broken'

# 404 Not Found — Missing resource & unknown API route
curl -i http://localhost:3000/api/books/999
curl -i http://localhost:3000/api/unknown

# 200 OK — Partial update (PATCH) & 204 No Content — Delete (DELETE)
curl -i -X PATCH http://localhost:3000/api/books/7 \
  -H "Content-Type: application/json" \
  -d '{"rating":4}'
curl -i -X DELETE http://localhost:3000/api/books/7

# 500 Internal Server Error — Async throw caught by Express 5 error middleware
curl -i http://localhost:3000/api/crash

# 204 No Content — CORS preflight (returns Access-Control-Allow-Origin: http://localhost:5173)
curl -i -X OPTIONS http://localhost:3000/api/books \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

### Verified Status Codes Summary

- `200 OK`: `GET /api/books`, `GET /api/books/:id`, `GET /api/stats`, `PUT /api/books/:id`, `PATCH /api/books/:id`
- `201 Created`: `POST /api/books` with `Location` header
- `204 No Content`: `DELETE /api/books/:id` (empty body) and CORS `OPTIONS` preflight
- `400 Bad Request`: Invalid IDs, invalid query parameters, invalid book payloads, and malformed JSON bodies
- `404 Not Found`: Non-existent book IDs and unmatched `/api/*` routes
- `409 Conflict`: Case-insensitive duplicate `title` + `author` on create or update
- `500 Internal Server Error`: Unhandled async errors (`/api/crash`) returning `{ "error": "Something went wrong" }`