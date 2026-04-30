import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Product from '../../components/Product';
import { getProducts } from '../../services/product.service';
import { addToCartApi } from '../../services/cart.service';
import styles from './ProductList.module.css';

export default function ProductList({ onAddToCart }) {
    const [products, setProducts] = useState([]);
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getProducts().then(setProducts);
    }, []);

    async function handleAddToCart(productId) {
        try {
            const product = await addToCartApi(productId);
            onAddToCart(product);
            setNotification(`${product.name} was added to cart!`);
            setTimeout(() => setNotification(''), 3000);
        } catch (e) {
            if (e.message === 'unauthorized') navigate('/login');
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Products</h1>
                <Link to="/cart" className="btn-primary">View Cart</Link>
            </div>
            {notification && <div className={styles.notification}>{notification}</div>}
            <ul className={styles.list}>
                {products.map(product => (
                    <Product
                        key={`product-${product.id}`}
                        product={product}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </ul>
        </div>
    );
}
