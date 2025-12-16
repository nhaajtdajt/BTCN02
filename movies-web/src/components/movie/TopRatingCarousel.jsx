import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getTopRatedMovies, prefetchTopRatedFirstTwoPages } from '@/service/api';
import MovieCardSkeleton from '@/components/common/MovieCardSkeleton';

export default function TopRatingCarousel() {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [items, setItems] = useState([]);
    const [pageLoaded, setPageLoaded] = useState(new Set());
    const [cursor, setCursor] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const PAGE_SIZE = 12;
    const VIEW_SIZE = 3;
    const isFetchingMoreRef = useRef(false);

    const currentSlice = useMemo(() => items.slice(cursor, cursor + VIEW_SIZE), [items, cursor]);

    useEffect(() => {
        let ignore = false;
        async function bootstrap() {
            setLoading(true);
            setError(null);
            try {
                const merged = await prefetchTopRatedFirstTwoPages();
                if (!ignore) {
                    setItems(merged.data || []);
                    setPageLoaded(new Set([1, 2]));
                    setCursor(0);
                }
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to load top rating movies');
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        bootstrap();
        return () => { ignore = true; };
    }, []);


    // Preemptively fetch next page when cursor is close to end
    useEffect(() => {
        let ignore = false;
        const total = items.length;
        const nextCursor = cursor + VIEW_SIZE;
        const isApproachingEnd = nextCursor >= total - VIEW_SIZE;

        if (isApproachingEnd && !isFetchingMoreRef.current) {
            const nextPageIndex = Math.floor(total / PAGE_SIZE) + 1;
            if (!pageLoaded.has(nextPageIndex)) {
                isFetchingMoreRef.current = true;
                (async () => {
                    try {
                        const res = await getTopRatedMovies(nextPageIndex, PAGE_SIZE);
                        if (!ignore) {
                            setItems((prev) => [...prev, ...(res?.data || [])]);
                            setPageLoaded((prev) => new Set([...prev, nextPageIndex]));
                        }
                    } finally {
                        isFetchingMoreRef.current = false;
                    }
                })();
            }
        }
        return () => { ignore = true; };
    }, [cursor, items.length, pageLoaded]);

    const goNext = () => {
        if (!items.length) return;
        let next = cursor + VIEW_SIZE;
        next = Math.min(next, Math.max(items.length - VIEW_SIZE, 0));
        setCursor(next);
    };

    const goPrev = () => {
        if (!items.length) return;
        const prev = Math.max(cursor - VIEW_SIZE, 0);
        setCursor(prev);
    };

    return (
        <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Top Rating</h2>
            <div className="relative">
                <button
                    onClick={goPrev}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow-lg ${isDark ? 'bg-gray-700/80 hover:bg-gray-700' : 'bg-white/80 hover:bg-white'
                        }`}
                >
                    <ChevronLeft size={22} />
                </button>

                <div className="px-12">
                    {loading && (
                        <div className="grid grid-cols-3 gap-3">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <MovieCardSkeleton key={idx} />
                            ))}
                        </div>
                    )}
                    {error && (
                        <div className="py-8 text-sm text-red-500">{error}</div>
                    )}
                    {!loading && !error && (
                        <div className="grid grid-cols-3 gap-3">
                            {currentSlice.map((m) => (
                                <div
                                    key={m.id}
                                    onClick={() => m.id && navigate(`/movie/${m.id}`)}
                                    className={`group relative rounded overflow-hidden border shadow-sm transition-transform duration-300 hover:scale-110 hover:z-20 cursor-pointer ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}
                                >
                                    <div className="relative h-55 bg-gray-200 overflow-hidden">
                                        {m.image ? (
                                            <img
                                                src={m.image}
                                                alt={m.title}
                                                className="w-full h-full object-fill"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = '';
                                                    e.currentTarget.style.display = 'none';
                                                    const placeholder = e.currentTarget.parentElement?.querySelector('.carousel-fallback');
                                                    if (placeholder) placeholder.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className="carousel-fallback w-full h-full hidden items-center justify-center text-gray-400">
                                            <Film className="w-12 h-12" />
                                        </div>
                                        <div
                                            className={`absolute left-0 right-0 p-1 top-full text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDark ? 'bg-black' : 'bg-black'}`}
                                        >
                                            <div className="text-xl h-auto font-semibold whitespace-normal wrap-break-word">{m.title} {m.year ? `(${m.year})` : ''}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={goNext}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow-lg ${isDark ? 'bg-gray-700/80 hover:bg-gray-700' : 'bg-white/80 hover:bg-white'
                        }`}
                >
                    <ChevronRight size={22} />
                </button>
            </div>
        </section>
    );
}
