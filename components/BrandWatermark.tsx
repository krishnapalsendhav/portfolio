import styles from './BrandWatermark.module.css';

export default function BrandWatermark() {
    return (
        <section aria-hidden="true" className={styles.watermark}>
            <span className={styles.wordmark}>KRISHNAPAL</span>
        </section>
    );
}
