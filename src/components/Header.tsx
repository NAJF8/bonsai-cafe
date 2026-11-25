import type { Lang } from "../types";
import type { ThemePreference } from "../hooks/useLang";
import { ThemeSwitch } from "./ThemeSwitch";
import { LanguageSwitch } from "./LanguageSwitch";
import styles from "./Header.module.css";

interface Props {
  lang: Lang;
  onToggleLang: () => void;
  themePreference: ThemePreference;
  onChangeTheme: (value: ThemePreference) => void;
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
  themePreference,
  onChangeTheme,
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
      <div className={`${styles.inner} container`}>
        <a href="#home" className={styles.brand} aria-label={brandName}>
          <img className={styles.mark} src="assets/brand/logo.jpg" alt="" width={36} height={36} />
          <div className={styles.brandText}>
            <span className={styles.wordmark}>BONSAI</span>
            <span className={styles.submark}>{t("بونساي كافيه", "CAFÉ · NAJAF")}</span>
          </div>
        </a>

        <nav className={styles.desktopNav} aria-label={t("روابط رئيسية", "Main links")}>
          <a href="#menu">{t("المنيو", "Menu")}</a>
          <button type="button" onClick={onOpenBooking}>{t("حجز طاولة", "Reserve")}</button>
          <button type="button" onClick={onOpenGift}>{t("إهداء", "Gift")}</button>
          <button type="button" onClick={onOpenMembership}>{t("نادي بونساي", "Club")}</button>
          <a href="#events">{t("الفعاليات", "Events")}</a>
          <a href="#about">{t("من نحن", "About")}</a>
        </nav>

        <div className={styles.actions} aria-label={t("إجراءات سريعة", "Quick actions")}>
          <div className={styles.themeWrap}>
            <ThemeSwitch lang={lang} value={themePreference} onChange={onChangeTheme} />
          </div>

          <LanguageSwitch lang={lang} onToggle={onToggleLang} />

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.cartBtn}`}
            onClick={onOpenCart}
            aria-label={t("السلة", "Cart")}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 4h2l1.2 11.4A2 2 0 0 0 8.2 17.2h8.6a2 2 0 0 0 2-1.8L20 7H6.2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="20.5" r="1.4" fill="currentColor" />
              <circle cx="16" cy="20.5" r="1.4" fill="currentColor" />
            </svg>
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
