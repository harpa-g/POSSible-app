import { useEffect, useState } from 'react';
import { Container, Title, Card, Text, Group, Button, Badge, Stack } from '@mantine/core';
import { getPendingFeedbacks, acknowledgeFeedback } from '../../services/server.service';

export default function ServerDashboard() {
    const [feedbacks, setFeedbacks] = useState([]);

    async function load() {
        const data = await getPendingFeedbacks();
        setFeedbacks(data);
    }

    useEffect(() => { load(); }, []);

    async function handleAcknowledge(id) {
        const ok = await acknowledgeFeedback(id);
        if (ok) load();
    }

    return (
        <Container size="md" my="xl">
            <Title order={1} mb="lg">Server Dashboard – Removals needing attention</Title>
            {feedbacks.length === 0 && <Text c="dimmed">No pending removals.</Text>}
            <Stack gap="sm">
                {feedbacks.map(f => (
                    <Card key={f.id} shadow="xs" padding="md" radius="md" withBorder>
                        <Group justify="space-between" align="center">
                            <div>
                                <Text size="sm" fw={500}>Item ID: {f.menuItemId}</Text>
                                <Text size="xs" c="dimmed">Reason: {f.reason}</Text>
                            </div>
                            <Button
                                variant="light"
                                color="terracotta"
                                size="xs"
                                onClick={() => handleAcknowledge(f.id)}
                            >
                                Resolved
                            </Button>
                        </Group>
                    </Card>
                ))}
            </Stack>
        </Container>
    );
}