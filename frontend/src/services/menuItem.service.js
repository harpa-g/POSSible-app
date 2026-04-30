import { authHeader } from './auth.service';

export async function getMenuItems() {
    const res = await fetch('/api/menu-items');
    return res.json();
}

// Owner only
export async function createMenuItem(item) {
    return (await fetch('/api/menu-items', {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    })).json();
}

export async function updateMenuItem(id, item) {
    return (await fetch(`/api/menu-items/${id}`, {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    })).json();
}

export async function deleteMenuItem(id) {
    await fetch(`/api/menu-items/${id}`, {
        method: 'DELETE',
        headers: authHeader()
    });
}