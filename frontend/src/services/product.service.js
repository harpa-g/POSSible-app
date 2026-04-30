import { authHeader } from './auth.service';

export async function getProducts() {
    const response = await fetch('/api/products');
    return response.json();
}

/* TODO 2-1: Implement function to add products; add authHeader since methods are for admins */
export async function createProduct(product) {

}

/* TODO 2-2: Implement function to update products */
export async function updateProduct(id, product) {

}

/* TODO 2-3: Implement function to delete products. Then, go to AdminPage.jsx */
export async function deleteProduct(id) {

}
