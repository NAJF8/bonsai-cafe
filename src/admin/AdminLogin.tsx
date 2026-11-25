import { useState, type FormEvent } from "react";
import type { Lang } from "../types";
import type { ThemePreference } from "../hooks/useLang";
import {
  DESIGNATED_SUPER_ADMIN_EMAIL,
  sendResetEmail,
  signInWithEmail,
  signInWithGoogle,
} from "../lib/firebaseAdmin";
import { isFirebaseConfigured } from "../lib/firebase";
import { ThemeSwitch } from "../components/ThemeSwitch";
import { LanguageSwitch } from "../components/LanguageSwitch";
import styles from "./AdminLogin.module.css";

interface Props {
  lang: Lang;
  onToggleLang: () => void;
  themePreference: ThemePreference;
  onChangeTheme: (v: ThemePreference) => void;
  onEnterPreview: () => void;
  onBackToMenu: () => void;
}

export function AdminLogin({
  lang,
  onToggleLang,
  themePreference,
  onChangeTheme,
  onEnterPreview,
  onBackToMenu,
}: Props) {
  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState<"google" | "email" | "reset" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleGoogle() {
    setError(null);
    setNotice(null);
    setBusy("google");
    const res = await signInWithGoogle();
    setBusy(null);
    if (!res.ok) setError(res.message);
  }

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!email.trim() || !password) {
      setError(t("يرجى إدخال البريد الإلكتروني وكلمة المرور.", "Please enter your email and password."));
      return;
    }
    setBusy("email");
    const res = await signInWithEmail(email, password);
    setBusy(null);
    if (!res.ok) setError(res.message);
  }

  async function handleForgotPassword() {
    setError(null);
    setNotice(null);
    if (!email.trim()) {
      setError(t("أدخل بريدك الإلكتروني أولاً لإرسال رابط الاستعادة.", "Enter your email first to receive a reset link."));
      return;
    }
    setBusy("reset");
    const res = await sendResetEmail(email);
    setBusy(null);
    if (res.ok) {
      setNotice(
        t(
          "تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.",
          "A password reset link has been sent to your email."
        )
      );
    } else {
      setError(res.message);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button type="button" className={styles.backBtn} onClick={onBackToMenu}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            style={{ transform: lang === "ar" ? "scaleX(-1)" : undefined }}
          >
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{t("العودة للمنيو", "Back to Menu")}</span>
        </button>

        <div className={styles.controls}>
          <ThemeSwitch lang={lang} value={themePreference} onChange={onChangeTheme} />
          <LanguageSwitch lang={lang} onToggle={onToggleLang} />
        </div>
      </div>

      <main className={styles.center}>
        <section className={styles.card} aria-labelledby="admin-login-title">
          <div className={styles.brandHead}>
            <img className={styles.logo} src="/assets/brand/logo.jpg" alt="Bonsai Café" width={64} height={64} />
            <span className={styles.wordmark}>BONSAI</span>
            <h1 id="admin-login-title" className={styles.title}>
              {t("لوحة إدارة بونساي كافيه", "Bonsai Café Admin")}
            </h1>
            <p className={styles.subtitle}>
              {t(
                "سجّل الدخول لإدارة المنيو، الحجوزات، الهدايا، والأعضاء",
                "Sign in to manage menu items, bookings, gifts, and members"
              )}
            </p>
          </div>

          {!isFirebaseConfigured && (
            <div className={styles.alertInfo} role="status">
              {t(
                "إعدادات Firebase غير مكتملة حالياً في ملف البيئة (.env). يمكنك معاينة لوحة الإدارة بوضع القراءة فقط.",
                "Firebase config is not set in .env yet. You can inspect the dashboard in read-only preview mode."
              )}
            </div>
          )}

          {error && (
            <div className={styles.alertError} role="alert">
              {error}
            </div>
          )}

          {notice && (
            <div className={styles.alertSuccess} role="status">
              {notice}
            </div>
          )}

          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogle}
            disabled={!isFirebaseConfigured || busy !== null}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 6-1.1 8-3l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.2 0-5.9-2.1-6.8-5H1.2v3.1A12 12 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.2 14.2a7.2 7.2 0 0 1 0-4.4V6.7H1.2a12 12 0 0 0 0 10.6l4-3.1Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A11.9 11.9 0 0 0 12 0 12 12 0 0 0 1.2 6.7l4 3.1c.9-2.9 3.6-5 6.8-5Z"
              />
            </svg>
            <span>
              {busy === "google"
                ? t("جاري التحقق...", "Signing in...")
                : t("المتابعة باستخدام Google", "Continue with Google")}
            </span>
          </button>

          <div className={styles.divider}>
            <span>{t("أو عبر البريد الإلكتروني", "or with email")}</span>
          </div>

          <form className={styles.form} onSubmit={handleEmailSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="admin-email">{t("البريد الإلكتروني", "Email address")}</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={DESIGNATED_SUPER_ADMIN_EMAIL}
                disabled={!isFirebaseConfigured || busy !== null}
                required
              />
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label htmlFor="admin-password">{t("كلمة المرور", "Password")}</label>
                <button
                  type="button"
                  className={styles.forgotBtn}
                  onClick={handleForgotPassword}
                  disabled={!isFirebaseConfigured || busy !== null}
                >
                  {busy === "reset" ? t("جاري الإرسال...", "Sending...") : t("نسيت كلمة المرور؟", "Forgot password?")}
                </button>
              </div>
              <div className={styles.passwordWrap}>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={!isFirebaseConfigured || busy !== null}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? t("إخفاء كلمة المرور", "Hide password") : t("إظهار كلمة المرور", "Show password")}
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10.9 10.9 0 0 1 12 5c5 0 9.3 3.1 11 7-0.7 1.6-1.8 3.1-3.2 4.2M6.5 6.5C4.5 7.8 2.9 9.7 2 12c1.7 3.9 6 7 10 7 1.6 0 3.1-.4 4.5-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.6" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!isFirebaseConfigured || busy !== null}
            >
              {busy === "email" ? t("جاري تسجيل الدخول...", "Signing in...") : t("تسجيل الدخول", "Sign In")}
            </button>
          </form>

          <div className={styles.previewBox}>
            <button type="button" className={styles.previewBtn} onClick={onEnterPreview}>
              {t("معاينة لوحة التحكم (وضع القراءة فقط)", "Preview Dashboard (Read-only)")}
            </button>
            <p className={styles.ownerNote}>
              {t(
                `حساب المالك المعتمد: ${DESIGNATED_SUPER_ADMIN_EMAIL} (يتطلب تفعيل المصادقة في Firebase)`,
                `Designated owner: ${DESIGNATED_SUPER_ADMIN_EMAIL} (requires verified Firebase Auth)`
              )}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
