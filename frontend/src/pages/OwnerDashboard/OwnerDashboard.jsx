import { useEffect, useState } from 'react';
import { Container, Title, Card, Table, TextInput, Button, Group, Text, SimpleGrid, NumberInput, Paper } from '@mantine/core';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../../services/menuItem.service';
import { getDailyReport } from '../../services/owner.service';

const emptyForm = { name: '', description: '', price: 0, image: '' };

export default function OwnerDashboard() {
    const [menuItems, setMenuItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [report, setReport] = useState(null);
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => { loadMenuItems(); }, []);
    useEffect(() => { loadReport(); }, [reportDate]);

    async function loadMenuItems() {
        const data = await getMenuItems();
        setMenuItems(data);
    }

    async function loadReport() {
        const data = await getDailyReport(reportDate);
        setReport(data);
    }

    function handleChange(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const item = {
            name: form.name,
            description: form.description,
            price: form.price,
            image: form.image
        };
        if (editingId) {
            await updateMenuItem(editingId, item);
            setEditingId(null);
        } else {
            await createMenuItem(item);
        }
        setForm(emptyForm);
        loadMenuItems();
    }

    function handleEdit(item) {
        setEditingId(item.id);
        setForm({
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image
        });
    }

    function handleCancelEdit() {
        setEditingId(null);
        setForm(emptyForm);
    }

    async function handleDelete(id) {
        if (window.confirm('Delete this item?')) {
            await deleteMenuItem(id);
            loadMenuItems();
        }
    }

    const rows = menuItems.map(item => (
        <Table.Tr key={item.id}>
            <Table.Td>{item.id}</Table.Td>
            <Table.Td>{item.name}</Table.Td>
            <Table.Td>€{item.price.toFixed(2)}</Table.Td>
            <Table.Td>{item.image}</Table.Td>
            <Table.Td>
                <Group gap="xs">
                    <Button variant="subtle" size="xs" onClick={() => handleEdit(item)}>Edit</Button>
                    <Button variant="subtle" color="red" size="xs" onClick={() => handleDelete(item.id)}>Delete</Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Container size="lg" my="xl">
            <Title order={1} mb="lg">Owner Panel</Title>

            <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
                <Title order={3} mb="md">{editingId ? `Editing Item #${editingId}` : 'Add New Menu Item'}</Title>
                <form onSubmit={handleSubmit}>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                        <TextInput
                            label="Name"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.currentTarget.value)}
                            required
                        />
                        <TextInput
                            label="Description"
                            value={form.description}
                            onChange={(e) => handleChange('description', e.currentTarget.value)}
                        />
                        <NumberInput
                            label="Price (€)"
                            value={form.price}
                            onChange={(value) => handleChange('price', value)}
                            min={0}
                            step={0.01}
                            decimalScale={2}
                            fixedDecimalScale
                            required
                        />
                        <TextInput
                            label="Image URL"
                            value={form.image}
                            onChange={(e) => handleChange('image', e.currentTarget.value)}
                            placeholder="/images/xxx.jpg"
                        />
                    </SimpleGrid>
                    <Group mt="md">
                        <Button type="submit" color="terracotta">{editingId ? 'Update' : 'Add'}</Button>
                        {editingId && (
                            <Button variant="outline" color="gray" onClick={handleCancelEdit}>Cancel</Button>
                        )}
                    </Group>
                </form>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
                <Title order={3} mb="md">Menu Items</Title>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>ID</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Price</Table.Th>
                            <Table.Th>Image</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">Daily Report</Title>
                <TextInput
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.currentTarget.value)}
                    mb="md"
                    style={{ maxWidth: 200 }}
                />
                {report ? (
                    <div>
                        <SimpleGrid cols={{ base: 1, sm: 3 }}>
                            <Paper p="sm" withBorder>
                                <Text size="sm" c="dimmed">Orders</Text>
                                <Text fw={700}>{report.totalOrders}</Text>
                            </Paper>
                            <Paper p="sm" withBorder>
                                <Text size="sm" c="dimmed">Revenue</Text>
                                <Text fw={700}>€{report.totalRevenue?.toFixed(2)}</Text>
                            </Paper>
                            <Paper p="sm" withBorder>
                                <Text size="sm" c="dimmed">Extra (tips)</Text>
                                <Text fw={700}>€{report.totalTips?.toFixed(2)}</Text>
                            </Paper>
                        </SimpleGrid>
                        <Paper p="sm" withBorder mt="md">
                            <Text size="sm" c="dimmed">Removals</Text>
                            <Text fw={700}>{report.totalRemovals}</Text>
                            {report.feedbacks?.length > 0 && (
                                <ul style={{ marginTop: '0.5rem' }}>
                                    {report.feedbacks.map(f => (
                                        <li key={f.id}><Text size="xs">Item {f.menuItemId}: {f.reason}</Text></li>
                                    ))}
                                </ul>
                            )}
                        </Paper>
                    </div>
                ) : (
                    <Text c="dimmed">Loading...</Text>
                )}
            </Card>
        </Container>
    );
}