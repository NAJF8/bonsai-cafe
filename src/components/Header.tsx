import type { Lang } from "../types";
import styles from "./Header.module.css";

interface Props {
  lang: Lang;
  onToggleLang: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenGift: () => void;
  onOpenMembership: () => void;
  onOpenBooking: () => void;
  brandName: string;
}

export function Header({
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  cartCount,
  onOpenCart,
  onOpenGift,
  onOpenMembership,
  onOpenBooking,
  brandName,
}: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);

  return (
    <header className={styles.header}>
      <nav className={`${styles.textNav} container`} aria-label={t("روابط رئيسية", "Main links")}>
        <a href="#menu">{t("المنيو", "Menu")}</a>
        <a href="#reviews">⭐ {t("تقييم الطلب", "Rate order")}</a>
        <button type="button" onClick={onOpenGift}>🎁 {t("إهداء هدية", "Gift")}</button>
        <button type="button" onClick={onOpenBooking}>📅 {t("حجز طاولة", "Reserve")}</button>
        <a href="#events">{t("الفعاليات", "Events")}</a>
        <button type="button" onClick={onOpenMembership}>🌟 {t("نادي بونساي", "Bonsai Club")}</button>
        <a href="#about">{t("من نحن", "About")}</a>
      </nav>
      <div className={`${styles.inner} container`}>
        <a href="#home" className={styles.brand} aria-label={brandName}>
          <img className={styles.mark} src="/assets/brand/logo.jpg" alt="" width={30} height={30} />
          <span className={styles.wordmark}>BONSAI</span>
        </a>

        <nav className={styles.actions} aria-label={t("إجراءات سريعة", "Quick actions")}>
          <button type="button" className={styles.iconBtn} onClick={onOpenGift} aria-label={t("إهداء هدية", "Send a gift")}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 8v13H4V8M2 8h20v4H2zM12 8v13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 8H8.5a2 2 0 1 1 0-4C11 4 12 8 12 8ZM12 8h3.5a2 2 0 1 0 0-4C13 4 12 8 12 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button type="button" className={styles.iconBtn} onClick={onOpenMembership} aria-label={t("مكافآت ونادي بونساي", "Bonsai rewards & club")}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m12 3 2.8 5.8 6.2.9-4.5 4.5 1.1 6.3L12 17.6 6.4 20.5l1.1-6.3L3 9.7l6.2-.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </button>

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
