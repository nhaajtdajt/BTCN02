import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Login from '@/pages/Login';

export default function LoginRedirect() {
    const { isAuthenticated } = useAuth();

    // If already logged in, go to home
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Otherwise show login page
    return <Login />;
}
