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