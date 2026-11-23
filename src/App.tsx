import { useState } from "react";
import type { Product } from "./types";
import { useLang } from "./hooks/useLang";
import { useCart } from "./hooks/useCart";
import { useMenuData } from "./hooks/useMenuData";
import { useToast } from "./context/ToastContext";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { Hero } from "./components/Hero";
import { QuickActions } from "./components/QuickActions";
import { SearchBar } from "./components/SearchBar";
import { CategoryTabs } from "./components/CategoryTabs";
import { MenuSection } from "./components/MenuSection";
import { MenuSkeleton } from "./components/Skeleton";
import { ProductModal } from "./components/ProductModal";
import { CartDrawer } from "./components/CartDrawer";
import { AboutSection } from "./components/AboutSection";
import { ReviewsSection } from "./components/ReviewsSection";
import { Footer } from "./components/Footer";

export default function App() {
  const { lang, toggleLang, theme, toggleTheme } = useLang();
  const { categories, products, brand, loading } = useMenuData();
  const cart = useCart();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(() => categories[0]?.id ?? "");
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);

  function handleQuickAdd(product: Product) {
    cart.addLine({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: 1,
      addonIds: [],
      addonNames: [],
    });
    toast.show(t(`تمت إضافة ${product.name.ar}`, `Added ${product.name.en}`), "success");
  }

  function handleAddFromModal(product: Product, quantity: number, note: string) {
    cart.addLine({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity,
      addonIds: [],
      addonNames: [],
      note: note || undefined,
    });
    toast.show(t(`تمت إضافة ${product.name.ar}`, `Added ${product.name.en}`), "success");
  }

  function jumpToCategory(id: string) {
    setActiveCategory(id);
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <a href="#menu" className="skip-link">{t("تخطَّ إلى المنيو", "Skip to menu")}</a>

      <Header
        lang={lang}
        onToggleLang={toggleLang}
        theme={theme}
        onToggleTheme={toggleTheme}
        cartCount={cart.itemCount}
        onOpenCart={() => setCartOpen(true)}
        brandName={brand.name[lang]}
      />

      <main>
        <Hero lang={lang} brand={brand} />
        <QuickActions lang={lang} brand={brand} />

        <section id="menu" aria-labelledby="menu-h">
          <div className="container" style={{ paddingTop: "var(--space-4)" }}>
            <h2 id="menu-h" className="visually-hidden">{t("المنيو", "Menu")}</h2>
            <SearchBar lang={lang} value={searchTerm} onChange={setSearchTerm} />
          </div>
          {!searchTerm && (
            <div className="container">
              <CategoryTabs lang={lang} categories={categories} activeId={activeCategory} onSelect={jumpToCategory} />
            </div>
          )}

          {loading ? (
            <MenuSkeleton />
          ) : (
            <MenuSection
              lang={lang}
              categories={categories}
              products={products}
              searchTerm={searchTerm}
              onOpenProduct={setOpenProduct}
              onQuickAdd={handleQuickAdd}
            />
          )}
        </section>

        <AboutSection lang={lang} brand={brand} />
        <ReviewsSection lang={lang} />
      </main>

      <Footer lang={lang} brand={brand} />

      <BottomNav
        lang={lang}
        cartCount={cart.itemCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => {
          document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
          document.getElementById("menu-search")?.focus();
        }}
        activeSection="menu"
      />

      <ProductModal key={openProduct?.id ?? "closed"} lang={lang} product={openProduct} onClose={() => setOpenProduct(null)} onAdd={handleAddFromModal} />

      <CartDrawer
        lang={lang}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        lines={cart.lines}
        total={cart.total}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeLine}
        onOrderSent={() => {
          cart.clear();
          setCartOpen(false);
          toast.show(t("تم إرسال طلبك عبر واتساب!", "Your order was sent via WhatsApp!"), "success");
        }}
        brand={brand}
      />
    </>
  );
}
