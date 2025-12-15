import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getMovieDetail } from '@/service/api';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        <div className={`min-w-[1200px] mx-auto p-6 transition-colors ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
            <div className="mb-4 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className={`px-3 py-1.5 rounded-md text-sm shadow-sm hover:shadow transition ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                >
                    ← Back
                </button>
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
                                    if (val>10) val = val / 10;
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
                                    <Badge key={d.id || d.name} variant="outline">
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
                                        className={`flex gap-3 p-4 rounded-lg transition hover:-translate-y-1 hover:shadow-lg
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
                    {movie.reviews?.length > 0 && (
                        <div className={`rounded-xl border ${sectionBg} p-6`}>
                            <h2 className="text-xl font-semibold mb-4">📝 User Reviews</h2>
                            <div className="space-y-4">
                                {movie.reviews.map((r, idx) => (
                                    <div key={idx} className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold">{r.user}</p>
                                            <p className="text-sm flex items-center gap-1">⭐ {r.rate}</p>
                                        </div>
                                        <p className="mt-1 font-medium">{r.title}</p>
                                        <p className="mt-1 text-sm opacity-90 leading-relaxed">{r.content}</p>
                                        <p className="mt-1 text-xs opacity-60">
                                            {new Date(r.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ================= SIMILAR MOVIES ================= */}
                    {movie.similar_movies?.length > 0 && (
                        <div className={`rounded-xl border ${sectionBg} p-6`}>
                            <h2 className="text-xl font-semibold mb-4">🎞️ Similar Movies</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {movie.similar_movies.map(sm => (
                                    <div
                                        key={sm.id}
                                        onClick={() => sm.id && navigate(`/movie/${sm.id}`)}
                                        className={`cursor-pointer rounded-lg overflow-hidden border transition hover:-translate-y-1 hover:shadow ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
                                    >
                                        <AspectRatio ratio={2 / 3} className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                            {sm.image ? (
                                                <img src={sm.image} alt={sm.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs opacity-70">No image</div>
                                            )}
                                        </AspectRatio>
                                        <div className="p-2 text-sm">
                                            <p className="font-semibold leading-tight">{sm.title}</p>
                                            {sm.year && <p className="opacity-70">{sm.year}</p>}
                                            {sm.rate && <p className="opacity-70">★ {sm.rate}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
