import type { Lang } from "../types";
import styles from "./Header.module.css";

interface Props {
  lang: Lang;
  onToggleLang: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  cartCount: number;
  onOpenCart: () => void;
  brandName: string;
}

export function Header({ lang, onToggleLang, theme, onToggleTheme, cartCount, onOpenCart, brandName }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);

  return (
    <header className={styles.header}>
      <div className={`${styles.inner} container`}>
        <a href="#home" className={styles.brand} aria-label={brandName}>
          <svg className={styles.mark} width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="15" fill="var(--bonsai-cream-100)" stroke="var(--color-primary)" strokeWidth="1" />
            <path d="M16 24V13" stroke="var(--color-primary)" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M16 13c-3-1-5-3.5-5-6.5 3 0 5.5 2 6.5 4.6" fill="var(--color-primary)" />
            <path d="M16 15c3-1.2 5-3.4 5-6 -3 0-5.3 1.8-6 4.2" fill="var(--color-primary)" />
            <circle cx="10.5" cy="9.5" r="1.1" fill="var(--color-accent)" />
            <circle cx="21.5" cy="10.5" r="1.1" fill="var(--color-accent)" />
          </svg>
          <span className={styles.wordmark}>BONSAI</span>
        </a>

        <nav className={styles.actions} aria-label={t("إجراءات سريعة", "Quick actions")}>
          <button
            type="button"
            className={styles.pillBtn}
            onClick={onToggleLang}
            aria-label={t("تبديل اللغة إلى الإنجليزية", "Switch language to Arabic")}
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={onToggleTheme}
            aria-label={theme === "light" ? t("الوضع الداكن", "Dark mode") : t("الوضع الفاتح", "Light mode")}
          >
            {theme === "light" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={onOpenCart}
            aria-label={t("السلة", "Cart")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 4h2l1.2 11.4A2 2 0 0 0 8.2 17.2h8.6a2 2 0 0 0 2-1.8L20 7H6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20.5" r="1.4" fill="currentColor" />
              <circle cx="16" cy="20.5" r="1.4" fill="currentColor" />
            </svg>
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}
