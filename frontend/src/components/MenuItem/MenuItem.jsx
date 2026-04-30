import { Card, Image, Text, Group, Button } from '@mantine/core';

export default function MenuItem({ item, onAddToTab }) {
    return (
        <Card shadow="xs" padding="sm" radius="md" withBorder>
            <Group wrap="nowrap" gap="sm">
                <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    radius="md"
                    fit="cover"
                    style={{ minWidth: 60 }}
                />
                <div style={{ flex: 1 }}>
                    <Text fw={600} size="sm">{item.name}</Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>{item.description}</Text>
                    <Text fw={600} c="terracotta.6" size="sm">€{item.price.toFixed(2)}</Text>
                </div>
                <Button
                    variant="light"
                    color="terracotta"
                    size="xs"
                    radius="md"
                    onClick={() => onAddToTab(item.id)}
                >
                    Add to tab
                </Button>
            </Group>
        </Card>
    );
}