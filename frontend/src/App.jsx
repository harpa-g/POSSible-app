import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CustomerTabPage from './pages/CustomerTabPage';
import PaymentSuccess from './pages/PaymentSuccess';
import ServerDashboard from './pages/ServerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import { ProtectedRoute, CustomerRoute, ServerRoute, OwnerRoute } from './ProtectedRoute';

export default function App() {
    const [auth, setAuth] = useState({
        isLoggedIn: !!localStorage.getItem('token'),
        username: localStorage.getItem('username') || '',
        role: localStorage.getItem('role') || '',
    });

    function handleLoginSuccess(data) {
        setAuth({ isLoggedIn: true, username: data.username, role: data.role });
    }

    function handleLogout() {
        setAuth({ isLoggedIn: false, username: '', role: '' });
        localStorage.clear();
    }

    return (
        <BrowserRouter>
            <Navbar auth={auth} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

                {/* Customer routes */}
                <Route path="/tab" element={
                    <CustomerRoute>
                        <CustomerTabPage />
                    </CustomerRoute>
                } />
                <Route path="/payment-success" element={
                    <CustomerRoute>
                        <PaymentSuccess />
                    </CustomerRoute>
                } />

                {/* Server route */}
                <Route path="/server" element={
                    <ServerRoute>
                        <ServerDashboard />
                    </ServerRoute>
                } />

                {/* Owner route */}
                <Route path="/owner" element={
                    <OwnerRoute>
                        <OwnerDashboard />
                    </OwnerRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </BrowserRouter>
    );
}