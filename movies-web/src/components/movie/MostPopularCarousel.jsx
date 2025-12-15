import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getMostPopularMovies, prefetchMostPopularFirstTwoPages } from '@/service/api';

export default function MostPopularCarousel() {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [items, setItems] = useState([]); // merged list
    const [pageLoaded, setPageLoaded] = useState(new Set()); // track which pages fetched
    const [cursor, setCursor] = useState(0); // index of first item in current view
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const PAGE_SIZE = 12; // API enforced
    const VIEW_SIZE = 3; // 3 per view
    const isFetchingMoreRef = useRef(false);

    const currentSlice = useMemo(() => items.slice(cursor, cursor + VIEW_SIZE), [items, cursor]);

    useEffect(() => {
        let ignore = false;
        async function bootstrap() {
            setLoading(true);
            setError(null);
            try {
                const merged = await prefetchMostPopularFirstTwoPages();
                if (!ignore) {
                    setItems(merged.data || []);
                    setPageLoaded(new Set([1, 2]));
                    setCursor(0);
                }
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to load most popular movies');
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        bootstrap();
        return () => { ignore = true; };
    }, []);

    async function ensureMoreIfNeeded(nextCursor) {
        // Fetch next page when trying to go beyond current items
        const total = items.length;
        const atOrBeyondEnd = nextCursor >= total - VIEW_SIZE;
        if (!atOrBeyondEnd) return;
        if (isFetchingMoreRef.current) return;
        const nextPageIndex = Math.floor(total / PAGE_SIZE) + 1; // pages start with 1
        if (pageLoaded.has(nextPageIndex)) return; // already fetched
        isFetchingMoreRef.current = true;
        try {
            const res = await getMostPopularMovies(nextPageIndex, PAGE_SIZE);
            setItems((prev) => [...prev, ...(res?.data || [])]);
            setPageLoaded((prev) => new Set([...prev, nextPageIndex]));
        } finally {
            isFetchingMoreRef.current = false;
        }
    }

    const goNext = async () => {
        if (!items.length) return;
        let next = cursor + VIEW_SIZE;
        // if next exceeds current items, try to fetch more first
        if (next > items.length - VIEW_SIZE) {
            await ensureMoreIfNeeded(next);
        }
        // recompute bounds after potential fetch
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
            <h2 className="text-xl font-bold mb-4">Most Popular</h2>
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
                        <div className="py-8 text-sm opacity-80">Loading most popular movies...</div>
                    )}
                    {error && (
                        <div className="py-8 text-sm text-red-500">{error}</div>
                    )}
                    {!loading && !error && (
                        <div className="grid grid-cols-3 gap-3 overflow-visible">
                            {currentSlice.map((m) => (
                                <div
                                    key={m.id}
                                    onClick={() => m.id && navigate(`/movie/${m.id}`)}
                                    className={`group relative rounded overflow-hidden border shadow-sm transition-transform duration-300 hover:scale-110 hover:z-20 overflow-visible cursor-pointer ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
                                        }`}
                                >
                                    <div className="relative h-[220px] bg-gray-200 overflow-visible">
                                        <img
                                            src={m.image}
                                            alt={m.title}
                                            className="w-full h-full object-fill"
                                        />
                                        {/* Title + year bar below poster, absolute so no space when hidden */}
                                        <div
                                            className={`absolute left-0 right-0 p-1 top-full  text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDark ? 'bg-black' : 'bg-black'
                                                }`}
                                        >
                                            <div className="text-xl h-auto font-semibold whitespace-normal break-words">{m.title} ({m.year})</div>
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