import { authHeader } from './auth.service';

export async function getDailyReport(date) {
    const params = date ? `?date=${date}` : '';
    const res = await fetch(`/api/owner/report${params}`, { headers: authHeader() });
    return res.json();
}