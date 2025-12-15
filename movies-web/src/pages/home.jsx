import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import TopRevenueCarousel from '@/components/movie/TopRevenueCarousel';
import MostPopularCarousel from '@/components/movie/MostPopularCarousel';
import TopRatingCarousel from '@/components/movie/TopRatingCarousel';

export default function Body() {
    const { isDark } = useTheme();






    return (
        <main className={`w-[1200px] p-6 mt-1 min-h-[670px] transition-colors ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}>
            <TopRevenueCarousel />
            <MostPopularCarousel />
            <TopRatingCarousel />

        </main>
    )
}