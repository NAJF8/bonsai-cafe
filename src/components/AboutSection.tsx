import { useRef } from "react";
import type { BrandSettings, Lang } from "../types";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import styles from "./AboutSection.module.css";

interface Props {
  lang: Lang;
  brand: BrandSettings;
  productCount: number;
  categoryCount: number;
  signatureCount: number;
}

export function AboutSection({ lang, brand, productCount, categoryCount, signatureCount }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const mapsQuery = encodeURIComponent(brand.address.ar);
  const rootRef = useRef<HTMLElement>(null);
  useRevealOnScroll(rootRef);

  return (
    <section id="about" ref={rootRef} className={`container ${styles.section}`} aria-labelledby="about-h">
      <div className={styles.layout}>
        <div className={styles.badge} data-reveal-io>
          <img className={styles.logo} src="/assets/brand/logo.jpg" alt="" width={120} height={120} />
          <span className={styles.badgeName}>BONSAI</span>
          <span className={styles.badgeTag}>{t("كافيه", "Café")}</span>
        </div>

        <div className={styles.copy} data-reveal-io>
          <h2 id="about-h" className={styles.title}>{t("عن بونساي", "About Bonsai")}</h2>
          <p className={styles.text}>
            {t(
              "بونساي كافيه هو وجهة القهوة المختصة في النجف، حيث نولي كل تفصيلة اهتمامًا خاصًا — من اختيار الحبوب إلى تقديم كل كوب.",
              "Bonsai Café is Najaf's specialty coffee destination, where every detail matters — from bean selection to the way each cup is served."
            )}
          </p>
          <p className={styles.quote}>
            {t("“قهوة مختصة تنبض بالتفاصيل”", "“Specialty coffee, alive in the details”")}
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{productCount}</span>
              <span className={styles.statLabel}>{t("منتج", "products")}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{categoryCount}</span>
              <span className={styles.statLabel}>{t("قسم", "categories")}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{signatureCount}</span>
              <span className={styles.statLabel}>{t("توقيع بونساي", "signature items")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.grid} data-reveal-io>
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
