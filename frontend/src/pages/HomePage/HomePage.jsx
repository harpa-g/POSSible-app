import { Container, Title, Text, Button } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <Container size="sm" style={{ textAlign: 'center', marginTop: '5rem' }}>
            <Title order={1} c="terracotta.7">Welcome to POSSible</Title>
            <Text c="dimmed" size="lg" mt="md" mb="xl">
                A hospitality‑centred experience. No pressure, just appreciation.
            </Text>
            <Button component={Link} to="/tab" variant="filled" color="terracotta" size="md">
                View My Tab
            </Button>
        </Container>
    );
}