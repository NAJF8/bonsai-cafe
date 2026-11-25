import { useRef } from "react";
import type { Lang } from "../types";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import styles from "./ExtrasSection.module.css";

interface Props {
  lang: Lang;
  onOpenGift: () => void;
  onOpenBooking: () => void;
  onOpenMembership: () => void;
}

export function ExtrasSection({ lang, onOpenGift, onOpenBooking, onOpenMembership }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const rootRef = useRef<HTMLElement>(null);
  useRevealOnScroll(rootRef);

  return (
    <section ref={rootRef} className={`container ${styles.section}`} aria-label={t("خدمات إضافية", "More from Bonsai")}>
      <div className={styles.grid}>
        <button type="button" className={styles.card} onClick={onOpenGift} data-reveal-io>
          <span className={styles.icon} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="9" width="17" height="11" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3.5 9h17M12 9v11M12 9c-1.5-3.5-6-3.9-6-1.3C6 9 8.5 9 12 9Zm0 0c1.5-3.5 6-3.9 6-1.3C18 9 15.5 9 12 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
          <span className={styles.cardTitle}>{t("هدية رقمية", "Digital gift")}</span>
          <span className={styles.cardText}>
            {t("أهدِ شخصًا تحبه من بونساي كافيه", "Gift someone you love from Bonsai Café")}
          </span>
        </button>

        <button type="button" className={styles.card} onClick={onOpenMembership} data-reveal-io style={{ transitionDelay: "60ms" }}>
          <span className={styles.icon} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="m12 3 2.8 5.8 6.2.9-4.5 4.5 1.1 6.3L12 17.6 6.4 20.5l1.1-6.3L3 9.7l6.2-.9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </span>
          <span className={styles.cardTitle}>{t("نادي بونساي", "Bonsai Club")}</span>
          <span className={styles.cardText}>
            {t("انضم واجمع نقاط مكافآت مع كل زيارة", "Join and collect rewards points with every visit")}
          </span>
        </button>

        <button type="button" className={styles.card} onClick={onOpenBooking} data-reveal-io style={{ transitionDelay: "120ms" }}>
          <span className={styles.icon} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="5" width="17" height="15" rx="2.2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3.5 9.5h17M8 3v3.4M16 3v3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className={styles.cardTitle}>{t("احجز طاولتك", "Reserve your table")}</span>
          <span className={styles.cardText}>
            {t("مساحتك الهادئة للجلسات والاجتماعات", "Your quiet space for sessions and meetings")}
          </span>
        </button>
      </div>
    </section>
  );
}
