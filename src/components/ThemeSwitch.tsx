import type { Lang } from "../types";
import type { ThemePreference } from "../hooks/useLang";
import styles from "./ThemeSwitch.module.css";

interface Props {
  lang: Lang;
  value: ThemePreference;
  onChange: (value: ThemePreference) => void;
}

const OPTIONS: Array<{ value: ThemePreference; ar: string; en: string }> = [
  { value: "system", ar: "تلقائي (النظام)", en: "System theme" },
  { value: "light", ar: "الوضع الفاتح", en: "Light mode" },
  { value: "dark", ar: "الوضع الداكن", en: "Dark mode" },
];

export function ThemeSwitch({ lang, value, onChange }: Props) {
  return (
    <div
      className={styles.capsule}
      role="radiogroup"
      aria-label={lang === "ar" ? "تبديل المظهر" : "Theme switch"}
    >
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={lang === "ar" ? opt.ar : opt.en}
            title={lang === "ar" ? opt.ar : opt.en}
            className={`${styles.btn} ${active ? styles.active : ""}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.value === "system" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
                <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            )}
            {opt.value === "light" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
                <path
                  d="M12 2.5v2M12 19.5v2M4.3 4.3l1.4 1.4M18.3 18.3l1.4 1.4M2.5 12h2M19.5 12h2M4.3 19.7l1.4-1.4M18.3 5.7l1.4-1.4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {opt.value === "dark" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.8 6.8 0 0 0 9.7 9.7Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
