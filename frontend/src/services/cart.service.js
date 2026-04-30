import { authHeader } from './auth.service';

export async function addToCartApi(productId) {
    const response = await fetch(`/api/cart/add?pid=${productId}`, {
        headers: { ...authHeader() },
    });
    if (response.status === 401 || response.status === 403) {
        throw new Error('unauthorized');
    }
    return response.json();
}
