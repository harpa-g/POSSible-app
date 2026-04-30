import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth.service';
import styles from './Navbar.module.css';

export default function Navbar({ auth, itemCount, onLogout }) {
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        onLogout();
        navigate('/login');
    }

    return (
        <nav className={styles.navbar}>
            <NavLink to="/home" className={styles.brand}>WAD Shop</NavLink>
            <div className={styles.links}>
                <NavLink to="/home" className={({ isActive }) => isActive ? styles.active : styles.link}>
                    Home
                </NavLink>
                {auth.isLoggedIn && (
                    <>
                        <NavLink to="/products" className={({ isActive }) => isActive ? styles.active : styles.link}>
                            Products
                        </NavLink>
                        <NavLink to="/cart" className={({ isActive }) => isActive ? styles.active : styles.link}>
                            Cart {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
                        </NavLink>
                        {auth.role === 'ROLE_ADMIN' && (
                            <NavLink to="/admin" className={({ isActive }) => isActive ? styles.active : styles.link}>
                                Admin
                            </NavLink>
                        )}
                    </>
                )}
                {auth.isLoggedIn ? (
                    <div className={styles.userInfo}>
                        <span className={styles.username}> {auth.username}</span>
                        <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <NavLink to="/login" className={({ isActive }) => isActive ? styles.active : styles.link}>
                        Login
                    </NavLink>
                )}
            </div>
        </nav>
    );
}
