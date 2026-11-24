import express from 'express';
import cors from 'cors';
import {
  getBooks,
  getBookById,
  hasDuplicate,
  createBook,
  replaceBook,
  deleteBook,
  getStats,
} from './booksStore.js';
import {
  parsePositiveInt,
  validateBookData,
  validatePatchData,
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

app.post('/api/books', async (req, res) => {
  const { error, value } = validateBookData(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const duplicate = await hasDuplicate(value.title, value.author);
  if (duplicate) {
    return res
      .status(409)
      .json({ error: 'A book with the same title and author already exists' });
  }

  const created = await createBook(value);
  return res.status(201).location(`/api/books/${created.id}`).json(created);
});

app.put('/api/books/:id', async (req, res) => {
  const id = parsePositiveInt(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Book id must be a positive integer' });
  }

  const existing = await getBookById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const { error, value } = validateBookData(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const duplicate = await hasDuplicate(value.title, value.author, id);
  if (duplicate) {
    return res
      .status(409)
      .json({ error: 'A book with the same title and author already exists' });
  }

  const updated = await replaceBook(id, value);
  return res.status(200).json(updated);
});

app.patch('/api/books/:id', async (req, res) => {
  const id = parsePositiveInt(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Book id must be a positive integer' });
  }

  const existing = await getBookById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const { error, value } = validatePatchData(existing, req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const duplicate = await hasDuplicate(value.title, value.author, id);
  if (duplicate) {
    return res
      .status(409)
      .json({ error: 'A book with the same title and author already exists' });
  }

  const updated = await replaceBook(id, value);
  return res.status(200).json(updated);
});

app.delete('/api/books/:id', async (req, res) => {
  const id = parsePositiveInt(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Book id must be a positive integer' });
  }

  const deleted = await deleteBook(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Book not found' });
  }

  return res.status(204).end();
});

app.get('/api/stats', async (req, res) => {
  const stats = await getStats();
  return res.status(200).json(stats);
});

app.get('/api/crash', async (req, res) => {
  throw new Error('Simulated async server error');
});

app.use('/api', (req, res) => {
  return res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON in request body' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});