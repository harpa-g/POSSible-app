import styles from './Product.module.css';

export default function Product({ product, onAddToCart }) {
  return (
    <li className={styles.productLine}>
      <img src={product.image} alt={product.name} className={styles.image} />
      <div className={styles.info}>
        <span className={styles.name}>{product.name}</span>
        <span className={styles.description}>{product.description}</span>
        <span className={styles.price}>${product.price.toFixed(2)}</span>
      </div>
      <button className={styles.addBtn} onClick={() => onAddToCart(product.id)}>
        Add to cart
      </button>
    </li>
  );
}