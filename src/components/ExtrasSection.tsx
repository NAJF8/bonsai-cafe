import type { Lang } from "../types";
import styles from "./ExtrasSection.module.css";

interface Props {
  lang: Lang;
  onOpenGift: () => void;
  onOpenBooking: () => void;
  onOpenMembership: () => void;
}

export function ExtrasSection({ lang, onOpenGift, onOpenBooking, onOpenMembership }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);

  return (
    <section className={`container ${styles.section}`} aria-label={t("خدمات إضافية", "More from Bonsai")}>
      <div className={styles.grid}>
        <button type="button" className={styles.card} onClick={onOpenGift}>
          <span className={styles.icon} aria-hidden="true">🎁</span>
          <span className={styles.cardTitle}>{t("هدية رقمية", "Digital gift")}</span>
          <span className={styles.cardText}>
            {t("أهدِ شخصًا تحبه من بونساي كافيه", "Gift someone you love from Bonsai Café")}
          </span>
        </button>

        <button type="button" className={styles.card} onClick={onOpenMembership}>
          <span className={styles.icon} aria-hidden="true">🌟</span>
          <span className={styles.cardTitle}>{t("نادي بونساي", "Bonsai Club")}</span>
          <span className={styles.cardText}>
            {t("انضم واجمع نقاط مكافآت مع كل زيارة", "Join and collect rewards points with every visit")}
          </span>
        </button>

        <button type="button" className={styles.card} onClick={onOpenBooking}>
          <span className={styles.icon} aria-hidden="true">📅</span>
          <span className={styles.cardTitle}>{t("احجز طاولتك", "Reserve your table")}</span>
          <span className={styles.cardText}>
            {t("مساحتك الهادئة للجلسات والاجتماعات", "Your quiet space for sessions and meetings")}
          </span>
        </button>
      </div>
    </section>
  );
}
