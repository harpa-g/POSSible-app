import { Card, Button } from 'react-bootstrap';

export default function MenuItem({ item, onAddToTab }) {
    return (
        <Card className="mb-2">
            <Card.Body className="d-flex align-items-center gap-3 p-2">
                <img
                    src={item.image}
                    alt={item.name}
                    width="60"
                    height="60"
                    className="rounded"
                    style={{ objectFit: 'cover' }}
                />
                <div className="flex-grow-1">
                    <Card.Title className="mb-0 fs-6">{item.name}</Card.Title>
                    <Card.Text className="text-muted small mb-1">{item.description}</Card.Text>
                    <span className="fw-bold" style={{ color: '#d49b6a' }}>€{item.price.toFixed(2)}</span>
                </div>
                <Button
                    size="sm"
                    style={{ backgroundColor: '#d49b6a', borderColor: '#d49b6a' }}
                    onClick={() => onAddToTab(item.id)}
                >
                    Add
                </Button>
            </Card.Body>
        </Card>
    );
}