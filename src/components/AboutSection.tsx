import type { BrandSettings, Lang } from "../types";
import styles from "./AboutSection.module.css";

interface Props {
  lang: Lang;
  brand: BrandSettings;
}

export function AboutSection({ lang, brand }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const mapsQuery = encodeURIComponent(brand.address.ar);

  return (
    <section id="about" className={`container ${styles.section}`} aria-labelledby="about-h">
      <h2 id="about-h" className={styles.title}>{t("عن بونساي", "About Bonsai")}</h2>
      <p className={styles.text}>
        {t(
          "بونساي كافيه هو وجهة القهوة المختصة في النجف، حيث نولي كل تفصيلة اهتمامًا خاصًا — من اختيار الحبوب إلى تقديم كل كوب.",
          "Bonsai Café is Najaf's specialty coffee destination, where every detail matters — from bean selection to the way each cup is served."
        )}
      </p>

      <div className={styles.grid}>
        <a className={styles.card} href={`https://maps.google.com/?q=${mapsQuery}`} target="_blank" rel="noopener noreferrer">
          <span className={styles.cardLabel}>{t("الموقع", "Location")}</span>
          <span className={styles.cardValue}>{brand.address[lang]}</span>
        </a>
        <div className={styles.card}>
          <span className={styles.cardLabel}>{t("أوقات العمل", "Opening Hours")}</span>
          <span className={styles.cardValue}>{brand.hours[lang]}</span>
        </div>
        <a className={styles.card} href={`tel:${brand.phone}`}>
          <span className={styles.cardLabel}>{t("الهاتف", "Phone")}</span>
          <span className={styles.cardValue} dir="ltr">{brand.phone}</span>
        </a>
      </div>
    </section>
  );
}
