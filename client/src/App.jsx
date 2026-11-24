import { useCallback, useEffect, useState } from 'react';
import {
  createBook,
  deleteBook,
  getBooks,
  getStats,
  patchBook,
  replaceBook,
} from './api/books';
import StatsPanel from './components/StatsPanel';
import FilterBar from './components/FilterBar';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import './App.css';

const INITIAL_FILTERS = {
  q: '',
  genre: '',
  read: '',
  sort: '',
  order: 'asc',
};

export default function App() {
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState(null);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [editingBook, setEditingBook] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [busyBookId, setBusyBookId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBooks() {
      setBooksLoading(true);
      setBooksError(null);
      try {
        const params = {
          q: filters.q.trim(),
          genre: filters.genre,
          read: filters.read,
          sort: filters.sort,
          order: filters.sort ? filters.order : '',
        };
        const data = await getBooks(params, controller.signal);
        setBooks(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setBooksError(err.message || 'Failed to load books');
      } finally {
        if (!controller.signal.aborted) {
          setBooksLoading(false);
        }
      }
    }

    loadBooks();
    return () => controller.abort();
  }, [filters, reloadKey]);

  const loadStats = useCallback(async (signal) => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await getStats(signal);
      setStats(data);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setStatsError(err.message || 'Failed to load statistics');
    } finally {
      if (!signal?.aborted) {
        setStatsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadStats(controller.signal);
    return () => controller.abort();
  }, [loadStats, reloadKey]);

  function refreshAll() {
    setReloadKey((prev) => prev + 1);
  }

  function handleFilterChange(field, value) {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleResetFilters() {
    setFilters(INITIAL_FILTERS);
  }

  async function handleFormSubmit(payload) {
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingBook) {
        await replaceBook(editingBook.id, payload);
        setEditingBook(null);
      } else {
        await createBook(payload);
      }
      refreshAll();
      return true;
    } catch (err) {
      setFormError(err.message || 'Failed to save book');
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancelEdit() {
    setEditingBook(null);
    setFormError(null);
  }

  function handleStartEdit(book) {
    setEditingBook(book);
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleToggleRead(book) {
    setBusyBookId(book.id);
    setBooksError(null);
    try {
      const nextRead = !book.read;
      const patch = nextRead ? { read: true } : { read: false, rating: null };
      await patchBook(book.id, patch);
      refreshAll();
    } catch (err) {
      setBooksError(err.message || 'Failed to update read status');
    } finally {
      setBusyBookId(null);
    }
  }

  async function handleRate(book, rating) {
    setBusyBookId(book.id);
    setBooksError(null);
    try {
      await patchBook(book.id, { rating });
      refreshAll();
    } catch (err) {
      setBooksError(err.message || 'Failed to update rating');
    } finally {
      setBusyBookId(null);
    }
  }

  async function handleDelete(book) {
    setBusyBookId(book.id);
    setBooksError(null);
    try {
      await deleteBook(book.id);
      if (editingBook && editingBook.id === book.id) {
        setEditingBook(null);
        setFormError(null);
      }
      refreshAll();
    } catch (err) {
      setBooksError(err.message || 'Failed to delete book');
    } finally {
      setBusyBookId(null);
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Reading List</h1>
        <p className="subtitle">Manage your books, reading progress, and ratings</p>
      </header>

      <main className="app-main">
        <StatsPanel stats={stats} loading={statsLoading} error={statsError} />

        <BookForm
          key={editingBook ? `edit-${editingBook.id}` : 'new-book'}
          editingBook={editingBook}
          onSubmit={handleFormSubmit}
          onCancelEdit={handleCancelEdit}
          submitting={submitting}
          error={formError}
        />

        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <BookList
          books={books}
          loading={booksLoading}
          error={booksError}
          busyBookId={busyBookId}
          onRetry={refreshAll}
          onToggleRead={handleToggleRead}
          onRate={handleRate}
          onEdit={handleStartEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}