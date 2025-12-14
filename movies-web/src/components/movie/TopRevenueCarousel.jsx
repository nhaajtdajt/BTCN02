import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { getMostPopularMovies } from '@/service/api';

export default function TopRevenueCarousel() {
    const { isDark } = useTheme();
    const [movies, setMovies] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await getMostPopularMovies(1, 5);
                if (!ignore) {
                    setMovies(res?.data || []);
                    setIndex(0);
                }
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to load movies');
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, []);

    const goNext = () => {
        if (!movies.length) return;
        setIndex((i) => (i + 1) % movies.length);
    };

    const goPrev = () => {
        if (!movies.length) return;
        setIndex((i) => (i - 1 + movies.length) % movies.length);
    };

    return (
        <section className="mb-8 mt-10">

            <div className="relative">
                <button
                    onClick={goPrev}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow-lg transition-colors ${isDark ? 'bg-gray-700/80 hover:bg-gray-700' : 'bg-white/80 hover:bg-white'
                        }`}
                >
                    <ChevronLeft size={24} />
                </button>

                <div
                    className={`flex justify-center gap-4 px-12 py-2 rounded transition-colors ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                        }`}
                >
                    {loading && (
                        <div className="py-10 text-sm opacity-80">Loading top revenue movies...</div>
                    )}
                    {error && (
                        <div className="py-10 text-sm text-red-500">{error}</div>
                    )}
                    {!loading && !error && movies.length === 0 && (
                        <div className="py-10 text-sm opacity-80">No movies found.</div>
                    )}
                    {!loading && !error && movies.length > 0 && (
                        <div className="w-full flex justify-center">
                            {(() => {
                                const movie = movies[index];
                                return (
                                    <article
                                        key={movie.id}
                                        className={`w-[240px] overflow-hidden rounded shadow-md border transition-colors ${isDark
                                                ? 'border-gray-700 bg-gray-900 hover:shadow-xl'
                                                : 'border-gray-200 bg-white hover:shadow-xl'
                                            }`}
                                    >
                                        <div className="h-auto bg-gray-200 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={movie.image}
                                                alt={movie.title}
                                                className="w-full h-full object-contain"

                                            />
                                        </div>
                                    </article>
                                );
                            })()}
                        </div>
                    )}
                </div>

                <button
                    onClick={goNext}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow-lg transition-colors ${isDark ? 'bg-gray-700/80 hover:bg-gray-700' : 'bg-white/80 hover:bg-white'
                        }`}
                >
                    <ChevronRight size={24} />
                </button>
            </div>
            <div className="mt-2 text-xs opacity-70">Movie {movies.length ? index + 1 : 0} / {movies.length || 0}</div>
        </section>
    );
}