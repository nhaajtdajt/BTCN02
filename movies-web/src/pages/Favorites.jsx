import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { getFavorites, getMovieDetail } from '@/service/api';
import MovieCard from '@/components/common/MovieCard';
import { Heart } from 'lucide-react';

export default function Favorites() {
    const { isDark } = useTheme();
    const { isAuthenticated } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;
        async function loadFavorites() {
            if (!isAuthenticated) {
                setFavorites([]);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const favoritesList = await getFavorites();
                if (!ignore && favoritesList && favoritesList.length > 0) {
                    // Fetch full details for each favorite movie
                    const detailsPromises = favoritesList.map(fav =>
                        getMovieDetail(fav.id).catch(err => {
                            console.error(`Failed to load details for ${fav.id}:`, err);
                            return fav; // Fallback to basic data if detail fetch fails
                        })
                    );
                    const detailedMovies = await Promise.all(detailsPromises);
                    setFavorites(detailedMovies);
                } else if (!ignore) {
                    setFavorites([]);
                }
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to load favorites');
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        loadFavorites();
        return () => { ignore = true; };
    }, [isAuthenticated]);

    return (
        <div className={`w-[1200px] mx-auto p-6 min-h-[600px] transition-colors ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Heart className="text-red-500 fill-red-500" size={28} />
                    My Favorites
                </h1>
                <p className="text-sm opacity-70">
                    Your collection of favorite movies
                </p>
                {favorites.length > 0 && (
                    <p className="text-xs opacity-60 mt-1">
                        {favorites.length} movie{favorites.length !== 1 ? 's' : ''} saved
                    </p>
                )}
            </div>

            {loading && <div className="py-10 text-center opacity-70">Loading favorites...</div>}
            {error && <div className="py-10 text-center text-red-500">{error}</div>}
            {!loading && !error && favorites.length === 0 && (
                <div className="py-10 text-center opacity-70">
                    <Heart className="mx-auto mb-3 opacity-30" size={48} />
                    <p>No favorite movies yet.</p>
                    <p className="text-sm mt-2">Start adding movies to your favorites!</p>
                </div>
            )}

            {!loading && !error && favorites.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favorites.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            options={{ showGenres: true, showRate: true }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
