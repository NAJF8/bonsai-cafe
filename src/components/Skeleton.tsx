import styles from "./Skeleton.module.css";

export function MenuSkeleton() {
  return (
    <div className="container" aria-hidden="true">
      <div className={styles.barWide} />
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.image} />
            <div className={styles.lineShort} />
            <div className={styles.lineTiny} />
          </div>
        ))}
      </div>
    </div>
  );
}
