const backendUrl = import.meta.env.VITE_BACKEND_URL;
const appToken = import.meta.env.VITE_X_APP_TOKEN;


export async function getMostPopularMovies(page = 1, limit = 12) {
  const cappedLimit = Math.min(Number(limit) || 12, 12);
  const url = `${backendUrl}/api/movies/most-popular?page=${page}&limit=${cappedLimit}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-app-token": appToken,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function prefetchMostPopularFirstTwoPages() {

  const [p1, p2] = await Promise.all([
    getMostPopularMovies(1, 12),
    getMostPopularMovies(2, 12),
  ]);
  const merged = {
    title: p1?.title || "Most Popular",
    data: [...(p1?.data || []), ...(p2?.data || [])],
    pagination: p1?.pagination || { current_page: 1, page_size: 12 },
  };
  return merged;
}

export async function getTopRatedMovies(page = 1, limit = 12, category = "IMDB_TOP_50") {
  const cappedLimit = Math.min(Number(limit) || 12, 12);
  const url = `${backendUrl}/api/movies/top-rated?category=${encodeURIComponent(category)}&page=${page}&limit=${cappedLimit}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-app-token": appToken,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function prefetchTopRatedFirstTwoPages() {
  const [p1, p2] = await Promise.all([
    getTopRatedMovies(1, 12),
    getTopRatedMovies(2, 12),
  ]);

  const merged = {
    title: p1?.title || "Top Rating",
    data: [...(p1?.data || []), ...(p2?.data || [])],
    pagination: p1?.pagination || { current_page: 1, page_size: 12 },
  };

  return merged;
}

export async function getMovieDetail(id) {
  if (!id) throw new Error('Movie id is required');
  const url = `${backendUrl}/api/movies/${id}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-app-token": appToken,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function searchMovies(title = '', page = 1, limit = 21) {
  const url = `${backendUrl}/api/movies/search?q=${encodeURIComponent(title)}&page=${page}&limit=${limit}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-app-token": appToken,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function getPersonDetail(id) {
  if (!id) throw new Error('Person id is required');
  const url = `${backendUrl}/api/persons/${id}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-app-token": appToken,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function getMovieReviews(movieId, page = 1, limit = 12, sort = 'newest') {
  if (!movieId) throw new Error('Movie id is required');
  const url = `${backendUrl}/api/movies/${movieId}/reviews?page=${page}&limit=${limit}&sort=${sort}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-app-token": appToken,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}


/**
 * Register a new user
 * @param {{username:string,email:string,password:string,phone:string,dob:string}} payload
 * @returns {Promise<{ message: string }>}
 */
export async function registerUser(payload) {
  const res = await fetch(`${backendUrl}/api/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-token': appToken,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message || `Register failed (HTTP ${res.status})`);
  }
  return json;
}


/**
 * Login user
 * @param {{username:string,password:string}} payload
 * @returns {Promise<{ token: string, user: object, message?: string }>}
 */

export async function loginUser(payload) {
  const res = await fetch(`${backendUrl}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-token': appToken,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message || `Login failed (HTTP ${res.status})`);
  }
  return json;
}