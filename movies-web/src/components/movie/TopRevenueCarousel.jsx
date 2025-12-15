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
        <section className="mb-8">

            <div className="relative">
                <button
                    onClick={goPrev}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow-lg transition-colors ${isDark ? 'bg-gray-700/80 hover:bg-gray-700' : 'bg-white/80 hover:bg-white'
                        }`}
                >
                    <ChevronLeft size={24} />
                </button>

                <div
                    className={`flex justify-center gap-4 px-12 py-8 rounded transition-colors ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
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
                                        className={`w-[280px] overflow-hidden rounded-lg shadow-lg border transition-all duration-300 transform hover:scale-110 hover:shadow-2xl cursor-pointer group ${isDark
                                            ? 'border-gray-700 bg-gray-900'
                                            : 'border-gray-300 bg-white'
                                            }`}
                                    >
                                        {/* Poster Image */}
                                        <div className="relative bg-gray-300 flex items-center justify-center overflow-hidden h-[380px]">
                                            <img
                                                src={movie.image}
                                                alt={movie.title}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Info overlay at bottom */}
                                            <div className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white`}>
                                                <h3 className="font-bold text-sm line-clamp-2">{movie.title}</h3>
                                                <p className="text-xs opacity-90 mt-1">{movie.year}</p>

                                                {/* Genres */}
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {movie.genres?.slice(0, 2).map((genre, idx) => (
                                                        <span key={idx} className="text-xs bg-blue-600/80 px-2 py-0.5 rounded">
                                                            {genre}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Rating - Shows on hover */}
                                                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="text-yellow-400 font-bold text-lg">★</span>
                                                        <span className="font-bold text-lg text-yellow-300">
                                                            {movie.rate ? movie.rate.toFixed(1) : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Pagination indicators at bottom inside poster */}
                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center items-center gap-1.5 z-20">
                                                {movies.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`h-1.5 transition-all duration-300 rounded-full ${idx === index
                                                                ? `w-6 ${isDark ? 'bg-blue-400' : 'bg-white'}`
                                                                : `w-1.5 ${isDark ? 'bg-white/50' : 'bg-white/70'}`
                                                            }`}
                                                    />
                                                ))}
                                            </div>
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
        </section>
    );
}