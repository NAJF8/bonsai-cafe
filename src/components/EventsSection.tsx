import { useRef } from "react";
import type { CafeEvent, Lang } from "../types";
import { EmptyState } from "./EmptyState";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import styles from "./EventsSection.module.css";

interface Props {
  lang: Lang;
  events: CafeEvent[];
}

export function EventsSection({ lang, events }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const sorted = [...events].sort((a, b) => a.sortOrder - b.sortOrder);
  const rootRef = useRef<HTMLElement>(null);
  useRevealOnScroll(rootRef, [sorted.length]);

  return (
    <section id="events" ref={rootRef} className={`container ${styles.section}`} aria-labelledby="events-h">
      <h2 id="events-h" className={styles.title} data-reveal-io>{t("الفعاليات وأيام بونساي", "Events at Bonsai")}</h2>

      {sorted.length === 0 ? (
        <EmptyState
          title={t("لا توجد فعاليات حاليًا", "No events right now")}
          description={t("تابعنا على انستغرام لمعرفة الفعاليات القادمة", "Follow us on Instagram for upcoming events")}
        />
      ) : (
        <div className={styles.list}>
          {sorted.map((ev, i) => (
            <article key={ev.id} className={styles.card} data-reveal-io style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
              <div className={styles.cardHead}>
                <h3>{ev.title[lang]}</h3>
                <span className={styles.price}>{ev.price[lang]}</span>
              </div>
              <p className={styles.description}>{ev.description[lang]}</p>
              <div className={styles.meta}>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3.5" y="5" width="17" height="15" rx="2.2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3.5 9.5h17M8 3v3.4M16 3v3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {ev.date}
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 7.6v4.6l3 1.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {ev.time}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
