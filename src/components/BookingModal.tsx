import { useState } from "react";
import type { BrandSettings, Lang } from "../types";
import { addDocSafe, isFirebaseConfigured } from "../lib/firebase";
import { buildWhatsAppLink } from "../utils/whatsapp";
import styles from "./GiftModal.module.css";

interface Props {
  lang: Lang;
  open: boolean;
  onClose: () => void;
  brand: BrandSettings;
}

export function BookingModal({ lang, open, onClose, brand }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  if (!open) return null;

  async function handleSend() {
    if (!date || !time || !name.trim() || !phone.trim()) return;
    setStatus("sending");
    const purpose = { ar: "حجز طاولة / مساحة", en: "Table / space reservation" };
    const result = await addDocSafe("bookings", {
      purpose,
      date,
      time,
      partySize,
      name: name.trim(),
      phone: phone.trim(),
      note: note.trim() || undefined,
      status: "pending",
    });

    if (!result.ok) {
      setStatus("error");
      return;
    }

    const lines = [
      `*${t("طلب حجز — بونساي كافيه", "Reservation Request — Bonsai Café")}*`,
      "",
      `${t("الاسم", "Name")}: ${name.trim()}`,
      `${t("الهاتف", "Phone")}: ${phone.trim()}`,
      `${t("التاريخ", "Date")}: ${date}`,
      `${t("الوقت", "Time")}: ${time}`,
      `${t("عدد الأشخاص", "Party size")}: ${partySize}`,
    ];
    if (note.trim()) lines.push(`${t("ملاحظة", "Note")}: ${note.trim()}`);

    window.open(buildWhatsAppLink(brand.whatsapp, lines.join("\n")), "_blank", "noopener,noreferrer");
    setStatus("done");
  }

  function reset() {
    setStatus("idle");
    setDate("");
    setTime("");
    setPartySize(2);
    setName("");
    setPhone("");
    setNote("");
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={t("حجز طاولة", "Table reservation")} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{t("احجز طاولتك", "Reserve your table")}</h2>
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
              <p>{t("تم إرسال طلب الحجز! سنؤكد معك عبر واتساب.", "Your reservation request was sent! We'll confirm with you on WhatsApp.")}</p>
              <button type="button" className={styles.secondary} onClick={reset}>{t("حجز آخر", "Another reservation")}</button>
            </div>
          ) : (
            <>
              <p className={styles.lead}>
                {t("مساحتك الهادئة للجلسات والاجتماعات في بونساي.", "Your quiet space for sessions and meetings at Bonsai.")}
              </p>
              <label className={styles.field}>
                {t("التاريخ", "Date")}
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label className={styles.field}>
                {t("الوقت", "Time")}
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </label>
              <label className={styles.field}>
                {t("عدد الأشخاص", "Party size")}
                <input type="number" min={1} max={20} value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} />
              </label>
              <label className={styles.field}>
                {t("الاسم", "Name")}
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className={styles.field}>
                {t("رقم الهاتف", "Phone")}
                <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
              </label>
              <label className={styles.field}>
                {t("ملاحظة (اختياري)", "Note (optional)")}
                <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
              </label>

              {status === "error" && <p className={styles.error}>{t("حدث خطأ، حاول مرة أخرى.", "Something went wrong, please try again.")}</p>}

              <button type="button" className={styles.primary} onClick={handleSend} disabled={status === "sending"}>
                {status === "sending" ? t("جارِ الإرسال...", "Sending...") : t("إرسال طلب الحجز", "Send reservation request")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
