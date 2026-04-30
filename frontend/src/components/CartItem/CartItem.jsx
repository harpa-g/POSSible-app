import styles from './CartItem.module.css';

export default function CartItem({ item, onRemove, onUpdateQty }) {
  return (
    <li className={styles.cartItem}>
      <img src={item.image} alt={item.name} className={styles.image} />
      <div className={styles.info}>
        <span className={styles.name}>{item.name}</span>
        <span className={styles.price}>${item.price.toFixed(2)} each</span>
      </div>
      <div className={styles.qty}>
        <button onClick={() => onUpdateQty(item.id, item.qty - 1)}>−</button>
        <input
          type="number"
          min="1"
          value={item.qty}
          onChange={e => onUpdateQty(item.id, parseInt(e.target.value) || 1)}
        />
        <button onClick={() => onUpdateQty(item.id, item.qty + 1)}>+</button>
      </div>
      <span className={styles.subtotal}>${(item.price * item.qty).toFixed(2)}</span>
      <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>
        Remove
      </button>
    </li>
  );
}