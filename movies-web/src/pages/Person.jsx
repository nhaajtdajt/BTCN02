import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getPersonDetail } from '@/service/api';
import MovieCard from '@/components/common/MovieCard';
import PersonImage from '@/components/common/PersonImage';

export default function Person() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;
        async function load() {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const data = await getPersonDetail(id);
                if (!ignore) setPerson(data);
            } catch (err) {
                if (!ignore) setError(err.message || 'Failed to load person');
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => { ignore = true; };
    }, [id]);

    const sectionBg = isDark ? 'bg-gray-900/70 border-gray-800' : 'bg-white border-gray-200';

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className={`w-[1200px] mx-auto p-6 transition-colors ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
            <div className="mb-4 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className={`px-3 py-1.5 rounded-md text-sm shadow-sm hover:shadow-lg transition ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                >
                    ← Back
                </button>
                {person?.name && (
                    <span className="text-xs opacity-60">{person.name} • {person.role}</span>
                )}
            </div>

            {loading && <div className="py-10 text-center opacity-70">Loading person...</div>}
            {error && <div className="py-10 text-center text-red-500">{error}</div>}

            {!loading && !error && person && (
                <div className="space-y-10">

                    {/* ================= HERO SECTION ================= */}
                    <div className="relative rounded-xl overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-30"
                            style={{ backgroundImage: `url(${person.image})` }}
                        />
                        <div className={`relative flex gap-6 p-6 rounded-xl border ${sectionBg}`}>

                            {/* Poster */}
                            <div className="w-[240px] shrink-0">
                                <PersonImage
                                    src={person.image}
                                    alt={person.name}
                                    className="rounded-lg overflow-hidden shadow-lg"
                                    ratio={2 / 3}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h1 className="text-4xl font-bold leading-tight">{person.name}</h1>
                                    <p className="text-lg opacity-80 mt-1">{person.role}</p>
                                </div>

                                <div className="space-y-2 text-sm opacity-90">
                                    {person.birth_date && (
                                        <p>
                                            <span className="font-semibold">Born:</span> {formatDate(person.birth_date)}
                                        </p>
                                    )}
                                    {person.death_date && (
                                        <p>
                                            <span className="font-semibold">Died:</span> {formatDate(person.death_date)}
                                        </p>
                                    )}
                                    {person.height && (
                                        <p>
                                            <span className="font-semibold">Height:</span> {person.height}
                                        </p>
                                    )}
                                </div>

                                {person.summary && (
                                    <div className="text-sm leading-relaxed opacity-90 pt-2">
                                        {person.summary}
                                    </div>
                                )}

                                {person.awards && (
                                    <div className={`p-3 rounded-lg border ${sectionBg} flex items-center gap-2`}>
                                        <span className="text-yellow-400 text-lg">🏆</span>
                                        <span className="text-sm">{person.awards}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ================= KNOWN FOR ================= */}
                    {person.known_for?.length > 0 && (
                        <div className={`rounded-xl border ${sectionBg} p-6`}>
                            <h2 className="text-xl font-semibold mb-4">🎬 Known For</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {person.known_for.map((movie) => (
                                    <MovieCard
                                        key={`${movie.id}-${movie.role}`}
                                        movie={movie}
                                        options={{
                                            showRate: false,
                                            role: movie.role,
                                            character: movie.character,
                                            useCard: false
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
