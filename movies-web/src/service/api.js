


export async function getMostPopularMovies(page = 1, limit = 12) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const appToken = import.meta.env.VITE_X_APP_TOKEN;
  // API caps limit at 12; ensure we request 12 even if caller passes larger
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
  // Fetch page 1 and 2, each 12 items
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