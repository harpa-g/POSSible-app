import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductList from './pages/ProductList';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import { placeOrderApi } from './services/order.service';
import { ProtectedRoute, AdminRoute } from './ProtectedRoute';

export default function App() {
    const [cart, setCart] = useState([]);
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
        setCart([]);
    }

    function handleAddToCart(product) {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
    }

    function handleRemove(productId) {
        setCart(prev => prev.filter(item => item.id !== productId));
    }

    function handleUpdateQty(productId, qty) {
        if (qty <= 0) {
            setCart(prev => prev.filter(item => item.id !== productId));
        } else {
            setCart(prev => prev.map(item =>
                item.id === productId ? { ...item, qty } : item
            ));
        }
    }

    async function handleCheckout() {
        try {
            const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
            await placeOrderApi(cart, totalPrice);
            setCart([]);
        } catch (e) {
            console.error('Checkout failed:', e);
        }
    }

    const itemCount = cart.reduce((total, item) => total + item.qty, 0);

    return (
        <BrowserRouter>
            <Navbar auth={auth} itemCount={itemCount} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/products" element={
                    <ProtectedRoute>
                        <ProductList onAddToCart={handleAddToCart} />
                    </ProtectedRoute>
                } />
                <Route path="/cart" element={
                    <ProtectedRoute>
                        <CartPage
                            cart={cart}
                            onRemove={handleRemove}
                            onUpdateQty={handleUpdateQty}
                            onCheckout={handleCheckout}
                        />
                    </ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminPage />
                    </AdminRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}
