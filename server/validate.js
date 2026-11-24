export const VALID_GENRES = [
  'fiction',
  'non-fiction',
  'science',
  'history',
  'fantasy',
  'other',
];

const VALID_SORT_FIELDS = ['title', 'author', 'year', 'rating'];
const VALID_ORDERS = ['asc', 'desc'];

export function parsePositiveInt(value) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return null;
  }
  const str = String(value);
  if (!/^[1-9]\d*$/.test(str)) {
    return null;
  }
  const num = Number(str);
  return Number.isSafeInteger(num) ? num : null;
}

export function validateBookData(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'Request body must be a JSON object' };
  }

  if (typeof input.title !== 'string') {
    return { error: 'Title is required and must be a string' };
  }
  const title = input.title.trim();
  if (title.length < 1 || title.length > 100) {
    return { error: 'Title must be between 1 and 100 characters after trimming' };
  }

  if (typeof input.author !== 'string') {
    return { error: 'Author is required and must be a string' };
  }
  const author = input.author.trim();
  if (author.length < 1 || author.length > 100) {
    return { error: 'Author must be between 1 and 100 characters after trimming' };
  }

  const currentYear = new Date().getFullYear();
  if (typeof input.year !== 'number' || !Number.isInteger(input.year)) {
    return { error: 'Year is required and must be an integer' };
  }
  if (input.year < 1000 || input.year > currentYear) {
    return { error: `Year must be an integer between 1000 and ${currentYear}` };
  }

  if (typeof input.genre !== 'string' || !VALID_GENRES.includes(input.genre)) {
    return { error: `Genre must be one of: ${VALID_GENRES.join(', ')}` };
  }

  let read = false;
  if (input.read !== undefined) {
    if (typeof input.read !== 'boolean') {
      return { error: 'Read must be a boolean' };
    }
    read = input.read;
  }

  let rating = null;
  if (input.rating !== undefined && input.rating !== null) {
    if (
      typeof input.rating !== 'number' ||
      !Number.isInteger(input.rating) ||
      input.rating < 1 ||
      input.rating > 5
    ) {
      return { error: 'Rating must be an integer from 1 to 5, or null' };
    }
    rating = input.rating;
  }

  if (rating !== null && !read) {
    return { error: 'Rating is allowed only when read is true' };
  }

  return {
    error: null,
    value: {
      title,
      author,
      year: input.year,
      genre: input.genre,
      read,
      rating,
    },
  };
}

export function validatePatchData(existingBook, patchBody) {
  if (!patchBody || typeof patchBody !== 'object' || Array.isArray(patchBody)) {
    return { error: 'Request body must be a JSON object' };
  }

  const allowedFields = ['title', 'author', 'year', 'genre', 'read', 'rating'];
  const merged = { ...existingBook };

  for (const field of allowedFields) {
    if (Object.hasOwn(patchBody, field)) {
      merged[field] = patchBody[field];
    }
  }

  return validateBookData(merged);
}

export function validateQueryOptions(query) {
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      return { error: `Query parameter "${key}" must not be repeated` };
    }
  }

  let genre = null;
  if (query.genre !== undefined) {
    if (typeof query.genre !== 'string' || !VALID_GENRES.includes(query.genre)) {
      return { error: `Invalid genre. Must be one of: ${VALID_GENRES.join(', ')}` };
    }
    genre = query.genre;
  }

  let read = null;
  if (query.read !== undefined) {
    if (query.read === 'true') {
      read = true;
    } else if (query.read === 'false') {
      read = false;
    } else {
      return { error: 'Query parameter "read" must be "true" or "false"' };
    }
  }

  let q = '';
  if (query.q !== undefined) {
    if (typeof query.q !== 'string') {
      return { error: 'Query parameter "q" must be a string' };
    }
    q = query.q.trim();
  }

  let sort = 'id';
  if (query.sort !== undefined) {
    if (typeof query.sort !== 'string' || !VALID_SORT_FIELDS.includes(query.sort)) {
      return { error: `Invalid sort field. Must be one of: ${VALID_SORT_FIELDS.join(', ')}` };
    }
    sort = query.sort;
  }

  let order = 'asc';
  if (query.order !== undefined) {
    if (typeof query.order !== 'string' || !VALID_ORDERS.includes(query.order)) {
      return { error: 'Invalid order. Must be "asc" or "desc"' };
    }
    order = query.order;
  }

  let limit = 50;
  if (query.limit !== undefined) {
    const parsedLimit = parsePositiveInt(query.limit);
    if (parsedLimit === null || parsedLimit > 50) {
      return { error: 'Query parameter "limit" must be an integer between 1 and 50' };
    }
    limit = parsedLimit;
  }

  let page = 1;
  if (query.page !== undefined) {
    const parsedPage = parsePositiveInt(query.page);
    if (parsedPage === null) {
      return { error: 'Query parameter "page" must be a positive integer' };
    }
    page = parsedPage;
  }

  return {
    error: null,
    value: { genre, read, q, sort, order, limit, page },
  };
}