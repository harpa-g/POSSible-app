import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/product.service';
import styles from './AdminPage.module.css';

const emptyForm = { name: '', description: '', price: '', image: '' };

export default function AdminPage() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([])
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProducts();
        loadOrders();
    }, []);

    /* TODO 2-4: Implement function to load products. Then, go below to display them */
    async function loadProducts() {

    }

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    /* TODO 2-6: Implement function to create/update products, based on the submit button in the form. 
    Then, go below to create form */
    async function handleSubmit(e) {

    }

    /* TODO 2-9: Implement function for Edit button inside table. Then, go below to add functionality to it */
    function handleEdit(product) {

    }

    /* TODO 3: Implement function for Cancel button inside form, when editing a product. 
    Then, go below to add functionality to it. Then go to TODO 4 below */
    function handleCancelEdit() {

    }

    /* TODO 2-10: Implement function for Delete button inside table. 
    Then, go below to add functionality to it. Then, go to TODO 3 above

    TODO 4: Add window.confirm() to make sure an admin wants to delete a product. 
    Then go to OrderController.java for TODO 5 */
    async function handleDelete(id) {
  
    }

      /* TODO 6-3: Load orders, then go below */
    async function loadOrders() {
    
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Admin — Manage Products</h1>

            <div className={styles.formCard}>
                <h2 className={styles.formTitle}>
                    {editingId !== null ? `Editing product #${editingId}` : 'Add new product'}
                </h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.fields}>
                      {/* TODO 2-7:  Create form */}

                    </div>
                    
                    <div className={styles.formActions}>
                      {/* TODO 2-8  Create buttons to add products and cancel update (empty form, TODO3) */}
                    </div>
                </form>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* TODO 2-5: Display products; Add buttons for edit(TODO2-9)/delete(TODO2-10) */}
                        {

                        }
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="6" className={styles.empty}>No products yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* TODO 6-4: Orders table. Then, go to OrderController.java for TODO 6-1 */}
            <h2 className={styles.title}>Orders</h2>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th><th>Username</th><th>Items</th><th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                      

                    </tbody>
                </table>
            </div>
        </div>
    );
}
