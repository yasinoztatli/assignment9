import { useState } from 'react';

const GENRES = [
  'fiction',
  'non-fiction',
  'science',
  'history',
  'fantasy',
  'other',
];

export default function BookForm({
  editingBook,
  onSubmit,
  onCancelEdit,
  submitting,
  error,
}) {
  const [title, setTitle] = useState(editingBook ? editingBook.title : '');
  const [author, setAuthor] = useState(editingBook ? editingBook.author : '');
  const [year, setYear] = useState(
    editingBook ? String(editingBook.year) : ''
  );
  const [genre, setGenre] = useState(
    editingBook ? editingBook.genre : 'fiction'
  );
  const [read, setRead] = useState(
    editingBook ? Boolean(editingBook.read) : false
  );
  const [rating, setRating] = useState(
    editingBook && editingBook.rating !== null ? String(editingBook.rating) : ''
  );

  function handleReadChange(checked) {
    setRead(checked);
    if (!checked) {
      setRating('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const parsedYear = year.trim() === '' ? null : Number(year);
    const parsedRating = rating === '' ? null : Number(rating);

    const payload = {
      title,
      author,
      year: parsedYear,
      genre,
      read,
      rating: parsedRating,
    };

    const succeeded = await onSubmit(payload);
    if (succeeded && !editingBook) {
      setTitle('');
      setAuthor('');
      setYear('');
      setGenre('fiction');
      setRead(false);
      setRating('');
    }
  }

  return (
    <section className="panel form-panel">
      <h2>{editingBook ? `Edit Book #${editingBook.id}` : 'Add a New Book'}</h2>

      {error && (
        <p className="error-banner" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="book-form" noValidate>
        <div className="form-grid">
          <label className="field">
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Foundation"
              disabled={submitting}
            />
          </label>

          <label className="field">
            <span>Author</span>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Isaac Asimov"
              disabled={submitting}
            />
          </label>

          <label className="field">
            <span>Year</span>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 1951"
              disabled={submitting}
            />
          </label>

          <label className="field">
            <span>Genre</span>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              disabled={submitting}
            >
              {GENRES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="field checkbox-field">
            <input
              type="checkbox"
              checked={read}
              onChange={(e) => handleReadChange(e.target.checked)}
              disabled={submitting}
            />
            <span>Mark as read</span>
          </label>

          <label className="field">
            <span>Rating (only when read)</span>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              disabled={submitting || !read}
            >
              <option value="">No rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting
              ? 'Saving...'
              : editingBook
                ? 'Save Changes'
                : 'Add Book'}
          </button>

          {editingBook && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={submitting}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
}