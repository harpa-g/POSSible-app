import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from 'react-bootstrap';
import { getMenuItems } from '../../services/menuItem.service';
import { getTab, addToTab, removeItemFromTab } from '../../services/tab.service';
import { createPayment } from '../../services/payment.service';
import MenuItem from '../../components/MenuItem/MenuItem';

const TABLE_NUMBER = 1;

export default function CustomerTabPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [tab, setTab] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [message, setMessage] = useState('');
    const [msgVariant, setMsgVariant] = useState('success');

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
            setMsgVariant('success');
            setMessage('Item added to tab.');
        } catch (e) {
            setMsgVariant('danger');
            setMessage('Failed to add item.');
        }
    }

    async function handleRemove(menuItemId) {
        const reason = prompt('Why are you removing this item?');
        if (!reason) return;
        const ok = await removeItemFromTab(TABLE_NUMBER, menuItemId, reason);
        if (ok) {
            setMsgVariant('success');
            setMessage('Item removed. Server has been notified.');
            loadTab();
        } else {
            setMsgVariant('danger');
            setMessage('Removal failed.');
        }
    }

    async function handlePay() {
        const activeItems = tab?.items?.filter(i => i.status === 'ACTIVE') || [];
        const billTotal = activeItems.reduce((sum, item) => sum + item.price, 0);
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount < billTotal) {
            setMsgVariant('danger');
            setMessage(`Amount must be at least €${billTotal.toFixed(2)}`);
            return;
        }
        try {
            const result = await createPayment(TABLE_NUMBER, amount);
            window.location.href = result.redirectUrl;
        } catch (e) {
            setMsgVariant('danger');
            setMessage('Payment failed: ' + e.message);
        }
    }

    if (!tab) return <div className="text-center mt-5">Loading tab...</div>;

    const activeItems = tab.items.filter(i => i.status === 'ACTIVE');
    const removedItems = tab.items.filter(i => i.status === 'REMOVED');
    const billTotal = activeItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <Container className="py-4">
            <h1 className="mb-4">Your Tab (Table {TABLE_NUMBER})</h1>
            {message && (
                <Alert variant={msgVariant} dismissible onClose={() => setMessage('')}>
                    {message}
                </Alert>
            )}

            <Row>
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Header className="fw-bold">Menu</Card.Header>
                        <Card.Body>
                            {menuItems.map(item => (
                                <MenuItem key={item.id} item={item} onAddToTab={handleAddToTab} />
                            ))}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Header className="fw-bold">Your current order</Card.Header>
                        <Card.Body>
                            {activeItems.length === 0 ? (
                                <p className="text-muted">No items yet.</p>
                            ) : (
                                activeItems.map(item => (
                                    <div key={item.menuItemId} className="d-flex justify-content-between align-items-center border-bottom py-2">
                                        <span>{item.name} – €{item.price.toFixed(2)}</span>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleRemove(item.menuItemId)}>
                                            Remove
                                        </Button>
                                    </div>
                                ))
                            )}

                            {removedItems.length > 0 && (
                                <>
                                    <h6 className="mt-3 text-muted">Removed items</h6>
                                    {removedItems.map(item => (
                                        <div key={item.menuItemId} className="text-muted small fst-italic py-1">
                                            {item.name} – reason: {item.removalReason || 'No reason given'}
                                        </div>
                                    ))}
                                </>
                            )}

                            <div className="d-flex justify-content-end mt-3">
                                <span className="fw-bold fs-5">Bill total: €{billTotal.toFixed(2)}</span>
                            </div>

                            <div className="bg-light p-3 mt-3 rounded">
                                <Form.Group>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        min={billTotal}
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        placeholder="Enter amount to pay"
                                    />
                                </Form.Group>
                                <Button
                                    className="mt-2 w-100"
                                    style={{ backgroundColor: '#d49b6a', borderColor: '#d49b6a' }}
                                    size="md"
                                    onClick={handlePay}
                                    disabled={!paymentAmount}
                                >
                                    Pay with Revolut
                                </Button>
                                <Badge bg="secondary" className="mt-2 fst-italic text-muted">
                                    Any extra is appreciated, but entirely optional.
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}