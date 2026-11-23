import { useRef } from "react";
import type { Lang } from "../types";
import styles from "./SearchBar.module.css";

interface Props {
  lang: Lang;
  value: string;
  onChange: (v: string) => void;
  id?: string;
}

export function SearchBar({ lang, value, onChange, id = "menu-search" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);

  return (
    <div className={styles.wrap} role="search">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={styles.icon} aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="m20 20-3.8-3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <label htmlFor={id} className="visually-hidden">
        {t("ابحث عن مشروب أو منتج", "Search drinks or desserts")}
      </label>
      <input
        id={id}
        ref={inputRef}
        type="search"
        inputMode="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("ابحث عن مشروب أو منتج...", "Search drinks or desserts...")}
        className={styles.input}
      />
      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          aria-label={t("مسح البحث", "Clear search")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
