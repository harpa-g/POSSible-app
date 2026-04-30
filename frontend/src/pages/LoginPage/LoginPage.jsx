import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveAuth } from '../../services/auth.service';
import styles from './LoginPage.module.css';

export default function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await login(username, password);
            saveAuth(data);
            onLoginSuccess(data);
            // Redirect based on role
            if (data.role === 'CUSTOMER') navigate('/tab');
            else if (data.role === 'SERVER') navigate('/server');
            else if (data.role === 'OWNER') navigate('/owner');
            else navigate('/home');
        } catch {
            setError('Invalid credentials.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>Login to POSSible</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
                    </div>
                    <div className={styles.field}>
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className={styles.hint}>
                    customer / customer &nbsp; | &nbsp; server / server &nbsp; | &nbsp; owner / owner
                </p>
            </div>
        </div>
    );
}