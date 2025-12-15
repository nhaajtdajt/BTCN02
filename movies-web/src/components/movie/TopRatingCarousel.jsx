import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { getTopRatedMovies, prefetchTopRatedFirstTwoPages } from '@/service/api';

export default function TopRatingCarousel() {
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

    async function ensureMoreIfNeeded(nextCursor) {
        const total = items.length;
        const atOrBeyondEnd = nextCursor >= total - VIEW_SIZE;
        if (!atOrBeyondEnd) return;
        if (isFetchingMoreRef.current) return;

        const nextPageIndex = Math.floor(total / PAGE_SIZE) + 1;
        if (pageLoaded.has(nextPageIndex)) return;

        isFetchingMoreRef.current = true;
        try {
            const res = await getTopRatedMovies(nextPageIndex, PAGE_SIZE);
            setItems((prev) => [...prev, ...(res?.data || [])]);
            setPageLoaded((prev) => new Set([...prev, nextPageIndex]));
        } finally {
            isFetchingMoreRef.current = false;
        }
    }

    const goNext = async () => {
        if (!items.length) return;
        let next = cursor + VIEW_SIZE;
        if (next > items.length - VIEW_SIZE) {
            await ensureMoreIfNeeded(next);
        }
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
                        <div className="py-8 text-sm opacity-80">Loading top rating movies...</div>
                    )}
                    {error && (
                        <div className="py-8 text-sm text-red-500">{error}</div>
                    )}
                    {!loading && !error && (
                        <div className="grid grid-cols-3 gap-3">
                            {currentSlice.map((m) => (
                                <div
                                    key={m.id}
                                    className={`rounded overflow-hidden border shadow-sm ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}
                                >
                                    <div className="relative h-[220px] bg-gray-200">
                                        <img
                                            src={m.image}
                                            alt={m.title}
                                            className="w-full h-full object-fill"
                                        />
                                    </div>
                                    <div className={`p-2 text-center ${isDark ? 'text-white' : 'text-black'}`}>
                                        <div className="text-base font-semibold whitespace-normal break-words leading-snug">{m.title}</div>
                                        {m.year && <div className="text-sm opacity-80">{m.year}</div>}
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
