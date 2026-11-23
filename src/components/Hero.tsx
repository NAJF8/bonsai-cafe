import type { BrandSettings, Lang } from "../types";
import styles from "./Hero.module.css";

interface Props {
  lang: Lang;
  brand: BrandSettings;
}

export function Hero({ lang, brand }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);

  return (
    <section id="home" className={styles.hero} aria-label={t("الصفحة الرئيسية", "Home")}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.content}`}>
        {brand.rating ? (
          <div className={styles.rating}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="m12 3 2.8 5.8 6.2.9-4.5 4.5 1.1 6.3L12 17.6 6.4 20.5l1.1-6.3L3 9.7l6.2-.9Z" />
            </svg>
            <span>{brand.rating}</span>
          </div>
        ) : null}

        <img className={styles.logo} src="/assets/brand/logo.jpg" alt={brand.name[lang]} width={72} height={72} />
        <h1 className={styles.wordmark}>BONSAI</h1>
        <p className={styles.tagline}>{brand.tagline[lang]}</p>

        <a href="#menu" className={styles.cta}>
          {t("تصفح المنيو", "Browse the Menu")}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: lang === "ar" ? "scaleX(-1)" : undefined }}>
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
