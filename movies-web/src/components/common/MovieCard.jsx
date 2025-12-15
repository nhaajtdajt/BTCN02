import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Film } from 'lucide-react';

/**
 * Reusable MovieCard component for displaying movie information
 * @param {Object} movie - Movie data object
 * @param {Object} options - Display options
 * @param {boolean} options.showGenres - Show genre badges
 * @param {boolean} options.showRate - Show rating
 * @param {string} options.role - Actor/Director role to display (from known_for)
 * @param {string} options.character - Character name to display (from known_for)
 * @param {boolean} options.useCard - Wrap in Card component (default: true)
 */
export default function MovieCard({ movie, options = {} }) {
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const {
        showGenres = false,
        showRate = true,
        role = null,
        character = null,
        useCard = true
    } = options;

    const handleClick = () => {
        if (movie.id) {
            navigate(`/movie/${movie.id}`);
        }
    };

    const cardClasses = `cursor-pointer rounded-lg overflow-hidden border transition hover:-translate-y-1 hover:scale-110 transition-transform hover:shadow-lg ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`;

    const posterContent = (
        <AspectRatio ratio={2 / 3} className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            {movie.image ? (
                <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '';
                        e.currentTarget.style.display = 'none';

                        const placeholder = e.currentTarget.parentElement?.querySelector('.poster-fallback');
                        if (placeholder) placeholder.style.display = 'flex';
                    }}
                />
            ) : null}
            <div className="poster-fallback w-full h-full hidden items-center justify-center text-gray-500">
                <Film className="w-10 h-10" />
            </div>
        </AspectRatio>
    );

    const infoContent = (
        <div className="p-2 space-y-1">
            <p className={`font-semibold text-sm leading-tight line-clamp-2 ${isDark ? 'text-white' : 'text-black'
                }`}>
                {movie.title}
            </p>

            <div className="flex items-center justify-between text-xs opacity-70">
                {movie.year && (
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {movie.year}
                    </span>
                )}
                {showRate && movie.rate && (
                    <span className={`flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        ⭐ {movie.rate}
                    </span>
                )}
                {role && (
                    <Badge variant="secondary" className="text-xs">
                        {role}
                    </Badge>
                )}
            </div>

            {character && (
                <p className="text-xs opacity-70">as {character}</p>
            )}

            {showGenres && movie.genres?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {movie.genres.slice(0, 2).map((g) => (
                        <span
                            key={g}
                            className={`text-[10px] px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            {g}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );

    if (useCard) {
        return (
            <Card onClick={handleClick} className={cardClasses}>
                {posterContent}
                <CardContent className="p-3">
                    {infoContent}
                </CardContent>
            </Card>
        );
    }

    return (
        <div onClick={handleClick} className={cardClasses}>
            {posterContent}
            {infoContent}
        </div>
    );
}
