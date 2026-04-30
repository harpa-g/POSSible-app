import { NavLink, useNavigate } from 'react-router-dom';
import { Group, Anchor, Button, Badge, Text, Box } from '@mantine/core';
import { logout } from '../../services/auth.service';

export default function Navbar({ auth, onLogout }) {
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        onLogout();
        navigate('/login');
    }

    const linkStyle = (isActive) => ({
        fontWeight: isActive ? 600 : 400,
        color: isActive ? 'var(--mantine-color-terracotta-6)' : 'var(--mantine-color-warmGray-7)',
        textDecoration: 'none',
        paddingBottom: '4px',
        borderBottom: isActive ? '2px solid var(--mantine-color-terracotta-5)' : '2px solid transparent',
        transition: 'border 0.2s',
    });

    return (
        <Box
            component="nav"
            style={{
                backgroundColor: 'white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: '0 2rem',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Anchor component={NavLink} to="/home" underline="never" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d49b6a' }}>
                POSSible
            </Anchor>

            <Group gap="lg">
                <Anchor component={NavLink} to="/home" underline="never"
                    style={({ isActive }) => linkStyle(isActive)}>
                    Home
                </Anchor>
                {auth.isLoggedIn && (
                    <>
                        {auth.role === 'CUSTOMER' && (
                            <Anchor component={NavLink} to="/tab" underline="never"
                                style={({ isActive }) => linkStyle(isActive)}>
                                My Tab
                            </Anchor>
                        )}
                        {auth.role === 'SERVER' && (
                            <Anchor component={NavLink} to="/server" underline="never"
                                style={({ isActive }) => linkStyle(isActive)}>
                                Dashboard
                            </Anchor>
                        )}
                        {auth.role === 'OWNER' && (
                            <Anchor component={NavLink} to="/owner" underline="never"
                                style={({ isActive }) => linkStyle(isActive)}>
                                Owner Panel
                            </Anchor>
                        )}
                    </>
                )}
                {auth.isLoggedIn ? (
                    <Group gap="sm">
                        <Text size="sm" c="dimmed">{auth.username} ({auth.role})</Text>
                        <Button variant="outline" size="xs" color="warmGray.5" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Group>
                ) : (
                    <Anchor component={NavLink} to="/login" underline="never"
                        style={({ isActive }) => linkStyle(isActive)}>
                        Login
                    </Anchor>
                )}
            </Group>
        </Box>
    );
}