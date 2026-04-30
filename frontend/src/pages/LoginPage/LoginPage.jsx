import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveAuth } from '../../services/auth.service';
import { Paper, Title, TextInput, PasswordInput, Button, Alert, Text } from '@mantine/core';

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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Paper radius="lg" withBorder shadow="md" p="xl" style={{ width: '100%', maxWidth: 380 }}>
                <Title order={2} ta="center" mb="md" c="terracotta.7">Login to POSSible</Title>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Username"
                        placeholder="your username"
                        value={username}
                        onChange={(e) => setUsername(e.currentTarget.value)}
                        required
                        autoFocus
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="your password"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        required
                        mt="sm"
                    />
                    {error && <Alert color="red" mt="sm">{error}</Alert>}
                    <Button type="submit" fullWidth mt="md" loading={loading} color="terracotta">
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                <Text c="dimmed" size="xs" ta="center" mt="md">
                    customer / customer &nbsp; | &nbsp; server / server &nbsp; | &nbsp; owner / owner
                </Text>
            </Paper>
        </div>
    );
}