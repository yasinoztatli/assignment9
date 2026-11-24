export default function BookList({
  books,
  loading,
  error,
  busyBookId,
  onRetry,
  onToggleRead,
  onRate,
  onEdit,
  onDelete,
}) {
  if (loading && books.length === 0) {
    return (
      <section className="panel list-panel">
        <h2>Books</h2>
        <p>Loading books...</p>
      </section>
    );
  }

  if (error && books.length === 0) {
    return (
      <section className="panel list-panel">
        <h2>Books</h2>
        <p className="error-text" role="alert">
          {error}
        </p>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="panel list-panel">
      <div className="list-header">
        <h2>Books ({books.length})</h2>
        {loading && <span className="subtle-text">Refreshing...</span>}
      </div>

      {error && (
        <p className="error-banner" role="alert">
          {error}
        </p>
      )}

      {books.length === 0 ? (
        <p className="empty-text">No books match your current criteria.</p>
      ) : (
        <ul className="book-list">
          {books.map((book) => {
            const isBusy = busyBookId === book.id;

            return (
              <li key={book.id} className="book-card">
                <div className="book-info">
                  <div className="book-title-row">
                    <h3>{book.title}</h3>
                    <span className={`badge ${book.read ? 'badge-read' : 'badge-unread'}`}>
                      {book.read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                  <p className="book-meta">
                    {book.author} &middot; {book.year} &middot; {book.genre}
                  </p>
                  <p className="book-rating">
                    Rating: {book.rating === null ? 'Not rated' : `${book.rating} / 5`}
                  </p>
                </div>

                <div className="book-actions">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => onToggleRead(book)}
                  >
                    {book.read ? 'Mark Unread' : 'Mark Read'}
                  </button>

                  <label className="rating-control">
                    <span className="sr-only">Rate {book.title}</span>
                    <select
                      value={book.rating === null ? '' : String(book.rating)}
                      disabled={isBusy || !book.read}
                      onChange={(e) => {
                        const value = e.target.value;
                        onRate(book, value === '' ? null : Number(value));
                      }}
                    >
                      <option value="">No rating</option>
                      <option value="1">1 ★</option>
                      <option value="2">2 ★</option>
                      <option value="3">3 ★</option>
                      <option value="4">4 ★</option>
                      <option value="5">5 ★</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => onEdit(book)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="danger-button"
                    disabled={isBusy}
                    onClick={() => onDelete(book)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}