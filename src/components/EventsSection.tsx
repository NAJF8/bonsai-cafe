import type { CafeEvent, Lang } from "../types";
import { EmptyState } from "./EmptyState";
import styles from "./EventsSection.module.css";

interface Props {
  lang: Lang;
  events: CafeEvent[];
}

export function EventsSection({ lang, events }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const sorted = [...events].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="events" className={`container ${styles.section}`} aria-labelledby="events-h">
      <h2 id="events-h" className={styles.title}>{t("الفعاليات وأيام بونساي", "Events at Bonsai")}</h2>

      {sorted.length === 0 ? (
        <EmptyState
          title={t("لا توجد فعاليات حاليًا", "No events right now")}
          description={t("تابعنا على انستغرام لمعرفة الفعاليات القادمة", "Follow us on Instagram for upcoming events")}
        />
      ) : (
        <div className={styles.list}>
          {sorted.map((ev) => (
            <article key={ev.id} className={styles.card}>
              <div className={styles.cardHead}>
                <h3>{ev.title[lang]}</h3>
                <span className={styles.price}>{ev.price[lang]}</span>
              </div>
              <p className={styles.description}>{ev.description[lang]}</p>
              <div className={styles.meta}>
                <span>📅 {ev.date}</span>
                <span>⏰ {ev.time}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
