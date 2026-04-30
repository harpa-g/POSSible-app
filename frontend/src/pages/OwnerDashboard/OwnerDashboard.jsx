import { useEffect, useState } from 'react';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../../services/menuItem.service';
import { getDailyReport } from '../../services/owner.service';
import styles from './OwnerDashboard.module.css';

const emptyForm = { name: '', description: '', price: '', image: '' };

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

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const item = {
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
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
            price: item.price.toString(),
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

    return (
        <div className={styles.page}>
            <h1>Owner Panel</h1>

            {/* Menu management */}
            <div className={styles.formCard}>
                <h2>{editingId ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.fields}>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
                        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
                        <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="Price" required />
                        <input name="image" value={form.image} onChange={handleChange} placeholder="/images/xxx.jpg" />
                    </div>
                    <div className={styles.formActions}>
                        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
                        {editingId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
                    </div>
                </form>
            </div>

            <table className={styles.table}>
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
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Daily Report */}
            <h2>Daily Report</h2>
            <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} />
            {report && (
                <div className={styles.report}>
                    <p>Orders: {report.totalOrders}</p>
                    <p>Revenue: €{report.totalRevenue?.toFixed(2)}</p>
                    <p>Extra (tips): €{report.totalTips?.toFixed(2)}</p>
                    <p>Removals: {report.totalRemovals}</p>
                    {report.feedbacks?.length > 0 && (
                        <ul>
                            {report.feedbacks.map(f => (
                                <li key={f.id}>Item {f.menuItemId}: {f.reason}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}