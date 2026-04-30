import { useEffect, useState } from 'react';
import { Container, Grid, Card, Title, Text, Group, Button, Badge, TextInput, Paper, Notification, rem } from '@mantine/core';
import { getMenuItems } from '../../services/menuItem.service';
import { getTab, addToTab, removeItemFromTab } from '../../services/tab.service';
import { createPayment } from '../../services/payment.service';
import MenuItem from '../../components/MenuItem/MenuItem';
import { IconCheck } from '@tabler/icons-react';

const TABLE_NUMBER = 1; // In a real app, this would be dynamic or entered by the customer

export default function CustomerTabPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [tab, setTab] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [message, setMessage] = useState('');
    const [msgColor, setMsgColor] = useState('green');

    useEffect(() => {
        getMenuItems().then(setMenuItems);
        loadTab();
    }, []);

    async function loadTab() {
        try {
            const data = await getTab(TABLE_NUMBER);
            setTab(data);
        } catch (e) {
            console.error(e);
        }
    }

    async function handleAddToTab(menuItemId) {
        try {
            const updated = await addToTab(TABLE_NUMBER, menuItemId);
            setTab(updated);
            setMsgColor('green');
            setMessage('Item added to tab.');
        } catch (e) {
            setMsgColor('red');
            setMessage('Failed to add item.');
        }
    }

    async function handleRemove(menuItemId) {
        const reason = prompt('Why are you removing this item?');
        if (!reason) return;
        const ok = await removeItemFromTab(TABLE_NUMBER, menuItemId, reason);
        if (ok) {
            setMsgColor('green');
            setMessage('Item removed. Server has been notified.');
            loadTab();
        } else {
            setMsgColor('red');
            setMessage('Removal failed.');
        }
    }

    async function handlePay() {
        const billTotal = tab?.totalBill || 0;
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount < billTotal) {
            setMsgColor('red');
            setMessage(`Amount must be at least €${billTotal.toFixed(2)}`);
            return;
        }
        try {
            const result = await createPayment(TABLE_NUMBER, amount);
            window.location.href = result.redirectUrl;
        } catch (e) {
            setMsgColor('red');
            setMessage('Payment failed: ' + e.message);
        }
    }

    if (!tab) return <Text align="center" mt="xl">Loading tab...</Text>;

    const activeItems = tab.items.filter(i => i.status === 'ACTIVE');
    const removedItems = tab.items.filter(i => i.status === 'REMOVED');

    return (
        <Container size="xl" my="xl">
            <Title order={1} mb="lg">Your Tab (Table {TABLE_NUMBER})</Title>
            {message && (
                <Notification
                    icon={<IconCheck style={{ width: rem(18), height: rem(18) }} />}
                    color={msgColor}
                    onClose={() => setMessage('')}
                    mb="md"
                    withCloseButton
                >
                    {message}
                </Notification>
            )}

            <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={3} mb="md">Menu</Title>
                        {menuItems.map(item => (
                            <MenuItem key={item.id} item={item} onAddToTab={handleAddToTab} />
                        ))}
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={3} mb="md">Your current order</Title>
                        {activeItems.length === 0 ? (
                            <Text c="dimmed">No items yet.</Text>
                        ) : (
                            activeItems.map(item => (
                                <Group key={item.menuItemId} justify="space-between" py="xs" style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <Text size="sm">{item.name} – €{item.price.toFixed(2)}</Text>
                                    <Button
                                        variant="subtle"
                                        color="red"
                                        size="xs"
                                        onClick={() => handleRemove(item.menuItemId)}
                                    >
                                        Remove
                                    </Button>
                                </Group>
                            ))
                        )}

                        {removedItems.length > 0 && (
                            <>
                                <Title order={4} mt="md" c="dimmed">Removed items</Title>
                                {removedItems.map(item => (
                                    <Text key={item.menuItemId} size="xs" c="dimmed" fs="italic" py="xs">
                                        {item.name} – reason: {item.removalReason || 'No reason given'}
                                    </Text>
                                ))}
                            </>
                        )}

                        <Group justify="flex-end" mt="lg">
                            <Text fw={700} size="lg">Bill total: €{tab.totalBill.toFixed(2)}</Text>
                        </Group>

                        <Paper bg="warmGray.0" p="md" radius="md" mt="md">
                            <TextInput
                                type="number"
                                step="0.01"
                                min={tab.totalBill}
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.currentTarget.value)}
                                placeholder="Enter amount to pay"
                                rightSection={<Text size="sm" c="dimmed">€</Text>}
                                styles={{ input: { fontSize: '1rem' } }}
                            />
                            <Button
                                fullWidth
                                mt="sm"
                                size="md"
                                color="terracotta"
                                onClick={handlePay}
                                disabled={!paymentAmount}
                            >
                                Pay with Revolut
                            </Button>
                            <Badge color="gray.6" variant="light" mt="xs" style={{ fontStyle: 'italic', fontWeight: 400 }}>
                                Any extra is appreciated, but entirely optional.
                            </Badge>
                        </Paper>
                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    );
}