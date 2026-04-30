import styles from './MenuItem.module.css';

export default function MenuItemCard({ item, onAddToTab }) {
    return (
        <li className={styles.productLine}>
            <img src={item.image} alt={item.name} className={styles.image} />
            <div className={styles.info}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.description}>{item.description}</span>
                <span className={styles.price}>€{item.price.toFixed(2)}</span>
            </div>
            <button className={styles.addBtn} onClick={() => onAddToTab(item.id)}>
                Add to tab
            </button>
        </li>
    );
}