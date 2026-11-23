import { useCallback, useEffect, useState } from "react";
import type { Lang } from "../types";

type Theme = "light" | "dark";

export function useLang() {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem("bonsai_lang") as Lang) || "ar";
  });
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("bonsai_theme") as Theme | null;
    if (stored) return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("bonsai_lang", lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("bonsai_theme", theme);
  }, [theme]);

  const toggleLang = useCallback(() => setLang((l) => (l === "ar" ? "en" : "ar")), []);
  const toggleTheme = useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), []);

  return { lang, setLang, toggleLang, theme, setTheme, toggleTheme };
}
