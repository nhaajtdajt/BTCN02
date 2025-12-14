


export async function getMostPopularMovies(page = 1, limit = 5) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const appToken = import.meta.env.VITE_X_APP_TOKEN;
  const response = await fetch(
    `${backendUrl}/api/movies/most-popular?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-app-token": appToken,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}