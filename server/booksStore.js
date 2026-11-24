const delay = (ms = 20) => new Promise((resolve) => setTimeout(resolve, ms));

let nextId = 7;

let books = [
  {
    id: 1,
    title: 'Dune',
    author: 'Frank Herbert',
    year: 1965,
    genre: 'fantasy',
    read: true,
    rating: 5,
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    year: 1949,
    genre: 'fiction',
    read: true,
    rating: 5,
  },
  {
    id: 3,
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    year: 2011,
    genre: 'history',
    read: true,
    rating: 4,
  },
  {
    id: 4,
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    year: 1988,
    genre: 'science',
    read: false,
    rating: null,
  },
  {
    id: 5,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    year: 1937,
    genre: 'fantasy',
    read: true,
    rating: 4,
  },
  {
    id: 6,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    genre: 'fiction',
    read: false,
    rating: null,
  },
];

function isSameBook(book, title, author) {
  return (
    book.title.toLowerCase() === title.toLowerCase() &&
    book.author.toLowerCase() === author.toLowerCase()
  );
}

export async function getBooks(options) {
  await delay();

  let result = books.map((book) => ({ ...book }));

  if (options.genre !== null) {
    result = result.filter((book) => book.genre === options.genre);
  }

  if (options.read !== null) {
    result = result.filter((book) => book.read === options.read);
  }

  if (options.q) {
    const query = options.q.toLowerCase();
    result = result.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }

  const direction = options.order === 'desc' ? -1 : 1;
  const sorted = [...result].sort((a, b) => {
    if (options.sort === 'rating') {
      if (a.rating === null && b.rating === null) {
        return a.id - b.id;
      }
      if (a.rating === null) {
        return 1;
      }
      if (b.rating === null) {
        return -1;
      }
      const diff = (a.rating - b.rating) * direction;
      return diff !== 0 ? diff : a.id - b.id;
    }

    if (options.sort === 'title' || options.sort === 'author') {
      const diff =
        a[options.sort].localeCompare(b[options.sort], undefined, {
          sensitivity: 'base',
        }) * direction;
      return diff !== 0 ? diff : a.id - b.id;
    }

    if (options.sort === 'year') {
      const diff = (a.year - b.year) * direction;
      return diff !== 0 ? diff : a.id - b.id;
    }

    return (a.id - b.id) * direction;
  });

  const start = (options.page - 1) * options.limit;
  return sorted.slice(start, start + options.limit);
}

export async function getBookById(id) {
  await delay();
  const found = books.find((book) => book.id === id);
  return found ? { ...found } : null;
}

export async function hasDuplicate(title, author, excludeId = null) {
  await delay();
  return books.some(
    (book) => book.id !== excludeId && isSameBook(book, title, author)
  );
}

export async function createBook(bookData) {
  await delay();
  const newBook = {
    id: nextId,
    ...bookData,
  };
  nextId += 1;
  books = [...books, newBook];
  return { ...newBook };
}

export async function replaceBook(id, bookData) {
  await delay();
  const exists = books.some((book) => book.id === id);
  if (!exists) {
    return null;
  }
  const updatedBook = {
    id,
    ...bookData,
  };
  books = books.map((book) => (book.id === id ? updatedBook : book));
  return { ...updatedBook };
}

export async function deleteBook(id) {
  await delay();
  const exists = books.some((book) => book.id === id);
  if (!exists) {
    return false;
  }
  books = books.filter((book) => book.id !== id);
  return true;
}

export async function getStats() {
  await delay();
  const total = books.length;
  const readCount = books.filter((book) => book.read).length;
  const unreadCount = total - readCount;

  const ratedBooks = books.filter((book) => book.rating !== null);
  const averageRating =
    ratedBooks.length === 0
      ? null
      : Number(
          (
            ratedBooks.reduce((sum, book) => sum + book.rating, 0) /
            ratedBooks.length
          ).toFixed(2)
        );

  const byGenre = {};
  for (const book of books) {
    byGenre[book.genre] = (byGenre[book.genre] || 0) + 1;
  }

  return {
    total,
    read: readCount,
    unread: unreadCount,
    averageRating,
    byGenre,
  };
}