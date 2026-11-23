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
  const mapsQuery = encodeURIComponent(brand.address.ar);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span>&copy; {year} {t("جميع الحقوق محفوظة لبونساي كافيه", "All rights reserved — Bonsai Café")}</span>
        </div>

        <nav className={styles.links} aria-label={t("روابط التواصل", "Contact links")}>
          <a href={brand.instagram} target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.2c2.7 0 3 0 4.1.06 1.1.05 1.8.22 2.5.47.7.26 1.2.6 1.8 1.15.55.56.9 1.1 1.15 1.8.25.7.42 1.4.47 2.5.06 1.1.06 1.4.06 4.1s0 3-.06 4.1c-.05 1.1-.22 1.8-.47 2.5a4.9 4.9 0 0 1-1.15 1.8 4.9 4.9 0 0 1-1.8 1.15c-.7.25-1.4.42-2.5.47-1.1.06-1.4.06-4.1.06s-3 0-4.1-.06c-1.1-.05-1.8-.22-2.5-.47a4.9 4.9 0 0 1-1.8-1.15 4.9 4.9 0 0 1-1.15-1.8c-.25-.7-.42-1.4-.47-2.5C2.2 15 2.2 14.7 2.2 12s0-3 .06-4.1c.05-1.1.22-1.8.47-2.5.26-.7.6-1.24 1.15-1.8A4.9 4.9 0 0 1 5.68 2.45c.7-.25 1.4-.42 2.5-.47C9.3 1.92 9.6 1.92 12 1.92Z" />
            </svg>
            {t("انستغرام", "Instagram")}
          </a>
          <a href={`tel:${brand.phone}`} dir="ltr">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8c1.4 2.7 3.9 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 3.9c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.4 0 .8-.3 1.1L6.6 10.8Z" />
            </svg>
            {brand.phone}
          </a>
          <a href={`https://maps.google.com/?q=${mapsQuery}`} target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21Zm0-8.6a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z" />
            </svg>
            {t("الموقع على الخريطة", "View on map")}
          </a>
        </nav>

        <div className={styles.brand}>
          <img className={styles.logo} src="/assets/brand/logo.jpg" alt="" width={40} height={40} />
          <div>
            <span className={styles.wordmark}>BONSAI</span>
            <p className={styles.tagline}>{brand.tagline[lang]}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
