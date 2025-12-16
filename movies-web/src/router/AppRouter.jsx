import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Home from '@/pages/home';
import Search from '@/pages/Search';
import MovieDetail from '@/pages/MovieDetail';
import Person from '@/pages/Person';
import LoginRedirect from '@/components/auth/LoginRedirect';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Favorites from '@/pages/Favorites';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'search',
                element: <Search />,
            },
            {
                path: 'movie/:id',
                element: <MovieDetail />,
            },
            {
                path: 'person/:id',
                element: <Person />,
            },
            {
                path: 'login',
                element: <LoginRedirect />,
            },
            {
                path: 'register',
                element: <Register />,
            },
            {
                path: 'profile',
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'favorites',
                element: (
                    <ProtectedRoute>
                        <Favorites />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export default router;
