import type { Lang } from "../types";
import styles from "./LanguageSwitch.module.css";

interface Props {
  lang: Lang;
  onToggle: () => void;
}

export function LanguageSwitch({ lang, onToggle }: Props) {
  const isAr = lang === "ar";
  return (
    <button
      type="button"
      className={styles.capsule}
      onClick={onToggle}
      aria-label={isAr ? "تبديل اللغة إلى الإنجليزية" : "Switch language to Arabic"}
      aria-pressed={!isAr}
    >
      <span className={`${styles.thumb} ${isAr ? styles.thumbAr : styles.thumbEn}`} aria-hidden="true" />
      <span className={`${styles.label} ${isAr ? styles.active : ""}`}>AR</span>
      <span className={`${styles.label} ${!isAr ? styles.active : ""}`}>EN</span>
    </button>
  );
}
