import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { logout } from '../../services/auth.service';

export default function AppNavbar({ auth, onLogout }) {
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        onLogout();
        navigate('/login');
    }

    return (
        <Navbar bg="white" expand="md" sticky="top" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <Container>
                <Navbar.Brand as={NavLink} to="/home" style={{ fontWeight: 700, color: '#d49b6a', fontSize: '1.5rem' }}>
                    POSSible
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/home">Home</Nav.Link>
                        {auth.isLoggedIn && auth.role === 'CUSTOMER' && (
                            <Nav.Link as={NavLink} to="/tab">My Tab</Nav.Link>
                        )}
                        {auth.isLoggedIn && auth.role === 'SERVER' && (
                            <Nav.Link as={NavLink} to="/server">Dashboard</Nav.Link>
                        )}
                        {auth.isLoggedIn && auth.role === 'OWNER' && (
                            <Nav.Link as={NavLink} to="/owner">Owner Panel</Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {auth.isLoggedIn ? (
                            <>
                                <Navbar.Text className="me-2 text-muted">
                                    {auth.username} ({auth.role})
                                </Navbar.Text>
                                <Button variant="outline-secondary" size="sm" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}