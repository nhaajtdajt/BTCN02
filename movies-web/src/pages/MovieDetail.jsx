import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getMovieDetail } from '@/service/api';

export default function MovieDetail() {
    const { id } = useParams();
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

    return (
        <div className={`w-[1200px] p-6 min-h-[600px] transition-colors ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            {loading && <div className="py-6 text-sm opacity-80">Loading movie...</div>}
            {error && <div className="py-6 text-sm text-red-500">{error}</div>}

            {!loading && !error && movie && (
                <div className="flex gap-6">
                    <div className="w-[280px] flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                        {movie.image ? (
                            <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="h-full flex items-center justify-center text-sm opacity-70">No image</div>
                        )}
                    </div>

                    <div className="flex-1 space-y-3">
                        <div>
                            <h1 className="text-2xl font-bold leading-tight">{movie.title}</h1>
                            {movie.year && <p className="text-sm opacity-80">{movie.year}</p>}
                            {movie.rate && <p className="text-sm mt-1">Rating: {movie.rate}</p>}
                        </div>

                        {movie.genres?.length > 0 && (
                            <div className="flex flex-wrap gap-2 text-sm">
                                {movie.genres.map((g) => (
                                    <span key={g} className="px-2 py-1 rounded bg-blue-600/80 text-white">{g}</span>
                                ))}
                            </div>
                        )}

                        {movie.runtime && <p className="text-sm">Runtime: {movie.runtime}</p>}

                        {movie.short_description && <p className="text-sm opacity-90">{movie.short_description}</p>}
                        {movie.plot_full && <p className="text-sm opacity-90">{movie.plot_full}</p>}

                        {movie.directors?.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-1">Directors</h3>
                                <div className="flex flex-wrap gap-3 text-sm">
                                    {movie.directors.map((d) => (
                                        <span key={d.id || d.name} className="px-2 py-1 rounded bg-gray-200 text-black">
                                            {d.name}{d.role ? ` (${d.role})` : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {movie.actors?.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-1">Actors</h3>
                                <div className="flex flex-wrap gap-3 text-sm">
                                    {movie.actors.map((a) => (
                                        <span key={a.id || a.name} className="px-2 py-1 rounded bg-gray-200 text-black">
                                            {a.name}{a.character ? ` as ${a.character}` : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {movie.similar_movies?.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-2">Similar Movies</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {movie.similar_movies.map((sm) => (
                                        <div key={sm.id} className={`flex gap-2 rounded border p-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <div className="w-12 h-16 bg-gray-200 overflow-hidden rounded">
                                                {sm.image ? (
                                                    <img src={sm.image} alt={sm.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] opacity-70">No image</div>
                                                )}
                                            </div>
                                            <div className="text-sm">
                                                <div className="font-semibold leading-tight">{sm.title}</div>
                                                {sm.year && <div className="opacity-80">{sm.year}</div>}
                                                {sm.rate && <div className="opacity-80">★ {sm.rate}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
