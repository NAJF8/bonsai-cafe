import { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

/** Brief branded splash shown the moment the app opens — QR scans should
 *  see the Bonsai mark immediately, not a blank screen. Fades out once the
 *  menu data is ready AND a short minimum time has passed (so it never
 *  just flashes), or after a hard cap either way. */
export function SplashScreen({ ready }: { ready: boolean }) {
  const [visible, setVisible] = useState(true);
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const min = window.setTimeout(() => setMinElapsed(true), 500);
    const cap = window.setTimeout(() => setMinElapsed(true), 2200);
    return () => {
      window.clearTimeout(min);
      window.clearTimeout(cap);
    };
  }, []);

  const leaving = ready && minElapsed;

  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setVisible(false), 320);
    return () => window.clearTimeout(t);
  }, [leaving]);

  if (!visible) return null;

  const letters = "BONSAI".split("");

  return (
    <div className={`${styles.splash} ${leaving ? styles.leaving : ""}`} role="presentation">
      <div className={styles.ring} aria-hidden="true" />
      <img className={styles.logo} src="/assets/brand/logo.jpg" alt="" width={84} height={84} />
      <p className={styles.wordmark} aria-label="BONSAI">
        {letters.map((ch, i) => (
          <span key={i} style={{ animationDelay: `${260 + i * 60}ms` }}>
            {ch}
          </span>
        ))}
      </p>
    </div>
  );
}
