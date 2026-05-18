import { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { getPendingFeedbacks, acknowledgeFeedback } from '../../services/server.service';

export default function ServerDashboard() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        const data = await getPendingFeedbacks();
        setFeedbacks(data);
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function handleAcknowledge(id) {
        const ok = await acknowledgeFeedback(id);
        if (ok) load();
    }

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <Container className="py-4">
            <h1 className="mb-4">Server Dashboard – Removals needing attention</h1>
            {feedbacks.length === 0 && <p className="text-muted">No pending removals.</p>}
            {feedbacks.map(f => (
                <Card key={f.id} className="mb-2">
                    <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Item ID:</strong> {f.menuItemId}<br />
                            <span className="text-muted">Reason: {f.reason}</span>
                        </div>
                        <Button size="sm" onClick={() => handleAcknowledge(f.id)}
                            style={{ backgroundColor: '#d49b6a', borderColor: '#d49b6a' }}>
                            Resolved
                        </Button>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
}