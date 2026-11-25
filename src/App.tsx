import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import styles from "./App.module.css";
import type { Product } from "./types";
import { useLang } from "./hooks/useLang";
import { useCart } from "./hooks/useCart";
import { useMenuData } from "./hooks/useMenuData";
import { useToast } from "./context/ToastContext";
import { SplashScreen } from "./components/SplashScreen";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { Hero } from "./components/Hero";
import { SearchBar } from "./components/SearchBar";
import { CategoryTabs } from "./components/CategoryTabs";
import { MenuSection } from "./components/MenuSection";
import { MenuSkeleton } from "./components/Skeleton";
import { ProductModal } from "./components/ProductModal";
import { CartDrawer } from "./components/CartDrawer";
import { EventsSection } from "./components/EventsSection";
import { ExtrasSection } from "./components/ExtrasSection";
import { AboutSection } from "./components/AboutSection";
import { ReviewsSection } from "./components/ReviewsSection";
import { Footer } from "./components/Footer";
import { GiftModal } from "./components/GiftModal";
import { BookingModal } from "./components/BookingModal";
import { MembershipModal } from "./components/MembershipModal";
import { AssistantWidget } from "./components/AssistantWidget";

const AdminApp = lazy(() => import("./admin/AdminApp"));

// BASE_URL is "/" on Vercel and "/bonsai-cafe/" on GitHub Pages — strip it
// before matching so the admin route works under either deployment.
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

function isAdminPath(pathname: string): boolean {
  const relative = pathname.startsWith(BASE_PATH) ? pathname.slice(BASE_PATH.length) : pathname;
  return relative === "/admin" || relative.startsWith("/admin/");
}

export default function App() {
  const { lang, toggleLang, themePreference, setThemePreference } = useLang();
  const [routeIsAdmin, setRouteIsAdmin] = useState(() => isAdminPath(window.location.pathname));

  useEffect(() => {
    function onPopState() {
      setRouteIsAdmin(isAdminPath(window.location.pathname));
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((path: string) => {
    const fullPath = `${BASE_PATH}${path}`;
    if (window.location.pathname !== fullPath) {
      window.history.pushState({}, "", fullPath);
    }
    setRouteIsAdmin(isAdminPath(fullPath));
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  if (routeIsAdmin) {
    return (
      <Suspense
        fallback={
          <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "var(--color-text-muted)" }}>
            {lang === "ar" ? "جاري تحميل لوحة الإدارة..." : "Loading Admin Console..."}
          </div>
        }
      >
        <AdminApp
          lang={lang}
          onToggleLang={toggleLang}
          themePreference={themePreference}
          onChangeTheme={setThemePreference}
          onBackToMenu={() => navigate("/")}
        />
      </Suspense>
    );
  }

  return (
    <PublicMenuApp
      lang={lang}
      onToggleLang={toggleLang}
      themePreference={themePreference}
      onChangeTheme={setThemePreference}
    />
  );
}

function PublicMenuApp({
  lang,
  onToggleLang,
  themePreference,
  onChangeTheme,
}: {
  lang: "ar" | "en";
  onToggleLang: () => void;
  themePreference: "system" | "light" | "dark";
  onChangeTheme: (v: "system" | "light" | "dark") => void;
}) {
  const { categories, products, brand, events, loading } = useMenuData();
  const cart = useCart();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(() => categories[0]?.id ?? "");
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);

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

  const signatureCount = products.filter((p) => p.tags?.includes("signature")).length;

  return (
    <>
      <SplashScreen ready={!loading} tagline={brand.tagline[lang]} />
      <a href="#menu" className="skip-link">{t("تخطَّ إلى المنيو", "Skip to menu")}</a>

      <Header
        lang={lang}
        onToggleLang={onToggleLang}
        themePreference={themePreference}
        onChangeTheme={onChangeTheme}
        cartCount={cart.itemCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenGift={() => setGiftOpen(true)}
        onOpenMembership={() => setMembershipOpen(true)}
        onOpenBooking={() => setBookingOpen(true)}
        brandName={brand.name[lang]}
      />

      <main>
        <Hero lang={lang} brand={brand} onOpenBooking={() => setBookingOpen(true)} />

        <section id="menu" aria-labelledby="menu-h">
          <div className="container" style={{ paddingTop: "var(--space-3)" }}>
            <h2 id="menu-h" className="visually-hidden">{t("المنيو", "Menu")}</h2>
            <SearchBar lang={lang} value={searchTerm} onChange={setSearchTerm} />
            <a href="#reviews" className={styles.rateChip}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: "var(--color-gold)" }}>
                <path d="m12 3 2.8 5.8 6.2.9-4.5 4.5 1.1 6.3L12 17.6 6.4 20.5l1.1-6.3L3 9.7l6.2-.9Z" />
              </svg>
              {t("تقييم الطلب", "Rate your order")}
            </a>
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

        <EventsSection lang={lang} events={events} />
        <ExtrasSection
          lang={lang}
          onOpenGift={() => setGiftOpen(true)}
          onOpenBooking={() => setBookingOpen(true)}
          onOpenMembership={() => setMembershipOpen(true)}
        />

        <AboutSection
          lang={lang}
          brand={brand}
          productCount={products.length}
          categoryCount={categories.length}
          signatureCount={signatureCount}
        />
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

      <GiftModal lang={lang} open={giftOpen} onClose={() => setGiftOpen(false)} products={products} brand={brand} />
      <BookingModal lang={lang} open={bookingOpen} onClose={() => setBookingOpen(false)} brand={brand} />
      <MembershipModal lang={lang} open={membershipOpen} onClose={() => setMembershipOpen(false)} />
      <AssistantWidget lang={lang} products={products} categories={categories} brand={brand} />
    </>
  );
}
