import { Navigate } from 'react-router-dom';
import { isLoggedIn, isAdmin } from './services/auth.service';

export function ProtectedRoute({ children }) {
    if (!isLoggedIn()) return <Navigate to="/login" replace />;
    return children;
}

export function AdminRoute({ children }) {
    if (!isLoggedIn()) return <Navigate to="/login" replace />;
    if (!isAdmin()) return <Navigate to="/home" replace />;
    return children;
}
