import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <Container className="text-center my-5">
            <h1 style={{ color: '#d49b6a' }}>Welcome to POSSible</h1>
            <p className="text-muted lead">A hospitality‑centred experience. No pressure, just appreciation.</p>
            <Button as={Link} to="/tab" size="lg" style={{ backgroundColor: '#d49b6a', borderColor: '#d49b6a' }}>
                View My Tab
            </Button>
        </Container>
    );
}