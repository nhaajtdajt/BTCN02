import { AspectRatio } from '@/components/ui/aspect-ratio';
import { User } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

/**
 * Reusable PersonImage component with User icon fallback for broken/missing images
 * @param {string} src - Image source URL
 * @param {string} alt - Image alt text
 * @param {string} className - Additional CSS classes
 * @param {number} ratio - AspectRatio value (default: 2/3)
 */
export default function PersonImage({ src, alt, className = '', ratio = 2 / 3 }) {
    const { isDark } = useTheme();

    return (
        <AspectRatio ratio={ratio} className={`${className} ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '';
                        e.currentTarget.style.display = 'none';

                        const placeholder = e.currentTarget.parentElement?.querySelector('.person-fallback');
                        if (placeholder) placeholder.style.display = 'flex';
                    }}
                />
            ) : null}
            <div className="person-fallback w-full h-full hidden items-center justify-center text-gray-500">
                <User className="w-12 h-12" />
            </div>
        </AspectRatio>
    );
}
