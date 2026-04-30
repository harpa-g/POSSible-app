import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth.service';
import styles from './Navbar.module.css';

export default function Navbar({ auth, onLogout }) {
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        onLogout();
        navigate('/login');
    }

    return (
        <nav className={styles.navbar}>
            <NavLink to="/home" className={styles.brand}>POSSible</NavLink>
            <div className={styles.links}>
                <NavLink to="/home" className={({ isActive }) => isActive ? styles.active : styles.link}>
                    Home
                </NavLink>
                {auth.isLoggedIn && (
                    <>
                        {auth.role === 'CUSTOMER' && (
                            <NavLink to="/tab" className={({ isActive }) => isActive ? styles.active : styles.link}>
                                My Tab
                            </NavLink>
                        )}
                        {auth.role === 'SERVER' && (
                            <NavLink to="/server" className={({ isActive }) => isActive ? styles.active : styles.link}>
                                Dashboard
                            </NavLink>
                        )}
                        {auth.role === 'OWNER' && (
                            <NavLink to="/owner" className={({ isActive }) => isActive ? styles.active : styles.link}>
                                Owner Panel
                            </NavLink>
                        )}
                    </>
                )}
                {auth.isLoggedIn ? (
                    <div className={styles.userInfo}>
                        <span className={styles.username}> {auth.username} ({auth.role})</span>
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