import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function LoginRedirect() {
    const { isAuthenticated } = useAuth();

    // If already logged in, go to profile; otherwise go to register
    if (isAuthenticated) {
        return <Navigate to="/profile" replace />;
    }

    return <Navigate to="/register" replace />;
}
