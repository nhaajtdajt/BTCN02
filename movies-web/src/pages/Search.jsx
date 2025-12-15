import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { searchMovies } from '@/service/api';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ChevronLeft, ChevronRight, Film } from 'lucide-react';

export default function Search() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const query = searchParams.get('q') || '';

    const [results, setResults] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const DISPLAY_PER_PAGE = 12;

    useEffect(() => {
        let ignore = false;
        async function fetchResults() {
            if (!query.trim()) {
                setResults([]);
                setPagination(null);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const data = await searchMovies(query, currentPage, 21);
                if (!ignore) {
                    setResults(data?.data || []);
                    setPagination(data?.pagination || null);
                }
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to search movies');
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        fetchResults();
        return () => { ignore = true; };
    }, [query, currentPage]);

    const displayedResults = results.slice(0, DISPLAY_PER_PAGE);
    const hasMore = results.length > DISPLAY_PER_PAGE || (pagination && currentPage < pagination.total_pages);

    const handleNext = () => {
        setCurrentPage((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                <h1 className="text-2xl font-bold mb-2">Search Results</h1>
                {query && <p className="text-sm opacity-70">Showing results for: <span className="font-semibold">"{query}"</span></p>}
                {pagination && (
                    <p className="text-xs opacity-60 mt-1">
                        Page {pagination.current_page} of {pagination.total_pages} • {pagination.total_items} total results
                    </p>
                )}
            </div>

            {loading && <div className="py-10 text-center opacity-70">Loading results...</div>}
            {error && <div className="py-10 text-center text-red-500">{error}</div>}
            {!loading && !error && !query.trim() && (
                <div className="py-10 text-center opacity-70">Enter a search term to find movies.</div>
            )}
            {!loading && !error && query.trim() && displayedResults.length === 0 && (
                <div className="py-10 text-center opacity-70">No movies found for "{query}"</div>
            )}

            {!loading && !error && displayedResults.length > 0 && (
                <div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                        {displayedResults.map((movie) => (
                            <Card
                                key={movie.id}
                                onClick={() => movie.id && navigate(`/movie/${movie.id}`)}
                                className={`cursor-pointer transition hover:-translate-y-1  hover:shadow-lg overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                    }`}
                            >
                                <AspectRatio ratio={2 / 3} className="w-full bg-gray-200">
                                    {movie.image ? (
                                        <img
                                            src={movie.image}
                                            alt={movie.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = '';
                                                e.currentTarget.style.display = 'none';

                                                const placeholder = e.currentTarget.parentElement?.querySelector('.poster-fallback');
                                                if (placeholder) placeholder.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className="poster-fallback w-full h-full hidden items-center justify-center text-gray-500">
                                        <Film className="w-10 h-10" />
                                    </div>
                                </AspectRatio>
                                <CardContent className="p-3">
                                    <p className={`font-semibold text-sm leading-tight line-clamp-2 ${isDark ? 'text-white' : 'border-gray-200 bg-white'
                                        }`}  >{movie.title}</p>
                                    <div className="flex items-center justify-between mt-1 text-xs opacity-70">
                                        {movie.year && <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{movie.year}</span>}
                                        {movie.rate && <span className={`flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>⭐ {movie.rate}</span>}
                                    </div>
                                    {movie.genres?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {movie.genres.slice(0, 2).map((g) => (
                                                <span
                                                    key={g}
                                                    className={`text-[10px] px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    {g}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center gap-4 py-4">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className={`flex items-center gap-1 px-4 py-2 rounded-md transition ${currentPage === 1
                                ? 'opacity-40 cursor-not-allowed'
                                : isDark
                                    ? 'bg-gray-800 hover:bg-gray-700'
                                    : 'bg-white hover:bg-gray-100 border border-gray-300'
                                }`}
                        >
                            <ChevronLeft size={18} />
                            Previous
                        </button>

                        <span className="text-sm opacity-80">Page {currentPage}</span>

                        <button
                            onClick={handleNext}
                            disabled={!hasMore}
                            className={`flex items-center gap-1 px-4 py-2 rounded-md transition ${!hasMore
                                ? 'opacity-40 cursor-not-allowed'
                                : isDark
                                    ? 'bg-gray-800 hover:bg-gray-700'
                                    : 'bg-white hover:bg-gray-100 border border-gray-300'
                                }`}
                        >
                            Next
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
