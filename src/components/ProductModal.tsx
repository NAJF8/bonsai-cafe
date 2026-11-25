import { useEffect, useId, useState } from "react";
import type { Lang, Product } from "../types";
import { formatIQD } from "../utils/currency";
import { ProductGlyph } from "../utils/productArt";
import styles from "./ProductModal.module.css";

interface Props {
  lang: Lang;
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product, quantity: number, note: string) => void;
}

export function ProductModal({ lang, product, onClose, onAdd }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  // Mounted with key={product.id} by the parent, so local state starts
  // fresh for every product without needing a reset effect.
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const titleId = useId();

  useEffect(() => {
    if (!product) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.handle} aria-hidden="true" />
        <button type="button" className={styles.close} onClick={onClose} aria-label={t("إغلاق", "Close")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div className={styles.image} style={{ background: "var(--color-pedestal)" }}>
          {product.image ? (
            <img className={styles.photo} src={product.image} alt="" />
          ) : (
            <ProductGlyph categoryId={product.categoryId} />
          )}
        </div>

        <div className={styles.body}>
          <h2 id={titleId} className={styles.name}>{product.name[lang]}</h2>
          {product.description && <p className={styles.description}>{product.description[lang]}</p>}
          <p className="price" style={{ fontSize: "var(--text-lg)" }}>{formatIQD(product.price, lang)}</p>

          {!product.available && (
            <p className={styles.unavailableNote}>
              {t("هذا المنتج غير متوفر حاليًا.", "This item is currently unavailable.")}
            </p>
          )}

          <label className={styles.noteLabel} htmlFor={`${titleId}-note`}>
            {t("ملاحظات (اختياري)", "Notes (optional)")}
          </label>
          <textarea
            id={`${titleId}-note`}
            className={styles.noteInput}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("مثال: بدون سكر، حليب لوز...", "e.g. less sugar, almond milk...")}
            rows={2}
            disabled={!product.available}
          />
        </div>

        <div className={styles.footer}>
          <div className={styles.qty}>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label={t("إنقاص الكمية", "Decrease quantity")}
              disabled={!product.available}
            >
              &minus;
            </button>
            <span aria-live="polite">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label={t("زيادة الكمية", "Increase quantity")}
              disabled={!product.available}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className={styles.addBtn}
            disabled={!product.available}
            onClick={() => {
              onAdd(product, quantity, note.trim());
              onClose();
            }}
          >
            {t("أضف", "Add")} &middot; {formatIQD(product.price * quantity, lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
