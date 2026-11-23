import { useState } from "react";
import type { Lang } from "../types";
import { createMemberSafe, getMemberByPhone, isFirebaseConfigured } from "../lib/firebase";
import styles from "./MembershipModal.module.css";

interface Props {
  lang: Lang;
  open: boolean;
  onClose: () => void;
}

export function MembershipModal({ lang, open, onClose }: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "not-found" | "joined" | "error">("idle");
  const [member, setMember] = useState<{ name: string; points: number } | null>(null);

  if (!open) return null;

  async function handleLookup() {
    if (!phone.trim()) return;
    setStatus("loading");
    const result = await getMemberByPhone(phone.trim());
    if (result) {
      setMember(result);
      setStatus("found");
    } else {
      setStatus("not-found");
    }
  }

  async function handleJoin() {
    if (!phone.trim() || !name.trim()) return;
    setStatus("loading");
    const result = await createMemberSafe(phone.trim(), name.trim());
    setStatus(result.ok ? "joined" : "error");
    if (result.ok) setMember({ name: name.trim(), points: 0 });
  }

  function reset() {
    setStatus("idle");
    setMember(null);
    setPhone("");
    setName("");
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={t("مكافآت ونادي بونساي", "Bonsai rewards & club")} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{t("مكافآت ونادي بونساي", "Bonsai Rewards & Club")}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label={t("إغلاق", "Close")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {!isFirebaseConfigured ? (
            <p className={styles.notice}>{t("هذه الخدمة غير متاحة حاليًا، حاول لاحقًا", "This feature isn't available yet, please try later")}</p>
          ) : status === "found" && member ? (
            <div className={styles.card}>
              <p className={styles.cardLabel}>{t("رصيد المكافآت", "Rewards balance")}</p>
              <p className={styles.points}>{member.points}</p>
              <p className={styles.cardName}>{member.name}</p>
              <button type="button" className={styles.secondary} onClick={reset}>{t("تسجيل الخروج", "Log out")}</button>
            </div>
          ) : status === "joined" && member ? (
            <div className={styles.card}>
              <p className={styles.cardLabel}>{t("مرحبًا بك في نادي بونساي", "Welcome to Bonsai Club")}</p>
              <p className={styles.points}>0</p>
              <p className={styles.cardName}>{member.name}</p>
              <p className={styles.hint}>
                {t("تُضاف النقاط من فريقنا بعد كل طلب مؤكد.", "Points are added by our team after each confirmed order.")}
              </p>
            </div>
          ) : (
            <>
              <p className={styles.lead}>
                {t("كل زيارة تقرّبك أكثر من مفاجأتك — انضم أو سجّل دخولك برقم هاتفك.", "Every visit brings you closer to a surprise — join or look up your account by phone.")}
              </p>
              <label className={styles.field}>
                {t("رقم الهاتف", "Phone number")}
                <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="07xx xxx xxxx" />
              </label>

              {status === "not-found" && (
                <>
                  <p className={styles.notice}>{t("لم نجد حسابًا بهذا الرقم. سجّل اسمك للانضمام.", "No account with this number yet. Add your name to join.")}</p>
                  <label className={styles.field}>
                    {t("الاسم", "Name")}
                    <input value={name} onChange={(e) => setName(e.target.value)} />
                  </label>
                  <button type="button" className={styles.primary} onClick={handleJoin}>
                    {t("انضم الآن", "Join now")}
                  </button>
                </>
              )}

              {status === "error" && <p className={styles.error}>{t("حدث خطأ، حاول مرة أخرى.", "Something went wrong, please try again.")}</p>}

              {status !== "not-found" && (
                <button type="button" className={styles.primary} onClick={handleLookup} disabled={status === "loading"}>
                  {status === "loading" ? t("جارِ البحث...", "Looking up...") : t("تسجيل الدخول", "Log in")}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
