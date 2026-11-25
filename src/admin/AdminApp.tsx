import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type {
  BookingRequest,
  BrandSettings,
  CafeEvent,
  Category,
  GiftOrder,
  Lang,
  Member,
  Product,
  Review,
} from "../types";
import type { ThemePreference } from "../hooks/useLang";
import { categories as seedCategories } from "../data/categories";
import { products as seedProducts } from "../data/products";
import { brand as seedBrand } from "../data/brand";
import { events as seedEvents } from "../data/events";
import { productImageCatalog } from "../data/productImages";
import { formatIQD } from "../utils/currency";
import { useToast } from "../context/ToastContext";
import {
  createAdminDoc,
  deleteAdminDoc,
  fetchAdminCollection,
  saveAdminDoc,
  signOutAdmin,
  subscribeAdminAuth,
  type AdminUser,
} from "../lib/firebaseAdmin";
import { ThemeSwitch } from "../components/ThemeSwitch";
import { LanguageSwitch } from "../components/LanguageSwitch";
import { AdminLogin } from "./AdminLogin";
import styles from "./AdminApp.module.css";

type Section =
  | "overview"
  | "products"
  | "categories"
  | "bookings"
  | "gifts"
  | "members"
  | "events"
  | "reviews"
  | "settings";

interface Props {
  lang: Lang;
  onToggleLang: () => void;
  themePreference: ThemePreference;
  onChangeTheme: (v: ThemePreference) => void;
  onBackToMenu: () => void;
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `item-${Date.now()}`
  );
}

export default function AdminApp({
  lang,
  onToggleLang,
  themePreference,
  onChangeTheme,
  onBackToMenu,
}: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const toast = useToast();

  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);

  // Data state
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [brand, setBrand] = useState<BrandSettings>(seedBrand);
  const [events, setEvents] = useState<CafeEvent[]>(seedEvents);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [gifts, setGifts] = useState<GiftOrder[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Filters
  const [prodQuery, setProdQuery] = useState("");
  const [prodCatFilter, setProdCatFilter] = useState("all");
  const [bookingFilter, setBookingFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [giftFilter, setGiftFilter] = useState<"all" | "pending" | "redeemed">("all");
  const [memberQuery, setMemberQuery] = useState("");

  // Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CafeEvent | null>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  // Confirm delete dialog
  const confirmRef = useRef<HTMLDialogElement>(null);
  const [confirmState, setConfirmState] = useState<{
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  const canWrite = Boolean(user);

  useEffect(() => {
    return subscribeAdminAuth((u, ready) => {
      setUser(u);
      setAuthReady(ready);
      if (u) setPreviewMode(false);
    });
  }, []);

  const loadAllData = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [cats, prods, settingsDocs, evs, bks, gfs, mems, revs] = await Promise.all([
        fetchAdminCollection<Category>("categories"),
        fetchAdminCollection<Product>("products"),
        fetchAdminCollection<BrandSettings & { id: string }>("settings"),
        fetchAdminCollection<CafeEvent>("events"),
        fetchAdminCollection<BookingRequest>("bookings"),
        fetchAdminCollection<GiftOrder>("gifts"),
        fetchAdminCollection<Member & { id: string }>("members"),
        fetchAdminCollection<Review>("reviews"),
      ]);
      if (cats.length) setCategories([...cats].sort((a, b) => a.sortOrder - b.sortOrder));
      if (prods.length) setProducts([...prods].sort((a, b) => a.sortOrder - b.sortOrder));
      if (settingsDocs.length) setBrand(settingsDocs[0]);
      setEvents([...evs].sort((a, b) => a.sortOrder - b.sortOrder));
      setBookings(bks);
      setGifts(gfs);
      setMembers(mems.map((m) => ({ ...m, phone: m.phone || m.id })));
      setReviews(revs);
    } catch (err) {
      console.error("[admin] failed to load collections", err);
      toast.show(
        lang === "ar"
          ? "تعذر تحميل بعض البيانات من Firestore. تحقق من صلاحيات الحساب."
          : "Failed to load some Firestore data.",
        "error"
      );
    } finally {
      setLoadingData(false);
    }
  }, [user, toast, lang]);

  useEffect(() => {
    if (!user) return;
    const id = window.setTimeout(() => {
      void loadAllData();
    }, 0);
    return () => window.clearTimeout(id);
  }, [user, loadAllData]);

  function openConfirm(title: string, message: string, onConfirm: () => Promise<void>) {
    setConfirmState({ title, message, onConfirm });
    requestAnimationFrame(() => confirmRef.current?.showModal());
  }

  function closeConfirm() {
    confirmRef.current?.close();
    setConfirmState(null);
  }

  function requireWrite(): boolean {
    if (canWrite) return true;
    toast.show(
      t("أنت في وضع المعاينة (قراءة فقط). سجّل الدخول لحفظ التعديلات.", "Read-only preview mode. Sign in to save changes."),
      "info"
    );
    return false;
  }

  // ---- Product Handlers ----
  async function handleToggleAvailability(p: Product) {
    if (!requireWrite()) return;
    const next = !p.available;
    setProducts((prev) => prev.map((item) => (item.id === p.id ? { ...item, available: next } : item)));
    try {
      await saveAdminDoc("products", p.id, { available: next });
      toast.show(
        next ? t("تم تفعيل توفر المنتج", "Product marked available") : t("تم تعطيل توفر المنتج", "Product marked unavailable"),
        "success"
      );
    } catch {
      setProducts((prev) => prev.map((item) => (item.id === p.id ? { ...item, available: !next } : item)));
      toast.show(t("فشل تحديث حالة المنتج", "Failed to update product"), "error");
    }
  }

  async function handleSaveProduct(data: Product) {
    if (!requireWrite()) return;
    setSaving(true);
    try {
      await saveAdminDoc("products", data.id, data as unknown as Record<string, unknown>);
      setProducts((prev) => {
        const exists = prev.some((x) => x.id === data.id);
        const list = exists ? prev.map((x) => (x.id === data.id ? data : x)) : [...prev, data];
        return list.sort((a, b) => a.sortOrder - b.sortOrder);
      });
      setProductModalOpen(false);
      setEditingProduct(null);
      toast.show(t("تم حفظ المنتج بنجاح", "Product saved"), "success");
    } catch {
      toast.show(t("تعذر حفظ المنتج", "Failed to save product"), "error");
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteProduct(p: Product) {
    if (!requireWrite()) return;
    openConfirm(
      t("حذف المنتج", "Delete Product"),
      t(`هل أنت متأكد من حذف "${p.name.ar}" نهائياً؟`, `Permanently delete "${p.name.en}"?`),
      async () => {
        await deleteAdminDoc("products", p.id);
        setProducts((prev) => prev.filter((x) => x.id !== p.id));
        toast.show(t("تم حذف المنتج", "Product deleted"), "success");
      }
    );
  }

  // ---- Category Handlers ----
  async function handleSaveCategory(cat: Category) {
    if (!requireWrite()) return;
    setSaving(true);
    try {
      await saveAdminDoc("categories", cat.id, cat as unknown as Record<string, unknown>);
      setCategories((prev) => {
        const exists = prev.some((x) => x.id === cat.id);
        const list = exists ? prev.map((x) => (x.id === cat.id ? cat : x)) : [...prev, cat];
        return list.sort((a, b) => a.sortOrder - b.sortOrder);
      });
      setCategoryModalOpen(false);
      setEditingCategory(null);
      toast.show(t("تم حفظ التصنيف بنجاح", "Category saved"), "success");
    } catch {
      toast.show(t("تعذر حفظ التصنيف", "Failed to save category"), "error");
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteCategory(cat: Category) {
    if (!requireWrite()) return;
    openConfirm(
      t("حذف التصنيف", "Delete Category"),
      t(`حذف تصنيف "${cat.name.ar}"؟`, `Delete category "${cat.name.en}"?`),
      async () => {
        await deleteAdminDoc("categories", cat.id);
        setCategories((prev) => prev.filter((x) => x.id !== cat.id));
        toast.show(t("تم حذف التصنيف", "Category deleted"), "success");
      }
    );
  }

  // ---- Booking Handlers ----
  async function handleUpdateBookingStatus(b: BookingRequest, status: BookingRequest["status"]) {
    if (!requireWrite() || !b.id) return;
    try {
      await saveAdminDoc("bookings", b.id, { status });
      setBookings((prev) => prev.map((x) => (x.id === b.id ? { ...x, status } : x)));
      toast.show(t("تم تحديث حالة الحجز", "Booking updated"), "success");
    } catch {
      toast.show(t("تعذر تحديث الحجز", "Failed to update booking"), "error");
    }
  }

  function handleDeleteBooking(b: BookingRequest) {
    if (!requireWrite() || !b.id) return;
    const docId = b.id;
    openConfirm(
      t("حذف الحجز", "Delete Booking"),
      t(`حذف حجز "${b.name}"؟`, `Delete booking for "${b.name}"?`),
      async () => {
        await deleteAdminDoc("bookings", docId);
        setBookings((prev) => prev.filter((x) => x.id !== docId));
        toast.show(t("تم حذف الحجز", "Booking deleted"), "success");
      }
    );
  }

  // ---- Gift Handlers ----
  async function handleToggleGiftStatus(g: GiftOrder) {
    if (!requireWrite() || !g.id) return;
    const status: GiftOrder["status"] = g.status === "pending" ? "redeemed" : "pending";
    try {
      await saveAdminDoc("gifts", g.id, { status });
      setGifts((prev) => prev.map((x) => (x.id === g.id ? { ...x, status } : x)));
      toast.show(t("تم تحديث حالة الهدية", "Gift status updated"), "success");
    } catch {
      toast.show(t("تعذر تحديث الهدية", "Failed to update gift"), "error");
    }
  }

  // ---- Member Handlers ----
  async function handleAdjustPoints(m: Member, delta: number) {
    if (!requireWrite()) return;
    const nextPoints = Math.max(0, (m.points ?? 0) + delta);
    try {
      await saveAdminDoc("members", m.phone, { points: nextPoints });
      setMembers((prev) => prev.map((x) => (x.phone === m.phone ? { ...x, points: nextPoints } : x)));
      toast.show(t("تم تحديث نقاط العضو", "Member points updated"), "success");
    } catch {
      toast.show(t("تعذر تحديث النقاط", "Failed to update points"), "error");
    }
  }

  // ---- Event Handlers ----
  async function handleSaveEvent(ev: CafeEvent, isNew: boolean) {
    if (!requireWrite()) return;
    setSaving(true);
    try {
      if (isNew) {
        const id = await createAdminDoc("events", {
          title: ev.title,
          description: ev.description,
          date: ev.date,
          time: ev.time,
          price: ev.price,
          sortOrder: ev.sortOrder,
        });
        setEvents((prev) => [...prev, { ...ev, id }].sort((a, b) => a.sortOrder - b.sortOrder));
      } else {
        await saveAdminDoc("events", ev.id, ev as unknown as Record<string, unknown>);
        setEvents((prev) => prev.map((x) => (x.id === ev.id ? ev : x)).sort((a, b) => a.sortOrder - b.sortOrder));
      }
      setEventModalOpen(false);
      setEditingEvent(null);
      toast.show(t("تم حفظ الفعالية", "Event saved"), "success");
    } catch {
      toast.show(t("تعذر حفظ الفعالية", "Failed to save event"), "error");
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteEvent(ev: CafeEvent) {
    if (!requireWrite()) return;
    openConfirm(
      t("حذف الفعالية", "Delete Event"),
      t(`حذف فعالية "${ev.title.ar}"؟`, `Delete event "${ev.title.en}"?`),
      async () => {
        await deleteAdminDoc("events", ev.id);
        setEvents((prev) => prev.filter((x) => x.id !== ev.id));
        toast.show(t("تم حذف الفعالية", "Event deleted"), "success");
      }
    );
  }

  // ---- Review Handler ----
  function handleDeleteReview(r: Review) {
    if (!requireWrite() || !r.id) return;
    const docId = r.id;
    openConfirm(
      t("حذف التقييم", "Delete Review"),
      t("هل تريد حذف هذا التقييم نهائياً؟", "Permanently delete this review?"),
      async () => {
        await deleteAdminDoc("reviews", docId);
        setReviews((prev) => prev.filter((x) => x.id !== docId));
        toast.show(t("تم حذف التقييم", "Review deleted"), "success");
      }
    );
  }

  // ---- Brand Settings Handler ----
  async function handleSaveSettings(e: FormEvent) {
    e.preventDefault();
    if (!requireWrite()) return;
    setSaving(true);
    try {
      await saveAdminDoc("settings", "brand", brand as unknown as Record<string, unknown>);
      toast.show(t("تم حفظ إعدادات المقهى بنجاح", "Brand settings saved"), "success");
    } catch {
      toast.show(t("تعذر حفظ الإعدادات", "Failed to save settings"), "error");
    } finally {
      setSaving(false);
    }
  }

  // Computed stats
  const availableCount = useMemo(() => products.filter((p) => p.available).length, [products]);
  const pendingBookingsCount = useMemo(() => bookings.filter((b) => b.status === "pending").length, [bookings]);
  const pendingGiftsCount = useMemo(() => gifts.filter((g) => g.status === "pending").length, [gifts]);
  const avgReview = useMemo(() => {
    if (!reviews.length) return brand.rating ?? 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews, brand.rating]);

  const filteredProducts = useMemo(() => {
    const q = prodQuery.trim().toLowerCase();
    return products.filter((p) => {
      if (prodCatFilter !== "all" && p.categoryId !== prodCatFilter) return false;
      if (!q) return true;
      return p.name.ar.toLowerCase().includes(q) || p.name.en.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    });
  }, [products, prodQuery, prodCatFilter]);

  const filteredBookings = useMemo(
    () => bookings.filter((b) => bookingFilter === "all" || b.status === bookingFilter),
    [bookings, bookingFilter]
  );

  const filteredGifts = useMemo(
    () => gifts.filter((g) => giftFilter === "all" || g.status === giftFilter),
    [gifts, giftFilter]
  );

  const filteredMembers = useMemo(() => {
    const q = memberQuery.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => m.name.toLowerCase().includes(q) || m.phone.includes(q));
  }, [members, memberQuery]);

  if (!authReady) {
    return (
      <div className={styles.empty} role="status" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        {t("جاري التحقق من الجلسة...", "Checking session...")}
      </div>
    );
  }

  if (!user && !previewMode) {
    return (
      <AdminLogin
        lang={lang}
        onToggleLang={onToggleLang}
        themePreference={themePreference}
        onChangeTheme={onChangeTheme}
        onEnterPreview={() => setPreviewMode(true)}
        onBackToMenu={onBackToMenu}
      />
    );
  }

  const navItems: Array<{ id: Section; label: string; count?: number }> = [
    { id: "overview", label: t("نظرة عامة", "Overview") },
    { id: "products", label: t("المنتجات", "Products"), count: products.length },
    { id: "categories", label: t("التصنيفات", "Categories"), count: categories.length },
    { id: "bookings", label: t("الحجوزات", "Bookings"), count: pendingBookingsCount || undefined },
    { id: "gifts", label: t("الهدايا الرقمية", "Digital Gifts"), count: pendingGiftsCount || undefined },
    { id: "members", label: t("نادي بونساي", "Club Members"), count: members.length || undefined },
    { id: "events", label: t("الفعاليات", "Events"), count: events.length || undefined },
    { id: "reviews", label: t("التقييمات", "Reviews"), count: reviews.length || undefined },
    { id: "settings", label: t("إعدادات الهوية", "Brand Settings") },
  ];

  const activeNavLabel = navItems.find((n) => n.id === section)?.label ?? "";

  return (
    <div className={styles.shell}>
      {sidebarOpen && <div className={styles.mobileScrim} onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sideBrand}>
          <img className={styles.sideLogo} src="/assets/brand/logo.jpg" alt="Bonsai Café" width={40} height={40} />
          <div>
            <span className={styles.sideWordmark}>BONSAI</span>
            <span className={styles.sideSub}>{t("لوحة الإدارة", "Admin Console")}</span>
          </div>
        </div>

        <nav className={styles.nav} aria-label={t("أقسام الإدارة", "Admin sections")}>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.navItem} ${section === item.id ? styles.navActive : ""}`}
              aria-current={section === item.id ? "page" : undefined}
              onClick={() => {
                setSection(item.id);
                setSidebarOpen(false);
              }}
            >
              <span className={styles.navLeft}>{item.label}</span>
              {item.count !== undefined && <span className={styles.navBadge}>{item.count}</span>}
            </button>
          ))}
        </nav>

        <div className={styles.sideFoot}>
          <div className={styles.userCard}>
            <strong>{user?.displayName || (previewMode ? t("وضع المعاينة", "Preview Mode") : t("مشرف", "Admin"))}</strong>
            <span className={styles.userEmail} dir="ltr">
              {user?.email || t("قراءة فقط", "Read-only")}
            </span>
          </div>
          <div className={styles.sideActions}>
            <button type="button" className={styles.ghostBtn} onClick={onBackToMenu}>
              {t("المنيو", "Menu")}
            </button>
            {user ? (
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={async () => {
                  await signOutAdmin();
                  toast.show(t("تم تسجيل الخروج", "Signed out"), "info");
                }}
              >
                {t("خروج", "Sign out")}
              </button>
            ) : (
              <button type="button" className={styles.ghostBtn} onClick={() => setPreviewMode(false)}>
                {t("دخول", "Sign in")}
              </button>
            )}
          </div>
        </div>
      </aside>

      <div className={styles.mainWrap}>
        <header className={styles.topbar}>
          <div className={styles.topLeft}>
            <button
              type="button"
              className={styles.menuToggle}
              onClick={() => setSidebarOpen((s) => !s)}
              aria-label={t("القائمة الجانبية", "Toggle sidebar")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <h1 className={styles.pageTitle}>{activeNavLabel}</h1>
          </div>

          <div className={styles.topRight}>
            {user && (
              <button type="button" className={styles.smallBtn} onClick={() => void loadAllData()} disabled={loadingData}>
                {loadingData ? t("جاري التحديث...", "Syncing...") : t("تحديث", "Refresh")}
              </button>
            )}
            <ThemeSwitch lang={lang} value={themePreference} onChange={onChangeTheme} />
            <LanguageSwitch lang={lang} onToggle={onToggleLang} />
          </div>
        </header>

        {previewMode && (
          <div className={styles.previewBanner} role="status">
            <span>
              {t(
                "وضع المعاينة (قراءة فقط): البيانات المعروضة محلية ولن تُحفظ في قاعدة البيانات إلا بعد تسجيل الدخول.",
                "Read-only preview mode: Sign in with Firebase Auth to load live Firestore records and save changes."
              )}
            </span>
            <button type="button" className={styles.smallBtn} onClick={() => setPreviewMode(false)}>
              {t("تسجيل الدخول الآن", "Sign in now")}
            </button>
          </div>
        )}

        <main className={styles.content}>
          {section === "overview" && (
            <>
              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>{t("إجمالي المنتجات", "Total Products")}</span>
                  <span className={styles.kpiValue}>{products.length}</span>
                  <span className={styles.kpiSub}>
                    {t(`${availableCount} متوفر حالياً`, `${availableCount} available`)}
                  </span>
                </div>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>{t("التصنيفات", "Categories")}</span>
                  <span className={styles.kpiValue}>{categories.length}</span>
                  <span className={styles.kpiSub}>{t("أقسام المنيو", "Menu sections")}</span>
                </div>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>{t("حجوزات بانتظار التأكيد", "Pending Bookings")}</span>
                  <span className={styles.kpiValue}>{pendingBookingsCount}</span>
                  <span className={styles.kpiSub}>{t(`من أصل ${bookings.length}`, `of ${bookings.length} total`)}</span>
                </div>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>{t("هدايا بانتظار الصرف", "Pending Gifts")}</span>
                  <span className={styles.kpiValue}>{pendingGiftsCount}</span>
                  <span className={styles.kpiSub}>{t(`من أصل ${gifts.length}`, `of ${gifts.length} total`)}</span>
                </div>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>{t("أعضاء نادي بونساي", "Club Members")}</span>
                  <span className={styles.kpiValue}>{members.length}</span>
                  <span className={styles.kpiSub}>{t("برنامج النقاط", "Rewards program")}</span>
                </div>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>{t("متوسط التقييم", "Avg Rating")}</span>
                  <span className={styles.kpiValue}>{avgReview} ★</span>
                  <span className={styles.kpiSub}>
                    {t(`${reviews.length} تقييم مسجل`, `${reviews.length} recorded reviews`)}
                  </span>
                </div>
              </div>

              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <h2 className={styles.panelTitle}>{t("إجراءات سريعة", "Quick Actions")}</h2>
                </div>
                <div className={styles.formGrid}>
                  <button
                    type="button"
                    className={styles.primaryBtn}
                    onClick={() => {
                      setSection("products");
                      setEditingProduct(null);
                      setProductModalOpen(true);
                    }}
                  >
                    + {t("إضافة منتج جديد", "Add New Product")}
                  </button>
                  <button
                    type="button"
                    className={styles.ghostBtn}
                    onClick={() => {
                      setSection("categories");
                      setEditingCategory(null);
                      setCategoryModalOpen(true);
                    }}
                  >
                    + {t("إضافة تصنيف جديد", "Add New Category")}
                  </button>
                  <button
                    type="button"
                    className={styles.ghostBtn}
                    onClick={() => {
                      setSection("events");
                      setEditingEvent(null);
                      setEventModalOpen(true);
                    }}
                  >
                    + {t("إضافة فعالية", "Add Event")}
                  </button>
                  <button type="button" className={styles.ghostBtn} onClick={() => setSection("settings")}>
                    {t("تعديل معلومات المقهى", "Edit Brand Settings")}
                  </button>
                </div>
              </div>
            </>
          )}

          {section === "products" && (
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <div className={styles.toolbar}>
                  <input
                    type="search"
                    className={styles.input}
                    value={prodQuery}
                    onChange={(e) => setProdQuery(e.target.value)}
                    placeholder={t("ابحث باسم المنتج...", "Search products...")}
                  />
                  <select
                    className={styles.select}
                    value={prodCatFilter}
                    onChange={(e) => setProdCatFilter(e.target.value)}
                    aria-label={t("تصفية حسب التصنيف", "Filter by category")}
                  >
                    <option value="all">{t("كل التصنيفات", "All categories")}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name[lang]}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => {
                    setEditingProduct(null);
                    setProductModalOpen(true);
                  }}
                >
                  + {t("إضافة منتج", "Add Product")}
                </button>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t("المنتج", "Product")}</th>
                      <th>{t("التصنيف", "Category")}</th>
                      <th>{t("السعر", "Price")}</th>
                      <th>{t("الحالة", "Status")}</th>
                      <th>{t("إجراءات", "Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => {
                      const cat = categories.find((c) => c.id === p.categoryId);
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className={styles.prodCell}>
                              {p.image && <img className={styles.thumb} src={p.image} alt="" loading="lazy" />}
                              <div>
                                <strong>{p.name[lang]}</strong>
                                <span className={styles.subText}>{lang === "ar" ? p.name.en : p.name.ar}</span>
                              </div>
                            </div>
                          </td>
                          <td>{cat?.name[lang] ?? p.categoryId}</td>
                          <td className="price">{formatIQD(p.price, lang)}</td>
                          <td>
                            <button
                              type="button"
                              className={`${styles.pill} ${p.available ? styles.pillSuccess : styles.pillDanger}`}
                              onClick={() => void handleToggleAvailability(p)}
                            >
                              {p.available ? t("متوفر", "Available") : t("غير متوفر", "Unavailable")}
                            </button>
                          </td>
                          <td>
                            <div className={styles.rowActions}>
                              <button
                                type="button"
                                className={styles.smallBtn}
                                onClick={() => {
                                  setEditingProduct(p);
                                  setProductModalOpen(true);
                                }}
                              >
                                {t("تعديل", "Edit")}
                              </button>
                              <button type="button" className={styles.dangerBtn} onClick={() => handleDeleteProduct(p)}>
                                {t("حذف", "Delete")}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {!filteredProducts.length && (
                      <tr>
                        <td colSpan={5} className={styles.empty}>
                          {t("لا توجد منتجات مطابقة للبحث.", "No matching products.")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === "categories" && (
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>{t("إدارة التصنيفات", "Manage Categories")}</h2>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryModalOpen(true);
                  }}
                >
                  + {t("إضافة تصنيف", "Add Category")}
                </button>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t("الترتيب", "Order")}</th>
                      <th>{t("الاسم بالعربية", "Arabic Name")}</th>
                      <th>{t("الاسم بالإنجليزية", "English Name")}</th>
                      <th>{t("عدد المنتجات", "Products")}</th>
                      <th>{t("إجراءات", "Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id}>
                        <td>{c.sortOrder}</td>
                        <td><strong>{c.name.ar}</strong></td>
                        <td>{c.name.en}</td>
                        <td>{products.filter((p) => p.categoryId === c.id).length}</td>
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              type="button"
                              className={styles.smallBtn}
                              onClick={() => {
                                setEditingCategory(c);
                                setCategoryModalOpen(true);
                              }}
                            >
                              {t("تعديل", "Edit")}
                            </button>
                            <button type="button" className={styles.dangerBtn} onClick={() => handleDeleteCategory(c)}>
                              {t("حذف", "Delete")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === "bookings" && (
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>{t("طلبات حجز الطاولات", "Table Reservations")}</h2>
                <select
                  className={styles.select}
                  value={bookingFilter}
                  onChange={(e) => setBookingFilter(e.target.value as typeof bookingFilter)}
                >
                  <option value="all">{t("الكل", "All")}</option>
                  <option value="pending">{t("قيد الانتظار", "Pending")}</option>
                  <option value="confirmed">{t("مؤكد", "Confirmed")}</option>
                  <option value="cancelled">{t("ملغي", "Cancelled")}</option>
                </select>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t("العميل", "Guest")}</th>
                      <th>{t("التاريخ والوقت", "Date & Time")}</th>
                      <th>{t("الأشخاص", "Party")}</th>
                      <th>{t("الحالة", "Status")}</th>
                      <th>{t("إجراءات", "Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <strong>{b.name}</strong>
                          <span className={styles.subText} dir="ltr">{b.phone}</span>
                        </td>
                        <td dir="ltr">{b.date} · {b.time}</td>
                        <td>{b.partySize}</td>
                        <td>
                          <span
                            className={`${styles.pill} ${
                              b.status === "confirmed"
                                ? styles.pillSuccess
                                : b.status === "cancelled"
                                  ? styles.pillDanger
                                  : styles.pillWarn
                            }`}
                          >
                            {b.status === "confirmed"
                              ? t("مؤكد", "Confirmed")
                              : b.status === "cancelled"
                                ? t("ملغي", "Cancelled")
                                : t("قيد الانتظار", "Pending")}
                          </span>
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              type="button"
                              className={styles.smallBtn}
                              onClick={() => void handleUpdateBookingStatus(b, "confirmed")}
                            >
                              {t("تأكيد", "Confirm")}
                            </button>
                            <button
                              type="button"
                              className={styles.smallBtn}
                              onClick={() => void handleUpdateBookingStatus(b, "cancelled")}
                            >
                              {t("إلغاء", "Cancel")}
                            </button>
                            <button type="button" className={styles.dangerBtn} onClick={() => handleDeleteBooking(b)}>
                              {t("حذف", "Delete")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!filteredBookings.length && (
                      <tr>
                        <td colSpan={5} className={styles.empty}>
                          {t("لا توجد حجوزات حالياً.", "No bookings found.")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === "gifts" && (
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>{t("طلبات الهدايا الرقمية", "Digital Gift Orders")}</h2>
                <select
                  className={styles.select}
                  value={giftFilter}
                  onChange={(e) => setGiftFilter(e.target.value as typeof giftFilter)}
                >
                  <option value="all">{t("الكل", "All")}</option>
                  <option value="pending">{t("غير مصروفة", "Pending")}</option>
                  <option value="redeemed">{t("تم صرفها", "Redeemed")}</option>
                </select>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t("الكود", "Code")}</th>
                      <th>{t("المرسل → المستلم", "Sender → Recipient")}</th>
                      <th>{t("الهدية", "Gift")}</th>
                      <th>{t("الحالة", "Status")}</th>
                      <th>{t("إجراء", "Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGifts.map((g) => (
                      <tr key={g.id ?? g.code}>
                        <td dir="ltr"><strong>{g.code}</strong></td>
                        <td>
                          {g.senderName} → {g.recipientName}
                          <span className={styles.subText} dir="ltr">{g.senderPhone}</span>
                        </td>
                        <td>{g.kind === "product" ? g.productName : formatIQD(g.amount ?? 0, lang)}</td>
                        <td>
                          <span className={`${styles.pill} ${g.status === "redeemed" ? styles.pillSuccess : styles.pillWarn}`}>
                            {g.status === "redeemed" ? t("مصروفة", "Redeemed") : t("بانتظار الصرف", "Pending")}
                          </span>
                        </td>
                        <td>
                          <button type="button" className={styles.smallBtn} onClick={() => void handleToggleGiftStatus(g)}>
                            {g.status === "pending" ? t("تأكيد الصرف", "Mark Redeemed") : t("إرجاع معلق", "Mark Pending")}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!filteredGifts.length && (
                      <tr>
                        <td colSpan={5} className={styles.empty}>
                          {t("لا توجد هدايا رقمية مسجلة.", "No digital gifts found.")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === "members" && (
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>{t("أعضاء نادي بونساي", "Bonsai Club Members")}</h2>
                <input
                  type="search"
                  className={styles.input}
                  value={memberQuery}
                  onChange={(e) => setMemberQuery(e.target.value)}
                  placeholder={t("بحث بالاسم أو الرقم...", "Search by name or phone...")}
                />
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t("الاسم", "Name")}</th>
                      <th>{t("رقم الهاتف", "Phone")}</th>
                      <th>{t("النقاط", "Points")}</th>
                      <th>{t("تعديل النقاط", "Adjust Points")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((m) => (
                      <tr key={m.phone}>
                        <td><strong>{m.name}</strong></td>
                        <td dir="ltr">{m.phone}</td>
                        <td><strong>{m.points}</strong></td>
                        <td>
                          <div className={styles.rowActions}>
                            <button type="button" className={styles.smallBtn} onClick={() => void handleAdjustPoints(m, 10)}>
                              +10
                            </button>
                            <button type="button" className={styles.smallBtn} onClick={() => void handleAdjustPoints(m, 50)}>
                              +50
                            </button>
                            <button type="button" className={styles.smallBtn} onClick={() => void handleAdjustPoints(m, -10)}>
                              -10
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!filteredMembers.length && (
                      <tr>
                        <td colSpan={4} className={styles.empty}>
                          {t("لا يوجد أعضاء مسجلون حالياً.", "No club members found.")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === "events" && (
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>{t("فعاليات المقهى", "Café Events")}</h2>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => {
                    setEditingEvent(null);
                    setEventModalOpen(true);
                  }}
                >
                  + {t("إضافة فعالية", "Add Event")}
                </button>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t("العنوان", "Title")}</th>
                      <th>{t("التاريخ", "Date")}</th>
                      <th>{t("الوقت", "Time")}</th>
                      <th>{t("السعر", "Price")}</th>
                      <th>{t("إجراءات", "Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev.id}>
                        <td>
                          <strong>{ev.title[lang]}</strong>
                          <span className={styles.subText}>{ev.description[lang]}</span>
                        </td>
                        <td dir="ltr">{ev.date}</td>
                        <td dir="ltr">{ev.time}</td>
                        <td>{ev.price[lang]}</td>
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              type="button"
                              className={styles.smallBtn}
                              onClick={() => {
                                setEditingEvent(ev);
                                setEventModalOpen(true);
                              }}
                            >
                              {t("تعديل", "Edit")}
                            </button>
                            <button type="button" className={styles.dangerBtn} onClick={() => handleDeleteEvent(ev)}>
                              {t("حذف", "Delete")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!events.length && (
                      <tr>
                        <td colSpan={5} className={styles.empty}>
                          {t("لا توجد فعاليات مضافة بعد.", "No events added yet.")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === "reviews" && (
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>{t("تقييمات الزبائن", "Customer Reviews")}</h2>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t("التقييم", "Rating")}</th>
                      <th>{t("العميل", "Customer")}</th>
                      <th>{t("التعليق", "Comment")}</th>
                      <th>{t("إجراء", "Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((r) => (
                      <tr key={r.id ?? `${r.createdAt}-${r.comment.slice(0, 8)}`}>
                        <td><strong>{r.rating} / 5 ★</strong></td>
                        <td>
                          {r.customerName || t("زائر", "Guest")}
                          {r.phone && <span className={styles.subText} dir="ltr">{r.phone}</span>}
                        </td>
                        <td>{r.comment}</td>
                        <td>
                          <button type="button" className={styles.dangerBtn} onClick={() => handleDeleteReview(r)}>
                            {t("حذف", "Delete")}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!reviews.length && (
                      <tr>
                        <td colSpan={4} className={styles.empty}>
                          {t("لا توجد تقييمات مسجلة بعد.", "No reviews yet.")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === "settings" && (
            <form className={styles.panel} onSubmit={handleSaveSettings}>
              <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>{t("إعدادات الهوية والتواصل", "Brand & Contact Settings")}</h2>
                <button type="submit" className={styles.primaryBtn} disabled={saving}>
                  {saving ? t("جاري الحفظ...", "Saving...") : t("حفظ التغييرات", "Save Changes")}
                </button>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>{t("اسم المقهى (عربي)", "Café Name (Arabic)")}</label>
                  <input
                    className={styles.input}
                    value={brand.name.ar}
                    onChange={(e) => setBrand({ ...brand, name: { ...brand.name, ar: e.target.value } })}
                  />
                </div>
                <div className={styles.field}>
                  <label>{t("اسم المقهى (إنجليزي)", "Café Name (English)")}</label>
                  <input
                    className={styles.input}
                    dir="ltr"
                    value={brand.name.en}
                    onChange={(e) => setBrand({ ...brand, name: { ...brand.name, en: e.target.value } })}
                  />
                </div>
                <div className={styles.field}>
                  <label>{t("الشعار اللفظي (عربي)", "Tagline (Arabic)")}</label>
                  <input
                    className={styles.input}
                    value={brand.tagline.ar}
                    onChange={(e) => setBrand({ ...brand, tagline: { ...brand.tagline, ar: e.target.value } })}
                  />
                </div>
                <div className={styles.field}>
                  <label>{t("الشعار اللفظي (إنجليزي)", "Tagline (English)")}</label>
                  <input
                    className={styles.input}
                    dir="ltr"
                    value={brand.tagline.en}
                    onChange={(e) => setBrand({ ...brand, tagline: { ...brand.tagline, en: e.target.value } })}
                  />
                </div>
                <div className={styles.field}>
                  <label>{t("رقم الهاتف", "Phone")}</label>
                  <input
                    className={styles.input}
                    dir="ltr"
                    value={brand.phone}
                    onChange={(e) => setBrand({ ...brand, phone: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>{t("واتساب (مع رمز الدولة)", "WhatsApp (international)")}</label>
                  <input
                    className={styles.input}
                    dir="ltr"
                    value={brand.whatsapp}
                    onChange={(e) => setBrand({ ...brand, whatsapp: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>{t("العنوان (عربي)", "Address (Arabic)")}</label>
                  <input
                    className={styles.input}
                    value={brand.address.ar}
                    onChange={(e) => setBrand({ ...brand, address: { ...brand.address, ar: e.target.value } })}
                  />
                </div>
                <div className={styles.field}>
                  <label>{t("العنوان (إنجليزي)", "Address (English)")}</label>
                  <input
                    className={styles.input}
                    dir="ltr"
                    value={brand.address.en}
                    onChange={(e) => setBrand({ ...brand, address: { ...brand.address, en: e.target.value } })}
                  />
                </div>
                <div className={styles.field}>
                  <label>{t("أوقات الدوام (عربي)", "Hours (Arabic)")}</label>
                  <input
                    className={styles.input}
                    value={brand.hours.ar}
                    onChange={(e) => setBrand({ ...brand, hours: { ...brand.hours, ar: e.target.value } })}
                  />
                </div>
                <div className={styles.field}>
                  <label>{t("أوقات الدوام (إنجليزي)", "Hours (English)")}</label>
                  <input
                    className={styles.input}
                    dir="ltr"
                    value={brand.hours.en}
                    onChange={(e) => setBrand({ ...brand, hours: { ...brand.hours, en: e.target.value } })}
                  />
                </div>
                <div className={styles.field}>
                  <label>{t("رابط إنستغرام", "Instagram URL")}</label>
                  <input
                    className={styles.input}
                    dir="ltr"
                    value={brand.instagram}
                    onChange={(e) => setBrand({ ...brand, instagram: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>{t("التقييم المعروض", "Displayed Rating")}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    className={styles.input}
                    dir="ltr"
                    value={brand.rating ?? 4.8}
                    onChange={(e) => setBrand({ ...brand, rating: Number(e.target.value) })}
                  />
                </div>
              </div>
            </form>
          )}
        </main>
      </div>

      {/* Product Editor Modal */}
      {productModalOpen && (
        <ProductEditorModal
          lang={lang}
          categories={categories}
          initial={editingProduct}
          nextOrder={products.length}
          saving={saving}
          onClose={() => {
            setProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* Category Editor Modal */}
      {categoryModalOpen && (
        <CategoryEditorModal
          lang={lang}
          initial={editingCategory}
          nextOrder={categories.length + 1}
          saving={saving}
          onClose={() => {
            setCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
        />
      )}

      {/* Event Editor Modal */}
      {eventModalOpen && (
        <EventEditorModal
          lang={lang}
          initial={editingEvent}
          nextOrder={events.length + 1}
          saving={saving}
          onClose={() => {
            setEventModalOpen(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
        />
      )}

      {/* Native <dialog> Confirmation */}
      <dialog ref={confirmRef} className={styles.confirmDialog} onCancel={closeConfirm}>
        <div className={styles.confirmBody}>
          <h3>{confirmState?.title}</h3>
          <p className={styles.subText} style={{ fontSize: "var(--text-sm)" }}>
            {confirmState?.message}
          </p>
          <div className={styles.confirmActions}>
            <button type="button" className={styles.smallBtn} onClick={closeConfirm}>
              {t("إلغاء", "Cancel")}
            </button>
            <button
              type="button"
              className={styles.dangerBtn}
              onClick={async () => {
                if (!confirmState) return;
                try {
                  await confirmState.onConfirm();
                } catch {
                  toast.show(t("تعذر تنفيذ الحذف", "Delete failed"), "error");
                } finally {
                  closeConfirm();
                }
              }}
            >
              {t("تأكيد الحذف", "Confirm Delete")}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

/* ---- Sub-modals ---- */

function ProductEditorModal({
  lang,
  categories,
  initial,
  nextOrder,
  saving,
  onClose,
  onSave,
}: {
  lang: Lang;
  categories: Category[];
  initial: Product | null;
  nextOrder: number;
  saving: boolean;
  onClose: () => void;
  onSave: (p: Product) => Promise<void>;
}) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [nameAr, setNameAr] = useState(initial?.name.ar ?? "");
  const [nameEn, setNameEn] = useState(initial?.name.en ?? "");
  const [descAr, setDescAr] = useState(initial?.description?.ar ?? "");
  const [descEn, setDescEn] = useState(initial?.description?.en ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "hot-drinks");
  const [price, setPrice] = useState(String(initial?.price ?? 5000));
  const [image, setImage] = useState(initial?.image ?? "/assets/products/classic-latte.png");
  const [tag, setTag] = useState<string>(initial?.tags?.[0] ?? "");
  const [available, setAvailable] = useState(initial?.available ?? true);
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? nextOrder));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nameAr.trim() || !nameEn.trim()) return;
    const product: Product = {
      id: initial?.id ?? slugify(nameEn),
      categoryId,
      name: { ar: nameAr.trim(), en: nameEn.trim() },
      description: descAr.trim() || descEn.trim() ? { ar: descAr.trim(), en: descEn.trim() } : undefined,
      price: Math.max(0, Number(price) || 0),
      image: image.trim() || undefined,
      tags: tag ? [tag as NonNullable<Product["tags"]>[number]] : undefined,
      available,
      sortOrder: Number(sortOrder) || 0,
    };
    void onSave(product);
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <form className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className={styles.modalHead}>
          <h3>{initial ? t("تعديل منتج", "Edit Product") : t("إضافة منتج جديد", "New Product")}</h3>
          <button type="button" className={styles.smallBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>{t("الاسم بالعربية *", "Arabic Name *")}</label>
            <input className={styles.input} value={nameAr} onChange={(e) => setNameAr(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>{t("الاسم بالإنجليزية *", "English Name *")}</label>
            <input className={styles.input} dir="ltr" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>{t("التصنيف", "Category")}</label>
            <select className={styles.select} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name[lang]}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>{t("السعر (دينار عراقي)", "Price (IQD)")}</label>
            <input type="number" step="250" className={styles.input} dir="ltr" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>{t("وسم المنتج", "Tag")}</label>
            <select className={styles.select} value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="">{t("بدون وسم", "None")}</option>
              <option value="signature">{t("توقيع بونساي", "Signature")}</option>
              <option value="healthy">{t("بدون سكر / صحي", "Sugar Free / Healthy")}</option>
              <option value="bestseller">{t("الأكثر طلباً", "Bestseller")}</option>
              <option value="new">{t("جديد", "New")}</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>{t("الترتيب", "Sort Order")}</label>
            <input type="number" className={styles.input} dir="ltr" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          </div>
          <div className={`${styles.field} ${styles.fullSpan}`}>
            <label>{t("الوصف (عربي)", "Description (Arabic)")}</label>
            <textarea className={styles.textarea} rows={2} value={descAr} onChange={(e) => setDescAr(e.target.value)} />
          </div>
          <div className={`${styles.field} ${styles.fullSpan}`}>
            <label>{t("الوصف (إنجليزي)", "Description (English)")}</label>
            <textarea className={styles.textarea} dir="ltr" rows={2} value={descEn} onChange={(e) => setDescEn(e.target.value)} />
          </div>
          <div className={`${styles.field} ${styles.fullSpan}`}>
            <label>{t("رابط الصورة أو اختر من صور منيو 101", "Image URL or pick from Menu 101 gallery")}</label>
            <input className={styles.input} dir="ltr" value={image} onChange={(e) => setImage(e.target.value)} />
            <div className={styles.imageGrid}>
              {productImageCatalog.map((opt) => (
                <button
                  key={opt.url}
                  type="button"
                  className={`${styles.imgPickBtn} ${image === opt.url ? styles.imgPickActive : ""}`}
                  onClick={() => setImage(opt.url)}
                >
                  <img src={opt.url} alt="" loading="lazy" />
                  <span>{opt.label[lang]}</span>
                </button>
              ))}
            </div>
          </div>
          <div className={styles.field}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
              <span>{t("المنتج متوفر للطلب", "Available for ordering")}</span>
            </label>
          </div>
        </div>

        <div className={styles.modalFoot}>
          <button type="button" className={styles.smallBtn} onClick={onClose}>{t("إلغاء", "Cancel")}</button>
          <button type="submit" className={styles.primaryBtn} disabled={saving}>
            {saving ? t("جاري الحفظ...", "Saving...") : t("حفظ المنتج", "Save Product")}
          </button>
        </div>
      </form>
    </div>
  );
}

function CategoryEditorModal({
  lang,
  initial,
  nextOrder,
  saving,
  onClose,
  onSave,
}: {
  lang: Lang;
  initial: Category | null;
  nextOrder: number;
  saving: boolean;
  onClose: () => void;
  onSave: (c: Category) => Promise<void>;
}) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [nameAr, setNameAr] = useState(initial?.name.ar ?? "");
  const [nameEn, setNameEn] = useState(initial?.name.en ?? "");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? nextOrder));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nameAr.trim() || !nameEn.trim()) return;
    void onSave({
      id: initial?.id ?? slugify(nameEn),
      name: { ar: nameAr.trim(), en: nameEn.trim() },
      sortOrder: Number(sortOrder) || 1,
    });
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <form className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className={styles.modalHead}>
          <h3>{initial ? t("تعديل تصنيف", "Edit Category") : t("إضافة تصنيف", "New Category")}</h3>
          <button type="button" className={styles.smallBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>{t("الاسم بالعربية *", "Arabic Name *")}</label>
            <input className={styles.input} value={nameAr} onChange={(e) => setNameAr(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>{t("الاسم بالإنجليزية *", "English Name *")}</label>
            <input className={styles.input} dir="ltr" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>{t("الترتيب", "Sort Order")}</label>
            <input type="number" className={styles.input} dir="ltr" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          </div>
        </div>
        <div className={styles.modalFoot}>
          <button type="button" className={styles.smallBtn} onClick={onClose}>{t("إلغاء", "Cancel")}</button>
          <button type="submit" className={styles.primaryBtn} disabled={saving}>
            {saving ? t("جاري الحفظ...", "Saving...") : t("حفظ", "Save")}
          </button>
        </div>
      </form>
    </div>
  );
}

function EventEditorModal({
  lang,
  initial,
  nextOrder,
  saving,
  onClose,
  onSave,
}: {
  lang: Lang;
  initial: CafeEvent | null;
  nextOrder: number;
  saving: boolean;
  onClose: () => void;
  onSave: (ev: CafeEvent, isNew: boolean) => Promise<void>;
}) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [titleAr, setTitleAr] = useState(initial?.title.ar ?? "");
  const [titleEn, setTitleEn] = useState(initial?.title.en ?? "");
  const [descAr, setDescAr] = useState(initial?.description.ar ?? "");
  const [descEn, setDescEn] = useState(initial?.description.en ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [time, setTime] = useState(initial?.time ?? "19:00 - 23:00");
  const [priceAr, setPriceAr] = useState(initial?.price.ar ?? "مجاني");
  const [priceEn, setPriceEn] = useState(initial?.price.en ?? "Free");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!titleAr.trim() || !date) return;
    void onSave(
      {
        id: initial?.id ?? "",
        title: { ar: titleAr.trim(), en: titleEn.trim() || titleAr.trim() },
        description: { ar: descAr.trim(), en: descEn.trim() },
        date,
        time: time.trim(),
        price: { ar: priceAr.trim(), en: priceEn.trim() },
        sortOrder: initial?.sortOrder ?? nextOrder,
      },
      !initial
    );
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <form className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className={styles.modalHead}>
          <h3>{initial ? t("تعديل فعالية", "Edit Event") : t("إضافة فعالية", "New Event")}</h3>
          <button type="button" className={styles.smallBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>{t("العنوان (عربي) *", "Title (Arabic) *")}</label>
            <input className={styles.input} value={titleAr} onChange={(e) => setTitleAr(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>{t("العنوان (إنجليزي)", "Title (English)")}</label>
            <input className={styles.input} dir="ltr" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>{t("التاريخ (YYYY-MM-DD) *", "Date *")}</label>
            <input type="date" className={styles.input} dir="ltr" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label>{t("الوقت", "Time")}</label>
            <input className={styles.input} dir="ltr" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>{t("الدخول / السعر (عربي)", "Entry / Price (Arabic)")}</label>
            <input className={styles.input} value={priceAr} onChange={(e) => setPriceAr(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>{t("الدخول / السعر (إنجليزي)", "Entry / Price (English)")}</label>
            <input className={styles.input} dir="ltr" value={priceEn} onChange={(e) => setPriceEn(e.target.value)} />
          </div>
          <div className={`${styles.field} ${styles.fullSpan}`}>
            <label>{t("الوصف (عربي)", "Description (Arabic)")}</label>
            <textarea className={styles.textarea} rows={2} value={descAr} onChange={(e) => setDescAr(e.target.value)} />
          </div>
          <div className={`${styles.field} ${styles.fullSpan}`}>
            <label>{t("الوصف (إنجليزي)", "Description (English)")}</label>
            <textarea className={styles.textarea} dir="ltr" rows={2} value={descEn} onChange={(e) => setDescEn(e.target.value)} />
          </div>
        </div>
        <div className={styles.modalFoot}>
          <button type="button" className={styles.smallBtn} onClick={onClose}>{t("إلغاء", "Cancel")}</button>
          <button type="submit" className={styles.primaryBtn} disabled={saving}>
            {saving ? t("جاري الحفظ...", "Saving...") : t("حفظ الفعالية", "Save Event")}
          </button>
        </div>
      </form>
    </div>
  );
}
