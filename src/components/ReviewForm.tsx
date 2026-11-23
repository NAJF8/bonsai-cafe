import { useState } from "react";
import type { Lang } from "../types";
import { submitReviewSafe } from "../lib/firebase";
import { useToast } from "../context/ToastContext";
import styles from "./ReviewForm.module.css";

interface Props {
  lang: Lang;
}

export function ReviewForm({ lang }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.show(t("الرجاء اختيار تقييم بالنجوم", "Please select a star rating"), "error");
      return;
    }
    setSubmitting(true);
    const result = await submitReviewSafe({ rating, comment: comment.trim(), customerName: name.trim() || undefined });
    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
      setRating(0);
      setComment("");
      setName("");
      toast.show(t("شكرًا لك على تقييمك!", "Thank you for your review!"), "success");
    } else {
      toast.show(
        t("هذه الخدمة غير متاحة حاليًا، حاول لاحقًا", "This feature isn't available yet, please try later"),
        "error"
      );
    }
  }

  if (submitted) {
    return (
      <div className={styles.thanks}>
        <p>{t("تم استلام تقييمك، شكرًا لمشاركتنا تجربتك!", "Your review was received — thank you for sharing your experience!")}</p>
        <button type="button" onClick={() => setSubmitted(false)}>
          {t("إضافة تقييم آخر", "Add another review")}
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <fieldset className={styles.stars} aria-label={t("التقييم من 5 نجوم", "Rating out of 5 stars")}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={n <= rating ? styles.starActive : styles.star}
            onClick={() => setRating(n)}
            aria-label={t(`${n} نجوم`, `${n} stars`)}
            aria-pressed={n <= rating}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="m12 3 2.8 5.8 6.2.9-4.5 4.5 1.1 6.3L12 17.6 6.4 20.5l1.1-6.3L3 9.7l6.2-.9Z" />
            </svg>
          </button>
        ))}
      </fieldset>

      <label>
        {t("اسمك (اختياري)", "Your name (optional)")}
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label>
        {t("تجربتك معنا", "Your experience")}
        <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t("شاركنا رأيك...", "Share your feedback...")} />
      </label>

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? t("جارِ الإرسال...", "Sending...") : t("إرسال التقييم", "Submit review")}
      </button>
    </form>
  );
}
