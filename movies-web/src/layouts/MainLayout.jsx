import { Outlet } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/layout/header';
import Nav from '@/components/layout/nav';
import Footer from '@/components/layout/footer';

export default function MainLayout() {
    const { isDark } = useTheme();

    return (
        <div className={`flex justify-center items-center flex-col min-h-screen transition-colors ${isDark ? 'bg-gray-900' : 'bg-gray-100'
            }`}>
            <Header />
            <Nav />
            <Outlet />
            <Footer />
        </div>
    );
}
