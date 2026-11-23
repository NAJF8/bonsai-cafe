import { useState } from "react";
import type { BrandSettings, Category, Lang, Product } from "../types";
import { answerLocally } from "../utils/assistant";
import styles from "./AssistantWidget.module.css";

interface Props {
  lang: Lang;
  products: Product[];
  categories: Category[];
  brand: BrandSettings;
}

interface Msg {
  from: "user" | "bot";
  text: string;
}

export function AssistantWidget({ lang, products, categories, brand }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: t("هلا! أسألني عن أي منتج، أو عن الدوام والموقع 🌿", "Hi! Ask me about any item, or our hours and location 🌿") },
  ]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const reply = answerLocally(text, lang, products, categories, brand);
    setMessages((prev) => [...prev, { from: "user", text }, { from: "bot", text: reply }]);
    setInput("");
  }

  return (
    <>
      <button
        type="button"
        className={styles.fab}
        onClick={() => setOpen((o) => !o)}
        aria-label={t("مساعد بونساي", "Bonsai assistant")}
        aria-expanded={open}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 5h16v10H9l-4 4v-4H4V5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="12" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
          </svg>
        )}
      </button>

      {open && (
        <div className={styles.panel} role="dialog" aria-label={t("مساعد بونساي", "Bonsai assistant")}>
          <div className={styles.header}>
            <span>🌿 {t("مساعد بونساي", "Bonsai Assistant")}</span>
            <span className={styles.badge}>{t("بحث محلي بدون إنترنت", "Local search, no AI service")}</span>
          </div>
          <div className={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} className={m.from === "user" ? styles.userMsg : styles.botMsg}>
                {m.text.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
            ))}
          </div>
          <form className={styles.form} onSubmit={handleSend}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("اكتب سؤالك...", "Type your question...")}
            />
            <button type="submit" aria-label={t("إرسال", "Send")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: lang === "ar" ? "scaleX(-1)" : undefined }}>
                <path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
