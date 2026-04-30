import { Link } from 'react-router-dom';
import { isLoggedIn } from '../../services/auth.service';
import styles from './HomePage.module.css';

export default function HomePage() {
    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Hello</h1>
            <p className={styles.subtitle}>Welcome to WAD Shop.</p>
            {isLoggedIn()
                ? <Link to="/products" className="btn-primary">Shop Now</Link>
                : <Link to="/login" className="btn-primary">Login to Shop</Link>
            }
        </div>
    );
}
