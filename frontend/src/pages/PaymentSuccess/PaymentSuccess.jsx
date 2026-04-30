import { useSearchParams } from 'react-router-dom';
import { Container, Title, Text, Button } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const table = searchParams.get('table');
    const amount = searchParams.get('amount');

    return (
        <Container size="xs" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Title order={2} c="green.7">Payment Successful!</Title>
            <Text size="lg" mt="md">Table {table} – you paid €{parseFloat(amount).toFixed(2)}</Text>
            <Text c="dimmed" mt="sm">Thank you for dining with us. Your server appreciates you.</Text>
            <Button component={Link} to="/home" variant="outline" color="terracotta" mt="xl">
                Back to Home
            </Button>
        </Container>
    );
}