import { useNavigate, Link } from 'react-router-dom';
import CartItem from '../../components/CartItem';
import styles from './CartPage.module.css';

export default function CartPage({ cart, onRemove, onUpdateQty, onCheckout }) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Cart</h1>
      </div>

      <ul className={styles.list}>
        {cart.map(item => (
          <CartItem
            key={`cart-${item.id}`}
            item={item}
            onRemove={onRemove}
            onUpdateQty={onUpdateQty}
          />
        ))}
      </ul>

      <div className={styles.summary}>
        <span className={styles.total}>
          Total: <strong>${total.toFixed(2)}</strong>
        </span>
        <button className={styles.checkoutBtn} onClick={() => { onCheckout(); navigate('/products'); }}>
          Checkout
        </button>
      </div>
    </div>
  );
}