import { authHeader } from './auth.service';

export async function createPayment(tableNumber, amount) {
    const res = await fetch('/api/pay/create', {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber, amount })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // { redirectUrl }
}