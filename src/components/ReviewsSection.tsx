import type { Lang } from "../types";
import { ReviewForm } from "./ReviewForm";
import styles from "./AboutSection.module.css";

export function ReviewsSection({ lang }: { lang: Lang }) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  return (
    <section id="reviews" className={`container ${styles.section}`} aria-labelledby="reviews-h">
      <h2 id="reviews-h" className={styles.title}>{t("شاركنا رأيك", "Share your feedback")}</h2>
      <p className={styles.text}>
        {t("تجربتك تهمنا — قيّم زيارتك الأخيرة إلى بونساي", "Your experience matters — rate your last visit to Bonsai")}
      </p>
      <ReviewForm lang={lang} />
    </section>
  );
}
