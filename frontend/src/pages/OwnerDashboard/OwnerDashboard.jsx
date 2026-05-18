import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../../services/menuItem.service';
import { getDailyReport } from '../../services/owner.service';

const emptyForm = { name: '', description: '', price: '', image: '' };  // price as string

export default function OwnerDashboard() {
    const [menuItems, setMenuItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [report, setReport] = useState(null);
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

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

    // Generic change handler for all form fields – treats everything as strings
    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const priceValue = parseFloat(form.price);
        if (isNaN(priceValue) || priceValue < 0) {
            setError('Please enter a valid price.');
            return;
        }
        setError('');
        const item = {
            name: form.name,
            description: form.description,
            price: priceValue,       // now a number
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
            price: item.price.toString(),   // convert number to string for the input
            image: item.image
        });
    }

    function handleCancelEdit() {
        setEditingId(null);
        setForm(emptyForm);
        setError('');
    }

    async function handleDelete(id) {
        if (window.confirm('Delete this item?')) {
            await deleteMenuItem(id);
            loadMenuItems();
        }
    }

    return (
        <Container className="py-4">
            <h1>Owner Panel</h1>

            {/* Menu Form */}
            <Card className="mb-4">
                <Card.Header>{editingId ? `Edit Item #${editingId}` : 'Add New Menu Item'}</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Control type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Control type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Control
                                    type="text"
                                    name="price"
                                    placeholder="Price (e.g. 4.50)"
                                    value={form.price}
                                    onChange={handleChange}
                                    required
                                />
                                {error && <div className="text-danger small mt-1">{error}</div>}
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Control type="text" name="image" placeholder="/images/xxx.jpg" value={form.image} onChange={handleChange} />
                            </Col>
                        </Row>
                        <Button type="submit" style={{ backgroundColor: '#d49b6a', borderColor: '#d49b6a' }}>
                            {editingId ? 'Update' : 'Add'}
                        </Button>
                        {editingId && <Button variant="secondary" className="ms-2" onClick={handleCancelEdit}>Cancel</Button>}
                    </Form>
                </Card.Body>
            </Card>

            {/* Menu Items Table */}
            <Card className="mb-4">
                <Card.Header>Menu Items</Card.Header>
                <Card.Body>
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th><th>Name</th><th>Price</th><th>Image</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuItems.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>€{item.price.toFixed(2)}</td>
                                    <td>{item.image}</td>
                                    <td>
                                        <Button size="sm" variant="outline-secondary" onClick={() => handleEdit(item)}>Edit</Button>
                                        <Button size="sm" variant="outline-danger" className="ms-1" onClick={() => handleDelete(item.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Daily Report */}
            <Card className="mb-4">
                <Card.Header>Daily Report</Card.Header>
                <Card.Body>
                    <Form.Control type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} className="mb-3" style={{ maxWidth: '200px' }} />
                    {report && (
                        <Row>
                            <Col sm={4}><Card className="p-3 mb-2"><strong>Orders</strong><br />{report.totalOrders}</Card></Col>
                            <Col sm={4}><Card className="p-3 mb-2"><strong>Revenue</strong><br />€{report.totalRevenue?.toFixed(2)}</Card></Col>
                            <Col sm={4}><Card className="p-3 mb-2"><strong>Extra (tips)</strong><br />€{report.totalTips?.toFixed(2)}</Card></Col>
                        </Row>
                    )}
                    {report?.feedbacks?.length > 0 && (
                        <div className="mt-3">
                            <h6>Removals</h6>
                            <ul>
                                {report.feedbacks.map(f => (
                                    <li key={f.id}>Item {f.menuItemId}: {f.reason}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}