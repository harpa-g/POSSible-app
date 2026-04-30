import { authHeader } from './auth.service';

// fetch tab for tableNumber (customer)
export async function getTab(tableNumber) {
    const res = await fetch(`/api/tabs/${tableNumber}`, {
        headers: authHeader()
    });
    return res.json();
}

// add item to tab
export async function addToTab(tableNumber, menuItemId) {
    const res = await fetch(`/api/tabs/${tableNumber}/add`, {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemId })
    });
    return res.json();
}

// remove item from tab with reason
export async function removeItemFromTab(tableNumber, menuItemId, reason) {
    const res = await fetch(`/api/tabs/${tableNumber}/items/${menuItemId}`, {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
    });
    return res.ok;
}