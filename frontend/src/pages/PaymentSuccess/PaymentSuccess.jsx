import { useSearchParams } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const table = searchParams.get('table');
    const amount = searchParams.get('amount');

    return (
        <Container className="text-center my-5">
            <h2 className="text-success">Payment Successful!</h2>
            <p className="lead">Table {table} – you paid €{parseFloat(amount).toFixed(2)}</p>
            <p className="text-muted">Thank you for dining with us. Your server appreciates you.</p>
            <Button as={Link} to="/home" variant="outline" style={{ borderColor: '#d49b6a', color: '#d49b6a' }}>Back to Home</Button>
        </Container>
    );
}