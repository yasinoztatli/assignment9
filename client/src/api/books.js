const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, { method = 'GET', body, signal } = {}) {
  const headers = {};
  const fetchOptions = { method, headers, signal };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data && typeof data.error === 'string') {
        errorMessage = data.error;
      }
    } catch {
      // Keep fallback message when response body is not valid JSON
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getBooks(params = {}, signal) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  const path = queryString ? `/api/books?${queryString}` : '/api/books';
  return request(path, { signal });
}

export function getBook(id, signal) {
  return request(`/api/books/${encodeURIComponent(id)}`, { signal });
}

export function createBook(bookData) {
  return request('/api/books', {
    method: 'POST',
    body: bookData,
  });
}

export function replaceBook(id, bookData) {
  return request(`/api/books/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: bookData,
  });
}

export function patchBook(id, partialData) {
  return request(`/api/books/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: partialData,
  });
}

export function deleteBook(id) {
  return request(`/api/books/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function getStats(signal) {
  return request('/api/stats', { signal });
}