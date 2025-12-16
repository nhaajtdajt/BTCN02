import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Redirects unauthenticated users to login for protected sections (e.g., profile, favorites)
export default function ProtectedAuth({ children }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}