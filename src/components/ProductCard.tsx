import type { Lang, Product } from "../types";
import { formatIQD } from "../utils/currency";
import { ProductGlyph } from "../utils/productArt";
import styles from "./ProductCard.module.css";

interface Props {
  lang: Lang;
  product: Product;
  onOpen: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

const TAG_LABEL: Record<string, { ar: string; en: string }> = {
  signature: { ar: "توقيع بونساي", en: "Signature" },
  healthy: { ar: "بدون سكر", en: "Sugar Free" },
  bestseller: { ar: "الأكثر طلبًا", en: "Bestseller" },
  new: { ar: "جديد", en: "New" },
};

export function ProductCard({ lang, product, onOpen, onQuickAdd }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const tag = product.tags?.[0];

  return (
    <article className={`${styles.card} ${!product.available ? styles.unavailable : ""}`}>
      <div className={styles.imageWrap}>
        <button
          type="button"
          className={styles.imageBtn}
          onClick={() => onOpen(product)}
          aria-label={t(`عرض تفاصيل ${product.name.ar}`, `View details for ${product.name.en}`)}
        >
          <span className={styles.pedestal}>
            {product.image ? (
              <img className={styles.photo} src={product.image} alt={product.name[lang]} loading="lazy" />
            ) : (
              <ProductGlyph categoryId={product.categoryId} />
            )}
          </span>
        </button>

        {tag && (
          <span className={`${styles.tag} ${tag === "healthy" ? styles.tagHealthy : ""}`}>
            {TAG_LABEL[tag][lang]}
          </span>
        )}
        {!product.available && (
          <span className={styles.unavailableBadge}>{t("غير متوفر حاليًا", "Unavailable")}</span>
        )}
        {product.available && (
          <button
            type="button"
            className={styles.quickAdd}
            onClick={() => onQuickAdd(product)}
            aria-label={t(`أضف ${product.name.ar} إلى السلة`, `Add ${product.name.en} to cart`)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <button type="button" className={styles.info} onClick={() => onOpen(product)}>
        <span className={styles.name}>{product.name[lang]}</span>
        {product.description?.[lang] && (
          <span className={styles.desc}>{product.description[lang]}</span>
        )}
        <span className={`price ${styles.price}`}>{formatIQD(product.price, lang)}</span>
      </button>
    </article>
  );
}
