import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import CustomerTabPage from './pages/CustomerTabPage/CustomerTabPage';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess';
import ServerDashboard from './pages/ServerDashboard/ServerDashboard';
import OwnerDashboard from './pages/OwnerDashboard/OwnerDashboard';
import { CustomerRoute, ServerRoute, OwnerRoute } from './ProtectedRoute';

const themeColors = {
  terracotta: '#d49b6a',
  terracottaHover: '#c28650',
  warmGrayBg: '#faf8f5',
  softWhite: '#ffffff',
  textDark: '#2e2e2e',
  textMuted: '#888',
};

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
            <AppNavbar auth={auth} onLogout={handleLogout} />
            <div style={{ backgroundColor: themeColors.warmGrayBg, minHeight: '90vh', paddingBottom: '2rem' }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/tab" element={<CustomerRoute><CustomerTabPage /></CustomerRoute>} />
                    <Route path="/payment-success" element={<CustomerRoute><PaymentSuccess /></CustomerRoute>} />
                    <Route path="/server" element={<ServerRoute><ServerDashboard /></ServerRoute>} />
                    <Route path="/owner" element={<OwnerRoute><OwnerDashboard /></OwnerRoute>} />
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}