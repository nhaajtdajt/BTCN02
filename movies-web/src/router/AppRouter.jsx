import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Home from '@/pages/home';
import Search from '@/pages/Search';
import MovieDetail from '@/pages/MovieDetail';
import Person from '@/pages/Person';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Favorites from '@/pages/Favorites';

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
                element: <Login />,
            },
            {
                path: 'register',
                element: <Register />,
            },
            {
                path: 'profile',
                element: <Profile />,
            },
            {
                path: 'favorites',
                element: <Favorites />,
            },
        ],
    },
]);

export default router;
