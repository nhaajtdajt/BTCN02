import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { getMovieDetail, getMovieReviews, addFavorite, removeFavorite } from '@/service/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import MovieCard from '@/components/common/MovieCard';
import { ChevronLeft, ChevronRight, ChevronDown, Heart } from 'lucide-react';

export default function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { isAuthenticated, favoriteIds, addToFavorites, removeFromFavorites } = useAuth();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

    // Sync favorite state from context
    useEffect(() => {
        if (movie?.id) {
            setIsFavorited(favoriteIds.includes(movie.id));
        }
    }, [favoriteIds, movie?.id]);

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsPagination, setReviewsPagination] = useState(null);
    const [currentReviewPage, setCurrentReviewPage] = useState(1);
    const [reviewsSort, setReviewsSort] = useState('newest');
    const [expandedReviews, setExpandedReviews] = useState(new Set());

    // Similar movies pagination state
    const [currentSimilarPage, setCurrentSimilarPage] = useState(1);
    const SIMILAR_MOVIES_PER_PAGE = 8;

    const handleFavoriteToggle = async () => {
        if (!isAuthenticated || isTogglingFavorite || !movie) return;

        setIsTogglingFavorite(true);
        try {
            if (isFavorited) {
                await removeFavorite(movie.id);
                removeFromFavorites(movie.id);
            } else {
                await addFavorite(movie.id);
                addToFavorites(movie.id);
            }
        } catch (err) {
            console.error('Toggle favorite failed:', err);
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    useEffect(() => {
        let ignore = false;
        async function load() {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const data = await getMovieDetail(id);
                if (!ignore) setMovie(data);
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to load movie');
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => { ignore = true; };
    }, [id]);

    // Fetch reviews
    useEffect(() => {
        let ignore = false;
        async function loadReviews() {
            if (!id) return;
            setReviewsLoading(true);
            try {
                const data = await getMovieReviews(id, currentReviewPage, 12, reviewsSort);
                if (!ignore) {
                    setReviews(data.data || []);
                    setReviewsPagination(data.pagination);
                }
            } catch (err) {
                console.error('Failed to load reviews:', err);
            } finally {
                if (!ignore) setReviewsLoading(false);
            }
        }
        loadReviews();
        return () => { ignore = true; };
    }, [id, currentReviewPage, reviewsSort]);

    const ratings = useMemo(() => {
        if (!movie?.ratings) return [];
        const entries = [
            ['IMDb', movie.ratings.imDb],
            ['Metacritic', movie.ratings.metacritic],
            ['TheMovieDB', movie.ratings.theMovieDb],
            ['FilmAffinity', movie.ratings.filmAffinity],
            ['Rotten Tomatoes', movie.ratings.rottenTomatoes],
        ];
        return entries.filter(([, v]) => v);
    }, [movie]);

    const toggleReviewExpanded = (reviewId) => {
        setExpandedReviews(prev => {
            const newSet = new Set(prev);
            if (newSet.has(reviewId)) {
                newSet.delete(reviewId);
            } else {
                newSet.add(reviewId);
            }
            return newSet;
        });
    };

    const handleReviewPageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (reviewsPagination?.total_pages || 1)) {
            setCurrentReviewPage(newPage);
            setExpandedReviews(new Set());
        }
    };

    // Similar movies pagination
    const paginatedSimilarMovies = useMemo(() => {
        if (!movie?.similar_movies) return [];
        const startIdx = (currentSimilarPage - 1) * SIMILAR_MOVIES_PER_PAGE;
        const endIdx = startIdx + SIMILAR_MOVIES_PER_PAGE;
        return movie.similar_movies.slice(startIdx, endIdx);
    }, [movie?.similar_movies, currentSimilarPage]);

    const totalSimilarPages = useMemo(() => {
        if (!movie?.similar_movies) return 1;
        return Math.ceil(movie.similar_movies.length / SIMILAR_MOVIES_PER_PAGE);
    }, [movie?.similar_movies]);

    const boxOfficeEntries = useMemo(() => {
        if (!movie?.box_office) return [];
        const entries = [
            ['Budget', movie.box_office.budget],
            ['Gross USA', movie.box_office.grossUSA],
            ['Opening Weekend USA', movie.box_office.openingWeekendUSA],
            ['Worldwide', movie.box_office.cumulativeWorldwideGross],
        ];
        return entries.filter(([, v]) => v);
    }, [movie]);

    const pillTone = isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black';
    const sectionBg = isDark ? 'bg-gray-900/70 border-gray-800' : 'bg-white border-gray-200';

    return (
        <div className={`w-[1200px]  mx-auto p-6 transition-colors ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
            <div className="mb-4 flex items-center justify-between">
                <Button
                    onClick={() => navigate(-1)}
                    variant="outline"
                    size="sm"
                    className={isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}
                >
                    ← Back
                </Button>
                {movie?.full_title && (
                    <span className="text-xs opacity-60">{movie.full_title}</span>
                )}
            </div>
            {loading && <div className="py-10 text-center opacity-70">Loading movie...</div>}
            {error && <div className="py-10 text-center text-red-500">{error}</div>}

            {!loading && !error && movie && (
                <div className="space-y-10">

                    {/* ================= HERO ================= */}
                    <div className="relative rounded-xl overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-30"
                            style={{ backgroundImage: `url(${movie.image})` }}
                        />
                        <div className={`relative flex gap-6 p-6 rounded-xl border ${sectionBg}`}>
                            {isAuthenticated && (
                                <button
                                    onClick={handleFavoriteToggle}
                                    disabled={isTogglingFavorite}
                                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all disabled:opacity-50"
                                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    <Heart
                                        className={`w-6 h-6 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'
                                            }`}
                                    />
                                </button>
                            )}

                            <div className="w-[260px] shrink-0">
                                <AspectRatio ratio={2 / 3} className="rounded-lg overflow-hidden shadow-lg">
                                    <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                                </AspectRatio>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <h1 className="text-4xl font-bold leading-tight">{movie.title}</h1>
                                    <p className="text-lg opacity-80">{movie.full_title}</p>
                                    <p className="text-sm opacity-70 mt-1">
                                        {movie.year} • {movie.runtime}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {movie.genres?.map(g => (
                                        <Badge key={g} variant="secondary">{g}</Badge>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2 text-xs">
                                    {movie.countries?.map(c => (
                                        <span key={c} className={`px-2 py-1 rounded-full ${pillTone}`}>🌍 {c}</span>
                                    ))}
                                    {movie.languages?.map(l => (
                                        <span key={l} className={`px-2 py-1 rounded-full ${pillTone}`}>🗣 {l}</span>
                                    ))}
                                </div>

                                <div
                                    className="text-sm leading-relaxed opacity-90 "
                                    dangerouslySetInnerHTML={{ __html: movie.plot_full }}
                                />

                                {movie.awards && (
                                    <div className={`p-3 rounded-lg border ${sectionBg} flex items-center gap-2`}>
                                        <span className="text-yellow-400 text-lg">🏆</span>
                                        <span className="text-sm">{movie.awards}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ================= RATINGS ================= */}
                    {ratings.length > 0 && (
                        <div className={`rounded-xl border ${sectionBg} p-6`}>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                ⭐ Ratings
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {ratings.map(([label, value]) => {
                                    let val = Number(value);
                                    if (val > 10) val = val / 10;
                                    const percent = Math.min(val * 10, 100);
                                    return (
                                        <div key={label} className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-semibold">{label}</span>
                                                <span className="flex items-center gap-1">
                                                    ⭐ {value}
                                                </span>
                                            </div>
                                            <div className="h-2 rounded bg-gray-300 overflow-hidden">
                                                <div
                                                    className="h-2 bg-yellow-400"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ================= BOX OFFICE ================= */}
                    {boxOfficeEntries.length > 0 && (
                        <div className={`rounded-xl border ${sectionBg} p-6`}>
                            <h2 className="text-xl font-semibold mb-4">💰 Box Office</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                {boxOfficeEntries.map(([label, value]) => (
                                    <div key={label} className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                        <p className="font-semibold">{label}</p>
                                        <p className="opacity-80">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ================= DIRECTORS ================= */}
                    {movie.directors?.length > 0 && (
                        <div className={`rounded-xl border ${sectionBg} p-6`}>
                            <h2 className="text-xl font-semibold mb-4">🎬 Directors</h2>
                            <div className="flex flex-wrap gap-2">
                                {movie.directors.map(d => (
                                    <Badge
                                        key={d.id || d.name}
                                        variant="outline"
                                        onClick={() => d.id && navigate(`/person/${d.id}`)}
                                        className="cursor-pointer transition hover:bg-blue-100 hover:border-blue-500"
                                    >
                                        {d.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ================= ACTORS ================= */}
                    {movie.actors?.length > 0 && (
                        <div className={`rounded-xl border ${sectionBg} p-6`}>
                            <h2 className="text-xl font-semibold mb-4">👥 Actors</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {movie.actors.map(a => (
                                    <div
                                        key={a.id || a.name}
                                        onClick={() => a.id && navigate(`/person/${a.id}`)}
                                        className={`flex gap-3 p-4 rounded-lg transition hover:-translate-y-1 hover:shadow-lg cursor-pointer
                    ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
                                    >
                                        <Avatar>
                                            <AvatarImage src={a.image} alt={a.name} />
                                            <AvatarFallback>{(a.name || 'NA').slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{a.name}</p>
                                            <p className="text-xs opacity-70">as {a.character}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ================= REVIEWS ================= */}
                    <div className={`rounded-xl border ${sectionBg} p-6 ${isDark ? 'text-white' : 'text-black'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">📝 User Reviews</h2>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className={isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}>
                                        Sort by: {reviewsSort === 'newest' ? 'Newest' : reviewsSort === 'oldest' ? 'Oldest' : reviewsSort === 'highest' ? 'Highest' : 'Lowest'}
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className={isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white text-black'}>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setReviewsSort('newest');
                                            setCurrentReviewPage(1);
                                            setExpandedReviews(new Set());
                                        }}
                                        className={`cursor-pointer ${reviewsSort === 'newest' ? (isDark ? 'bg-blue-600' : 'bg-blue-500/20') : (isDark ? 'hover:bg-gray-700' : '')} ${isDark ? 'text-white' : ''}`}
                                    >
                                        Newest
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setReviewsSort('oldest');
                                            setCurrentReviewPage(1);
                                            setExpandedReviews(new Set());
                                        }}
                                        className={`cursor-pointer ${reviewsSort === 'oldest' ? (isDark ? 'bg-blue-600' : 'bg-blue-500/20') : (isDark ? 'hover:bg-gray-700' : '')} ${isDark ? 'text-white' : ''}`}
                                    >
                                        Oldest
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setReviewsSort('highest');
                                            setCurrentReviewPage(1);
                                            setExpandedReviews(new Set());
                                        }}
                                        className={`cursor-pointer ${reviewsSort === 'highest' ? (isDark ? 'bg-blue-600' : 'bg-blue-500/20') : (isDark ? 'hover:bg-gray-700' : '')} ${isDark ? 'text-white' : ''}`}
                                    >
                                        Highest Rating
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setReviewsSort('lowest');
                                            setCurrentReviewPage(1);
                                            setExpandedReviews(new Set());
                                        }}
                                        className={`cursor-pointer ${reviewsSort === 'lowest' ? (isDark ? 'bg-blue-600' : 'bg-blue-500/20') : (isDark ? 'hover:bg-gray-700' : '')} ${isDark ? 'text-white' : ''}`}
                                    >
                                        Lowest Rating
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {reviewsLoading && (
                            <div className={`py-6 text-center opacity-70 ${isDark ? 'text-gray-300' : ''}`}>Loading reviews...</div>
                        )}

                        {!reviewsLoading && reviews.length === 0 && (
                            <div className={`py-6 text-center opacity-70 ${isDark ? 'text-gray-300' : ''}`}>No reviews yet.</div>
                        )}

                        {!reviewsLoading && reviews.length > 0 && (
                            <>
                                <div className="space-y-4">
                                    {reviews.map((review) => {
                                        const isExpanded = expandedReviews.has(review.id);
                                        const contentLength = review.content?.length || 0;
                                        const shouldTruncate = contentLength > 300;
                                        const displayContent = shouldTruncate && !isExpanded
                                            ? review.content.substring(0, 300) + '...'
                                            : review.content;

                                        return (
                                            <Card key={review.id} className={`p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{review.username}</p>
                                                            <span className="text-sm flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-600">
                                                                ⭐ {review.rate}/10
                                                            </span>
                                                            {review.warning_spoilers && (
                                                                <Badge variant="destructive" className="text-xs">
                                                                    Spoiler Warning
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <h3 className={`font-medium text-base mb-2 ${isDark ? 'text-white' : 'text-black'}`}>{review.title}</h3>
                                                        <p className={`text-sm opacity-90 leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                                            {displayContent}
                                                        </p>
                                                        {shouldTruncate && (
                                                            <button
                                                                onClick={() => toggleReviewExpanded(review.id)}
                                                                className="mt-2 text-sm font-medium text-blue-500 hover:text-blue-600 transition"
                                                            >
                                                                {isExpanded ? 'Show less' : 'Show more'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className={`mt-2 text-xs opacity-60 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {new Date(review.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </Card>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {reviewsPagination && reviewsPagination.total_pages > 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-6">
                                        <Button
                                            onClick={() => handleReviewPageChange(currentReviewPage - 1)}
                                            disabled={currentReviewPage === 1}
                                            variant="outline"
                                            size="sm"
                                            className={isDark && currentReviewPage !== 1 ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : isDark ? 'bg-gray-800 border-gray-700 text-gray-500' : ''}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </Button>

                                        <span className="text-sm">
                                            Page {currentReviewPage} of {reviewsPagination.total_pages}
                                        </span>

                                        <Button
                                            onClick={() => handleReviewPageChange(currentReviewPage + 1)}
                                            disabled={currentReviewPage === reviewsPagination.total_pages}
                                            variant="outline"
                                            size="sm"
                                            className={isDark && currentReviewPage !== reviewsPagination.total_pages ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : isDark ? 'bg-gray-800 border-gray-700 text-gray-500' : ''}
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* ================= SIMILAR MOVIES ================= */}
                    {movie.similar_movies?.length > 0 && (
                        <div className={`rounded-xl border ${sectionBg} p-6`}>
                            <h2 className="text-xl font-semibold mb-4">🎞️ Similar Movies</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {paginatedSimilarMovies.map(sm => (
                                    <MovieCard
                                        key={sm.id}
                                        movie={sm}
                                        options={{ showRate: true, useCard: false }}
                                    />
                                ))}
                            </div>

                            {/* Pagination for similar movies */}
                            {totalSimilarPages > 1 && (
                                <div className="flex justify-center items-center gap-4 mt-6">
                                    <Button
                                        onClick={() => setCurrentSimilarPage(p => Math.max(1, p - 1))}
                                        disabled={currentSimilarPage === 1}
                                        variant="outline"
                                        size="sm"
                                        className={isDark && currentSimilarPage !== 1 ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : isDark ? 'bg-gray-800 border-gray-700 text-gray-500' : ''}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </Button>

                                    <span className="text-sm">
                                        Page {currentSimilarPage} of {totalSimilarPages}
                                    </span>

                                    <Button
                                        onClick={() => setCurrentSimilarPage(p => Math.min(totalSimilarPages, p + 1))}
                                        disabled={currentSimilarPage === totalSimilarPages}
                                        variant="outline"
                                        size="sm"
                                        className={isDark && currentSimilarPage !== totalSimilarPages ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : isDark ? 'bg-gray-800 border-gray-700 text-gray-500' : ''}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
