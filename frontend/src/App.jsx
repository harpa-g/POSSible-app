import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import CustomerTabPage from './pages/CustomerTabPage/CustomerTabPage';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess';
import ServerDashboard from './pages/ServerDashboard/ServerDashboard';
import OwnerDashboard from './pages/OwnerDashboard/OwnerDashboard';
import { ProtectedRoute, CustomerRoute, ServerRoute, OwnerRoute } from './ProtectedRoute';

// Warm hospitality colour palette
const theme = createTheme({
    primaryColor: 'terracotta',
    colors: {
        terracotta: [
            '#fdf3ec', '#f9e1d2', '#f2c7a8', '#e8a579', '#d49b6a',
            '#c28650', '#a66f44', '#8c5636', '#73442b', '#5c3622'
        ],
        warmGray: [
            '#faf8f5', '#f0ece6', '#e3dcd3', '#d0c8bd', '#b8ad9f',
            '#9d9081', '#807366', '#665a4f', '#4d433b', '#362e27'
        ]
    },
    fontFamily: 'Inter, sans-serif',
    headings: { fontFamily: 'Inter, sans-serif' },
    defaultRadius: 'md',
});

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
        <MantineProvider theme={theme}>
            <BrowserRouter>
                <Navbar auth={auth} onLogout={handleLogout} />
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
            </BrowserRouter>
        </MantineProvider>
    );
}