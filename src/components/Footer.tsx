import { useState } from "react";
import type { BrandSettings, Lang } from "../types";
import styles from "./Footer.module.css";

interface Props {
  lang: Lang;
  brand: BrandSettings;
}

export function Footer({ lang, brand }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [year] = useState(() => new Date().getFullYear());

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <img className={styles.logo} src="/assets/brand/logo.jpg" alt="" width={48} height={48} />
        <span className={styles.wordmark}>BONSAI</span>
        <p className={styles.tagline}>{brand.tagline[lang]}</p>
        <nav className={styles.links} aria-label={t("روابط التذييل", "Footer links")}>
          <a href={brand.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={`https://wa.me/${brand.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href={`tel:${brand.phone}`}>{t("اتصال", "Call")}</a>
        </nav>
        <p className={styles.copy}>&copy; {year} Bonsai Café</p>
      </div>
    </footer>
  );
}
