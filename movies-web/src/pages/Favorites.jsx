import { useEffect, useState, useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { getFavorites, getMovieDetail } from '@/service/api';
import MovieCard from '@/components/common/MovieCard';
import MovieCardSkeleton from '@/components/common/MovieCardSkeleton';
import { Button } from '@/components/ui/button';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Favorites() {
    const { isDark } = useTheme();
    const { isAuthenticated } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

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

    // Pagination logic
    const totalPages = useMemo(() => {
        return Math.ceil(favorites.length / ITEMS_PER_PAGE);
    }, [favorites.length]);

    const paginatedFavorites = useMemo(() => {
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIdx = startIdx + ITEMS_PER_PAGE;
        return favorites.slice(startIdx, endIdx);
    }, [favorites, currentPage]);

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

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
                        {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
                    </p>
                )}
            </div>

            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <MovieCardSkeleton key={idx} />
                    ))}
                </div>
            )}
            {error && <div className="py-10 text-center text-red-500">{error}</div>}
            {!loading && !error && favorites.length === 0 && (
                <div className="py-10 text-center opacity-70">
                    <Heart className="mx-auto mb-3 opacity-30" size={48} />
                    <p>No favorite movies yet.</p>
                    <p className="text-sm mt-2">Start adding movies to your favorites!</p>
                </div>
            )}

            {!loading && !error && favorites.length > 0 && (
                <div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                        {paginatedFavorites.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                options={{ showGenres: true, showRate: true }}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls - Always visible */}
                    <div className="flex justify-center items-center gap-4 py-4">
                        <Button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            variant="outline"
                            size="sm"
                            className={isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}
                        >
                            <ChevronLeft size={18} />
                            Previous
                        </Button>

                        <span className="text-sm opacity-80">Page {currentPage} of {totalPages}</span>

                        <Button
                            onClick={handleNext}
                            disabled={currentPage >= totalPages}
                            variant="outline"
                            size="sm"
                            className={isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}
                        >
                            Next
                            <ChevronRight size={18} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
