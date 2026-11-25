import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { BrandSettings, Lang } from "../types";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  lang: Lang;
  brand: BrandSettings;
  onOpenBooking?: () => void;
}

export function Hero({ lang, brand, onOpenBooking }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaWrapRef = useRef<HTMLDivElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const hasMedia = !videoFailed || !imageFailed;

  useEffect(() => {
    const frame = frameRef.current;
    const section = sectionRef.current;
    if (!frame || !section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const targets = frame.querySelectorAll("[data-reveal]");
      gsap.set(targets, { opacity: 0, y: 24 });
      gsap.fromTo(
        frame,
        { autoAlpha: 0, scale: 0.94, rotateX: 4, transformPerspective: 900 },
        { autoAlpha: 1, scale: 1, rotateX: 0, duration: 0.9, ease: "power3.out", delay: 0.1 }
      );
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.09,
        delay: 0.3,
      });

      if (mediaWrapRef.current) {
        gsap.fromTo(mediaWrapRef.current, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: "power2.out" });
        gsap.to(mediaWrapRef.current, {
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
        });
      }

      gsap.to(frame, {
        autoAlpha: 0.15,
        scale: 0.88,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="home" ref={sectionRef} className={styles.hero} aria-label={t("الصفحة الرئيسية", "Home")}>
      <div className={styles.mediaLayer} aria-hidden="true" data-has-media={hasMedia || undefined}>
        <div ref={mediaWrapRef} className={styles.mediaWrap}>
          {!videoFailed && (
            <video
              className={styles.mediaEl}
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoFailed(true)}
            >
              <source src="/assets/brand/hero.mp4" type="video/mp4" />
              <source src="/assets/brand/hero.webm" type="video/webm" />
            </video>
          )}
          {videoFailed && !imageFailed && (
            <img
              className={styles.mediaEl}
              src="/assets/brand/hero.jpg"
              alt=""
              onError={() => setImageFailed(true)}
            />
          )}
        </div>
        <div className={styles.mediaScrim} />
      </div>

      <div className={styles.ambient} aria-hidden="true">
        <span className={styles.glowOne} />
        <span className={styles.glowTwo} />
        <svg className={styles.leafOne} viewBox="0 0 24 24" fill="none">
          <path d="M12 2C7 5 4 10 6 16c1.6 4.8 6 6 6 6s4.4-1.2 6-6c2-6-1-11-6-14Z" stroke="currentColor" strokeWidth="1.1" />
        </svg>
        <svg className={styles.leafTwo} viewBox="0 0 24 24" fill="none">
          <path d="M12 2C7 5 4 10 6 16c1.6 4.8 6 6 6 6s4.4-1.2 6-6c2-6-1-11-6-14Z" stroke="currentColor" strokeWidth="1.1" />
        </svg>
      </div>
      <div className="container">
        <div className={styles.frame} data-media={hasMedia || undefined} ref={frameRef}>
          <div className={styles.topMeta} data-reveal>
            <span>{t("النجف الأشرف · حي السلام", "NAJAF · AL-SALAM")}</span>
            <span className={styles.dot} aria-hidden="true" />
            <span>{t("قهوة مختصة", "SPECIALTY COFFEE")}</span>
            {brand.rating ? (
              <>
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.rating}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="m12 3 2.8 5.8 6.2.9-4.5 4.5 1.1 6.3L12 17.6 6.4 20.5l1.1-6.3L3 9.7l6.2-.9Z" />
                  </svg>
                  {brand.rating}
                </span>
              </>
            ) : null}
          </div>

          <div className={styles.emblemRing} data-reveal>
            <img
              className={styles.logo}
              src="/assets/brand/logo.jpg"
              alt={brand.name[lang]}
              width={86}
              height={86}
            />
          </div>

          <h1 className={styles.wordmark} data-reveal>BONSAI</h1>
          <p className={styles.enMotto} data-reveal>THE DETAILS SPEAK FOR YOU</p>
          <p className={styles.tagline} data-reveal>{brand.tagline[lang]}</p>

          <div className={styles.actions} data-reveal>
            <a href="#menu" className={styles.primaryCta}>
              <span>{t("تصفح المنيو", "Explore Menu")}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                style={{ transform: lang === "ar" ? "scaleX(-1)" : undefined }}
              >
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            {onOpenBooking && (
              <button type="button" className={styles.secondaryCta} onClick={onOpenBooking}>
                {t("حجز طاولة", "Reserve a Table")}
              </button>
            )}
          </div>

          <div className={styles.infoBar} data-reveal>
            <div className={styles.infoItem}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>{brand.hours[lang]}</span>
            </div>
            <div className={styles.infoItem}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 21s-6.5-5.7-6.5-10.5a6.5 6.5 0 1 1 13 0C18.5 15.3 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="10.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span>{brand.address[lang]}</span>
            </div>
          </div>
        </div>
      </div>

      <a href="#menu" className={styles.scrollCue} aria-label={t("انتقل إلى المنيو", "Scroll to menu")}>
        <svg width="18" height="28" viewBox="0 0 18 28" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="16" height="26" rx="8" stroke="currentColor" strokeWidth="1.4" />
          <circle className={styles.scrollDot} cx="9" cy="8" r="2.2" fill="currentColor" />
        </svg>
      </a>
    </section>
  );
}
