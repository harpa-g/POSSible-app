import { useEffect, useState } from 'react';
import { getPendingFeedbacks, acknowledgeFeedback } from '../../services/server.service';
import styles from './ServerDashboard.module.css';

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
        <div className={styles.page}>
            <h1>Server Dashboard – Removals needing attention</h1>
            {feedbacks.length === 0 && <p>No pending removals.</p>}
            <ul>
                {feedbacks.map(f => (
                    <li key={f.id}>
                        <strong>Item ID:</strong> {f.menuItemId} —
                        <strong> Reason:</strong> {f.reason}
                        <button onClick={() => handleAcknowledge(f.id)}>Resolved (talked to customer)</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}