import express from 'express';
import cors from 'cors';
import {
  getBooks,
  getBookById,
  getStats,
} from './booksStore.js';
import {
  parsePositiveInt,
  validateQueryOptions,
} from './validate.js';

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get('/api/books', async (req, res) => {
  const { error, value } = validateQueryOptions(req.query);
  if (error) {
    return res.status(400).json({ error });
  }

  const books = await getBooks(value);
  return res.status(200).json(books);
});

app.get('/api/books/:id', async (req, res) => {
  const id = parsePositiveInt(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Book id must be a positive integer' });
  }

  const book = await getBookById(id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  return res.status(200).json(book);
});

app.get('/api/stats', async (req, res) => {
  const stats = await getStats();
  return res.status(200).json(stats);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});