import type { Category, Lang, Product } from "../types";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "./EmptyState";
import styles from "./MenuSection.module.css";

interface Props {
  lang: Lang;
  categories: Category[];
  products: Product[];
  searchTerm: string;
  onOpenProduct: (p: Product) => void;
  onQuickAdd: (p: Product) => void;
}

export function MenuSection({ lang, categories, products, searchTerm, onOpenProduct, onQuickAdd }: Props) {
  const term = searchTerm.trim().toLowerCase();
  const filtered = term
    ? products.filter(
        (p) => p.name.ar.toLowerCase().includes(term) || p.name.en.toLowerCase().includes(term)
      )
    : products;

  if (term && filtered.length === 0) {
    return (
      <div className="container">
        <EmptyState
          title={lang === "ar" ? "لا توجد نتائج" : "No results"}
          description={
            lang === "ar"
              ? `لم نجد أي منتج يطابق "${searchTerm}"`
              : `We couldn't find anything matching "${searchTerm}"`
          }
        />
      </div>
    );
  }

  const groups = categories
    .map((c) => ({ category: c, items: filtered.filter((p) => p.categoryId === c.id).sort((a, b) => a.sortOrder - b.sortOrder) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className={styles.sections}>
      {groups.map(({ category, items }) => (
        <section key={category.id} id={`cat-${category.id}`} className="container" aria-labelledby={`cat-${category.id}-h`}>
          <div className={styles.sectionHead}>
            <h2 id={`cat-${category.id}-h`} className={styles.sectionTitle}>
              {category.name[lang]}
            </h2>
            <span className={styles.count}>
              {items.length} {lang === "ar" ? "صنف" : "items"}
            </span>
          </div>
          <div className={styles.grid}>
            {items.map((p) => (
              <ProductCard key={p.id} lang={lang} product={p} onOpen={onOpenProduct} onQuickAdd={onQuickAdd} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
