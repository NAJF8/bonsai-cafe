import { useState } from "react";
import type { BrandSettings, Lang, Product } from "../types";
import { addDocSafe, isFirebaseConfigured } from "../lib/firebase";
import { formatIQD } from "../utils/currency";
import { buildWhatsAppLink } from "../utils/whatsapp";
import styles from "./GiftModal.module.css";

interface Props {
  lang: Lang;
  open: boolean;
  onClose: () => void;
  products: Product[];
  brand: BrandSettings;
}

function randomCode(): string {
  return "BONSAI-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

export function GiftModal({ lang, open, onClose, products, brand }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [kind, setKind] = useState<"product" | "amount">("product");
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [amount, setAmount] = useState(10000);
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [code, setCode] = useState("");

  if (!open) return null;

  const selectedProduct = products.find((p) => p.id === productId);

  async function handleSend() {
    if (!senderName.trim() || !senderPhone.trim() || !recipientName.trim()) return;
    setStatus("sending");
    const giftCode = randomCode();
    const result = await addDocSafe("gifts", {
      code: giftCode,
      kind,
      productId: kind === "product" ? productId : undefined,
      productName: kind === "product" ? selectedProduct?.name[lang] : undefined,
      amount: kind === "amount" ? amount : undefined,
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim(),
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim() || undefined,
      message: message.trim() || undefined,
      status: "pending",
    });

    if (!result.ok) {
      setStatus("error");
      return;
    }

    const lines = [
      `*${t("هدية جديدة — بونساي كافيه", "New Gift — Bonsai Café")}*`,
      "",
      `${t("الكود", "Code")}: ${giftCode}`,
      `${t("من", "From")}: ${senderName} (${senderPhone})`,
      `${t("إلى", "To")}: ${recipientName}${recipientPhone ? ` (${recipientPhone})` : ""}`,
      kind === "product"
        ? `${t("الهدية", "Gift")}: ${selectedProduct?.name[lang] ?? ""}`
        : `${t("مبلغ هدية", "Gift amount")}: ${formatIQD(amount, lang)}`,
    ];
    if (message.trim()) lines.push(`${t("رسالة", "Message")}: ${message.trim()}`);

    window.open(buildWhatsAppLink(brand.whatsapp, lines.join("\n")), "_blank", "noopener,noreferrer");
    setCode(giftCode);
    setStatus("done");
  }

  function reset() {
    setStatus("idle");
    setSenderName("");
    setSenderPhone("");
    setRecipientName("");
    setRecipientPhone("");
    setMessage("");
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={t("إهداء هدية", "Send a gift")} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>🎁 {t("أهدِ شخصًا تحبه", "Gift someone you love")}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label={t("إغلاق", "Close")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {!isFirebaseConfigured ? (
            <p className={styles.notice}>{t("هذه الخدمة غير متاحة حاليًا، حاول لاحقًا", "This feature isn't available yet, please try later")}</p>
          ) : status === "done" ? (
            <div className={styles.done}>
              <p>{t("تم إرسال طلب الهدية! سنؤكد التفاصيل معك عبر واتساب.", "Your gift request was sent! We'll confirm the details with you on WhatsApp.")}</p>
              <p className={styles.code}>{code}</p>
              <button type="button" className={styles.secondary} onClick={reset}>{t("إرسال هدية أخرى", "Send another gift")}</button>
            </div>
          ) : (
            <>
              <p className={styles.lead}>
                {t("اختر مشروبًا أو حلى أو مبلغًا مفتوحًا، وخلّي لحظتك الحلوة توصل بطريقتنا.", "Choose a drink, a dessert, or an open amount — let your sweet moment arrive our way.")}
              </p>

              <div className={styles.segmented}>
                <button type="button" className={kind === "product" ? styles.segActive : undefined} onClick={() => setKind("product")}>
                  {t("منتج", "A product")}
                </button>
                <button type="button" className={kind === "amount" ? styles.segActive : undefined} onClick={() => setKind("amount")}>
                  {t("مبلغ مفتوح", "Open amount")}
                </button>
              </div>

              {kind === "product" ? (
                <label className={styles.field}>
                  {t("اختر منتجًا", "Choose a product")}
                  <select value={productId} onChange={(e) => setProductId(e.target.value)}>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name[lang]} — {formatIQD(p.price, lang)}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <label className={styles.field}>
                  {t("المبلغ (د.ع)", "Amount (IQD)")}
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </label>
              )}

              <label className={styles.field}>
                {t("اسمك", "Your name")}
                <input value={senderName} onChange={(e) => setSenderName(e.target.value)} />
              </label>
              <label className={styles.field}>
                {t("رقم هاتفك", "Your phone")}
                <input value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} inputMode="tel" />
              </label>
              <label className={styles.field}>
                {t("اسم المُهدى إليه", "Recipient's name")}
                <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
              </label>
              <label className={styles.field}>
                {t("هاتف المُهدى إليه (اختياري)", "Recipient's phone (optional)")}
                <input value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} inputMode="tel" />
              </label>
              <label className={styles.field}>
                {t("رسالة (اختياري)", "Message (optional)")}
                <textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} />
              </label>

              {status === "error" && <p className={styles.error}>{t("حدث خطأ، حاول مرة أخرى.", "Something went wrong, please try again.")}</p>}

              <button type="button" className={styles.primary} onClick={handleSend} disabled={status === "sending"}>
                {status === "sending" ? t("جارِ الإرسال...", "Sending...") : t("إرسال الهدية عبر واتساب", "Send gift via WhatsApp")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
