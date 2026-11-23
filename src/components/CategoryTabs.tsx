import { useRef } from "react";
import type { Category, Lang } from "../types";
import styles from "./CategoryTabs.module.css";

interface Props {
  lang: Lang;
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function CategoryTabs({ lang, categories, activeId, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function handleSelect(id: string, el: HTMLButtonElement) {
    onSelect(id);
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  return (
    <div ref={ref} className={`${styles.tabs} scroll-x`} role="tablist" aria-label={lang === "ar" ? "الأقسام" : "Categories"}>
      {categories.map((c) => (
        <button
          key={c.id}
          role="tab"
          aria-selected={c.id === activeId}
          className={`${styles.tab} ${c.id === activeId ? styles.active : ""}`}
          onClick={(e) => handleSelect(c.id, e.currentTarget)}
        >
          {c.name[lang]}
        </button>
      ))}
    </div>
  );
}
