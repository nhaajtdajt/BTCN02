import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { searchMovies } from '@/service/api';
import { Button } from '@/components/ui/button';
import MovieCard from '@/components/common/MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Search() {
    const [searchParams] = useSearchParams();
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
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                options={{ showGenres: true, showRate: true }}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center gap-4 py-4">
                        <Button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            variant="outline"
                            size="sm"
                        >
                            <ChevronLeft size={18} />
                            Previous
                        </Button>

                        <span className="text-sm opacity-80">Page {currentPage}</span>

                        <Button
                            onClick={handleNext}
                            disabled={!hasMore}
                            variant="outline"
                            size="sm"
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
