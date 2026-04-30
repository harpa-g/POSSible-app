import { authHeader } from './auth.service';

export async function getPendingFeedbacks() {
    const res = await fetch('/api/server/feedbacks', { headers: authHeader() });
    return res.json();
}

export async function acknowledgeFeedback(id) {
    const res = await fetch(`/api/server/feedbacks/${id}/acknowledge`, {
        method: 'PUT',
        headers: authHeader()
    });
    return res.ok;
}