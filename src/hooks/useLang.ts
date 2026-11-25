import { useCallback, useEffect, useState } from "react";
import type { Lang } from "../types";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

function resolveTheme(pref: ThemePreference): ResolvedTheme {
  if (pref === "system") {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return pref;
}

export function useLang() {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem("bonsai_lang");
    return stored === "en" ? "en" : "ar";
  });

  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    const stored = localStorage.getItem("bonsai_theme");
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(themePreference));

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
    document.title =
      lang === "ar"
        ? "Bonsai Café | بونساي كافيه — المنيو"
        : "Bonsai Café — Digital Menu";
    localStorage.setItem("bonsai_lang", lang);
  }, [lang]);

  useEffect(() => {
    const apply = () => {
      const next = resolveTheme(themePreference);
      setResolvedTheme(next);
      document.documentElement.dataset.theme = next;
    };
    apply();
    localStorage.setItem("bonsai_theme", themePreference);

    if (themePreference !== "system") return;
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [themePreference]);

  const toggleLang = useCallback(() => setLang((l) => (l === "ar" ? "en" : "ar")), []);
  const toggleTheme = useCallback(() => {
    setThemePreference((prev) => {
      const current = resolveTheme(prev);
      return current === "light" ? "dark" : "light";
    });
  }, []);

  return {
    lang,
    setLang,
    toggleLang,
    theme: resolvedTheme,
    themePreference,
    setThemePreference,
    toggleTheme,
  };
}
