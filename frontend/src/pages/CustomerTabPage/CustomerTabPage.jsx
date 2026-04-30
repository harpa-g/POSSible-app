import { useEffect, useState } from 'react';
import { getMenuItems } from '../../services/menuItem.service';
import { getTab, addToTab, removeItemFromTab } from '../../services/tab.service';
import { createPayment } from '../../services/payment.service';
import MenuItemCard from '../../components/MenuItem';
import styles from './CustomerTabPage.module.css';

const TABLE_NUMBER = 1; // In real app, user would enter table number or it's assigned

export default function CustomerTabPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [tab, setTab] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [message, setMessage] = useState('');

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
            setMessage('Item added to tab.');
        } catch (e) {
            setMessage('Failed to add item.');
        }
    }

    async function handleRemove(menuItemId) {
        const reason = prompt('Why are you removing this item?');
        if (!reason) return;
        const ok = await removeItemFromTab(TABLE_NUMBER, menuItemId, reason);
        if (ok) {
            setMessage('Item removed. Server has been notified.');
            loadTab(); // refresh
        } else {
            setMessage('Removal failed.');
        }
    }

    async function handlePay() {
        const billTotal = tab.totalBill || 0;
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount < billTotal) {
            alert(`Amount must be at least €${billTotal.toFixed(2)}`);
            return;
        }
        try {
            const result = await createPayment(TABLE_NUMBER, amount);
            // Simulate redirect to Revolut; we directly go to success page
            window.location.href = result.redirectUrl;
        } catch (e) {
            setMessage('Payment failed: ' + e.message);
        }
    }

    if (!tab) return <div>Loading tab...</div>;

    const activeItems = tab.items.filter(i => i.status === 'ACTIVE');
    const removedItems = tab.items.filter(i => i.status === 'REMOVED');

    return (
        <div className={styles.page}>
            <h1>Your Tab (Table {TABLE_NUMBER})</h1>
            {message && <div className={styles.message}>{message}</div>}

            <div className={styles.split}>
                <div className={styles.menuSection}>
                    <h2>Menu</h2>
                    <ul className={styles.list}>
                        {menuItems.map(item => (
                            <MenuItemCard key={item.id} item={item} onAddToTab={handleAddToTab} />
                        ))}
                    </ul>
                </div>

                <div className={styles.tabSection}>
                    <h2>Your current order</h2>
                    <ul>
                        {activeItems.map(item => (
                            <li key={item.menuItemId}>
                                {item.name} - €{item.price.toFixed(2)}
                                <button onClick={() => handleRemove(item.menuItemId)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    {removedItems.length > 0 && (
                        <>
                            <h3>Removed items</h3>
                            <ul>
                                {removedItems.map(item => (
                                    <li key={item.menuItemId}>
                                        {item.name} – reason: {item.removalReason}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    <div className={styles.total}>
                        Bill total: <strong>€{tab.totalBill.toFixed(2)}</strong>
                    </div>
                    <div className={styles.payment}>
                        <input
                            type="number"
                            step="0.01"
                            min={tab.totalBill}
                            value={paymentAmount}
                            onChange={e => setPaymentAmount(e.target.value)}
                            placeholder="Enter amount to pay"
                        />
                        <button onClick={handlePay}>Pay with Revolut</button>
                    </div>
                    <p className={styles.extra}>Any extra is appreciated, but entirely optional.</p>
                </div>
            </div>
        </div>
    );
}