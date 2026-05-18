import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveAuth } from '../../services/auth.service';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

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
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow-sm">
                <Card.Body>
                    <h2 className="text-center mb-4" style={{ color: '#d49b6a' }}>Login to POSSible</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Button type="submit" className="w-100" disabled={loading}
                            style={{ backgroundColor: '#d49b6a', borderColor: '#d49b6a' }}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>
                    <p className="text-muted small text-center mt-3">
                        customer / customer &nbsp;|&nbsp; server / server &nbsp;|&nbsp; owner / owner
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
}