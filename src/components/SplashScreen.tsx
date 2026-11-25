import { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

function SplashMedia() {
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={styles.media} aria-hidden="true">
      {!videoFailed && (
        <video className={styles.mediaEl} autoPlay muted loop playsInline onError={() => setVideoFailed(true)}>
          <source src="assets/brand/splash.mp4" type="video/mp4" />
          <source src="assets/brand/splash.webm" type="video/webm" />
        </video>
      )}
      {videoFailed && !imageFailed && (
        <img className={styles.mediaEl} src="assets/brand/splash.jpg" alt="" onError={() => setImageFailed(true)} />
      )}
      <div className={styles.mediaScrim} />
    </div>
  );
}

/** Brief branded splash shown the moment the app opens — QR scans should
 *  see the Bonsai mark immediately, not a blank screen. Fades out once the
 *  menu data is ready AND the full entrance sequence has had time to play,
 *  or after a hard cap either way. */
export function SplashScreen({ ready, tagline }: { ready: boolean; tagline: string }) {
  const [visible, setVisible] = useState(true);
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const min = window.setTimeout(() => setMinElapsed(true), 1450);
    const cap = window.setTimeout(() => setMinElapsed(true), 2600);
    return () => {
      window.clearTimeout(min);
      window.clearTimeout(cap);
    };
  }, []);

  const leaving = ready && minElapsed;

  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setVisible(false), 420);
    return () => window.clearTimeout(t);
  }, [leaving]);

  if (!visible) return null;

  const letters = "BONSAI".split("");

  return (
    <div className={`${styles.splash} ${leaving ? styles.leaving : ""}`} role="presentation">
      <SplashMedia />
      <div className={styles.rings} aria-hidden="true">
        <span className={styles.ring} />
        <span className={styles.ring} />
      </div>
      <img className={styles.logo} src="assets/brand/logo.jpg" alt="" width={84} height={84} />
      <p className={styles.wordmark} aria-label="BONSAI">
        {letters.map((ch, i) => (
          <span key={i} style={{ animationDelay: `${300 + i * 65}ms` }}>
            {ch}
          </span>
        ))}
      </p>
      <p className={styles.tagline}>{tagline}</p>
    </div>
  );
}
