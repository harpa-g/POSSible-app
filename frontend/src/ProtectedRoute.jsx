import { Navigate } from 'react-router-dom';
import { isLoggedIn, isCustomer, isServer, isOwner } from './services/auth.service';

export function ProtectedRoute({ children }) {
    if (!isLoggedIn()) return <Navigate to="/login" replace />;
    return children;
}

export function CustomerRoute({ children }) {
    if (!isLoggedIn()) return <Navigate to="/login" replace />;
    if (!isCustomer()) return <Navigate to="/home" replace />;
    return children;
}

export function ServerRoute({ children }) {
    if (!isLoggedIn()) return <Navigate to="/login" replace />;
    if (!isServer()) return <Navigate to="/home" replace />;
    return children;
}

export function OwnerRoute({ children }) {
    if (!isLoggedIn()) return <Navigate to="/login" replace />;
    if (!isOwner()) return <Navigate to="/home" replace />;
    return children;
}