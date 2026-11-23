import type { Lang } from "../types";
import styles from "./BottomNav.module.css";

interface Props {
  lang: Lang;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  activeSection: "home" | "menu" | "reviews" | "other";
}

export function BottomNav({ lang, cartCount, onOpenCart, onOpenSearch, activeSection }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);

  return (
    <nav className={styles.nav} aria-label={t("تنقل رئيسي", "Main navigation")}>
      <a href="#home" className={`${styles.item} ${activeSection === "home" ? styles.active : ""}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 11.5 12 4l8 7.5M6 10v9h12v-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{t("الرئيسية", "Home")}</span>
      </a>

      <a href="#menu" className={`${styles.item} ${activeSection === "menu" ? styles.active : ""}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 4h11l3 4.5-8.5 11L5 8.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <span>{t("المنيو", "Menu")}</span>
      </a>

      <button type="button" className={styles.item} onClick={onOpenSearch}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="m20 20-3.8-3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span>{t("بحث", "Search")}</span>
      </button>

      <button type="button" className={styles.item} onClick={onOpenCart}>
        <span className={styles.cartIconWrap}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 4h2l1.2 11.4A2 2 0 0 0 8.2 17.2h8.6a2 2 0 0 0 2-1.8L20 7H6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="20.5" r="1.3" fill="currentColor" />
            <circle cx="16" cy="20.5" r="1.3" fill="currentColor" />
          </svg>
          {cartCount > 0 && <span className={styles.dot}>{cartCount}</span>}
        </span>
        <span>{t("السلة", "Cart")}</span>
      </button>
    </nav>
  );
}
