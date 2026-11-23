import { useState } from "react";
import type { BrandSettings, CartLine, Lang } from "../types";
import { formatIQD } from "../utils/currency";
import { buildWhatsAppLink, buildWhatsAppMessage } from "../utils/whatsapp";
import { EmptyState } from "./EmptyState";
import styles from "./CartDrawer.module.css";

interface Props {
  lang: Lang;
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  total: number;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  onOrderSent: () => void;
  brand: BrandSettings;
}

type OrderType = "dine-in" | "pickup" | "delivery";

export function CartDrawer({ lang, open, onClose, lines, total, onUpdateQuantity, onRemove, onOrderSent, brand }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [tableOrAddress, setTableOrAddress] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"cart" | "details">("cart");
  const [error, setError] = useState("");

  if (!open) return null;

  function handleSend() {
    if (!name.trim()) {
      setError(t("الرجاء إدخال اسمك", "Please enter your name"));
      return;
    }
    if (orderType !== "dine-in" && !tableOrAddress.trim()) {
      setError(
        orderType === "pickup"
          ? t("يرجى تحديد وقت الاستلام", "Please specify a pickup time")
          : t("يرجى إدخال عنوان التوصيل", "Please enter the delivery address")
      );
      return;
    }
    const message = buildWhatsAppMessage(
      lines,
      total,
      { customerName: name.trim(), customerPhone: phone.trim() || undefined, orderType, tableOrAddress: tableOrAddress.trim() || undefined, note: note.trim() || undefined },
      lang
    );
    const link = buildWhatsAppLink(brand.whatsapp, message);
    window.open(link, "_blank", "noopener,noreferrer");
    onOrderSent();
    setStep("cart");
    setName("");
    setPhone("");
    setTableOrAddress("");
    setNote("");
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={t("السلة", "Cart")} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{step === "cart" ? t("السلة", "Your Cart") : t("تفاصيل الطلب", "Order Details")}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label={t("إغلاق", "Close")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <EmptyState
            title={t("سلتك فارغة", "Your cart is empty")}
            description={t("أضف بعض المشروبات أو الحلويات اللذيذة", "Add some delicious drinks or desserts")}
          />
        ) : step === "cart" ? (
          <>
            <ul className={styles.list}>
              {lines.map((line) => (
                <li key={line.lineId} className={styles.line}>
                  <div className={styles.lineInfo}>
                    <span className={styles.lineName}>{line.name[lang]}</span>
                    {line.note && <span className={styles.lineNote}>{line.note}</span>}
                    <span className="price">{formatIQD(line.unitPrice * line.quantity, lang)}</span>
                  </div>
                  <div className={styles.lineActions}>
                    <div className={styles.qty}>
                      <button type="button" onClick={() => onUpdateQuantity(line.lineId, line.quantity - 1)} aria-label={t("إنقاص", "Decrease")}>&minus;</button>
                      <span>{line.quantity}</span>
                      <button type="button" onClick={() => onUpdateQuantity(line.lineId, line.quantity + 1)} aria-label={t("زيادة", "Increase")}>+</button>
                    </div>
                    <button type="button" className={styles.remove} onClick={() => onRemove(line.lineId)}>
                      {t("إزالة", "Remove")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span>{t("المجموع", "Total")}</span>
                <span className="price">{formatIQD(total, lang)}</span>
              </div>
              <button type="button" className={styles.primaryBtn} onClick={() => setStep("details")}>
                {t("متابعة الطلب عبر واتساب", "Continue via WhatsApp")}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.form}>
            <label>
              {t("الاسم", "Name")} *
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("اسمك", "Your name")} />
            </label>
            <label>
              {t("رقم الهاتف (اختياري)", "Phone (optional)")}
              <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="07xx xxx xxxx" />
            </label>
            <div className={styles.segmented}>
              {(["dine-in", "pickup", "delivery"] as OrderType[]).map((ot) => (
                <button
                  key={ot}
                  type="button"
                  className={orderType === ot ? styles.segActive : undefined}
                  onClick={() => setOrderType(ot)}
                >
                  {{ "dine-in": t("تناول في الكافيه", "Dine-in"), pickup: t("استلام", "Pickup"), delivery: t("توصيل", "Delivery") }[ot]}
                </button>
              ))}
            </div>
            {orderType !== "dine-in" && (
              <label>
                {orderType === "pickup" ? t("وقت الاستلام", "Pickup time") : t("عنوان التوصيل", "Delivery address")}
                <input value={tableOrAddress} onChange={(e) => setTableOrAddress(e.target.value)} />
              </label>
            )}
            {orderType === "dine-in" && (
              <label>
                {t("رقم الطاولة (اختياري)", "Table number (optional)")}
                <input value={tableOrAddress} onChange={(e) => setTableOrAddress(e.target.value)} />
              </label>
            )}
            <label>
              {t("ملاحظات عامة (اختياري)", "General note (optional)")}
              <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
            </label>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formActions}>
              <button type="button" className={styles.secondaryBtn} onClick={() => setStep("cart")}>
                {t("رجوع", "Back")}
              </button>
              <button type="button" className={styles.primaryBtn} onClick={handleSend}>
                {t("إرسال الطلب عبر واتساب", "Send order on WhatsApp")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
