import type { FirebaseApp } from "firebase/app";
import type { Auth, User } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { isFirebaseConfigured } from "./firebase";

const FIREBASE_SDK_VERSION = "13.4.0";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const DESIGNATED_SUPER_ADMIN_EMAIL = "mohameadalhaear100@gmail.com";

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

type AdminFirebaseBundle = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  authMod: typeof import("firebase/auth");
  firestoreMod: typeof import("firebase/firestore");
};

let adminBundlePromise: Promise<AdminFirebaseBundle | null> | null = null;

function loadAdminFirebase(): Promise<AdminFirebaseBundle | null> {
  if (!isFirebaseConfigured) return Promise.resolve(null);
  if (!adminBundlePromise) {
    const base = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;
    adminBundlePromise = Promise.all([
      import(/* @vite-ignore */ `${base}/firebase-app.js`),
      import(/* @vite-ignore */ `${base}/firebase-auth.js`),
      import(/* @vite-ignore */ `${base}/firebase-firestore.js`),
    ]).then(([appMod, authMod, firestoreMod]) => {
      const existing = appMod.getApps().find((a: FirebaseApp) => a.name === "bonsai-admin");
      const app: FirebaseApp = existing ?? appMod.initializeApp(firebaseConfig, "bonsai-admin");
      const auth = authMod.getAuth(app) as Auth;
      const db = firestoreMod.getFirestore(app) as Firestore;
      return { app, auth, db, authMod, firestoreMod };
    });
  }
  return adminBundlePromise;
}

function mapUser(u: User | null): AdminUser | null {
  if (!u) return null;
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
    emailVerified: u.emailVerified,
  };
}

export function subscribeAdminAuth(onChange: (user: AdminUser | null, ready: boolean) => void): () => void {
  let unsub: (() => void) | null = null;
  let cancelled = false;

  loadAdminFirebase()
    .then((bundle) => {
      if (cancelled) return;
      if (!bundle) {
        onChange(null, true);
        return;
      }
      unsub = bundle.authMod.onAuthStateChanged(bundle.auth, (u) => {
        if (!cancelled) onChange(mapUser(u), true);
      });
    })
    .catch((err) => {
      console.error("[firebaseAdmin] auth init failed", err);
      if (!cancelled) onChange(null, true);
    });

  return () => {
    cancelled = true;
    unsub?.();
  };
}

export async function signInWithGoogle(): Promise<{ ok: true; user: AdminUser } | { ok: false; message: string }> {
  const bundle = await loadAdminFirebase();
  if (!bundle) return { ok: false, message: "Firebase غير مُعد في البيئة الحالية." };
  try {
    const provider = new bundle.authMod.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const res = await bundle.authMod.signInWithPopup(bundle.auth, provider);
    const mapped = mapUser(res.user);
    if (!mapped) return { ok: false, message: "تعذر إكمال تسجيل الدخول." };
    return { ok: true, user: mapped };
  } catch (err) {
    const code = (err as { code?: string })?.code ?? "";
    if (code === "auth/popup-closed-by-user") {
      return { ok: false, message: "تم إغلاق نافذة تسجيل الدخول قبل الإكمال." };
    }
    return { ok: false, message: (err as Error)?.message || "فشل تسجيل الدخول عبر Google." };
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ ok: true; user: AdminUser } | { ok: false; message: string }> {
  const bundle = await loadAdminFirebase();
  if (!bundle) return { ok: false, message: "Firebase غير مُعد في البيئة الحالية." };
  try {
    const res = await bundle.authMod.signInWithEmailAndPassword(bundle.auth, email.trim(), password);
    const mapped = mapUser(res.user);
    if (!mapped) return { ok: false, message: "تعذر إكمال تسجيل الدخول." };
    return { ok: true, user: mapped };
  } catch (err) {
    const code = (err as { code?: string })?.code ?? "";
    if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
      return { ok: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
    }
    if (code === "auth/too-many-requests") {
      return { ok: false, message: "محاولات كثيرة جداً، يرجى الانتظار قليلاً ثم المحاولة." };
    }
    return { ok: false, message: (err as Error)?.message || "فشل تسجيل الدخول." };
  }
}

export async function sendResetEmail(email: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const bundle = await loadAdminFirebase();
  if (!bundle) return { ok: false, message: "Firebase غير مُعد في البيئة الحالية." };
  try {
    await bundle.authMod.sendPasswordResetEmail(bundle.auth, email.trim());
    return { ok: true };
  } catch (err) {
    return { ok: false, message: (err as Error)?.message || "تعذر إرسال رابط استعادة كلمة المرور." };
  }
}

export async function signOutAdmin(): Promise<void> {
  const bundle = await loadAdminFirebase();
  if (!bundle) return;
  await bundle.authMod.signOut(bundle.auth);
}

function stripUndefined(data: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) clean[k] = v;
  }
  return clean;
}

export async function fetchAdminCollection<T>(collectionName: string): Promise<T[]> {
  const bundle = await loadAdminFirebase();
  if (!bundle) return [];
  const snap = await bundle.firestoreMod.getDocs(bundle.firestoreMod.collection(bundle.db, collectionName));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function saveAdminDoc(
  collectionName: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  const bundle = await loadAdminFirebase();
  if (!bundle) throw new Error("Firebase is not configured");
  const clean = stripUndefined(data);
  await bundle.firestoreMod.setDoc(bundle.firestoreMod.doc(bundle.db, collectionName, id), clean, {
    merge: true,
  });
}

export async function createAdminDoc(
  collectionName: string,
  data: Record<string, unknown>
): Promise<string> {
  const bundle = await loadAdminFirebase();
  if (!bundle) throw new Error("Firebase is not configured");
  const clean = stripUndefined({ ...data, createdAt: bundle.firestoreMod.serverTimestamp() });
  const ref = await bundle.firestoreMod.addDoc(bundle.firestoreMod.collection(bundle.db, collectionName), clean);
  return ref.id;
}

export async function deleteAdminDoc(collectionName: string, id: string): Promise<void> {
  const bundle = await loadAdminFirebase();
  if (!bundle) throw new Error("Firebase is not configured");
  await bundle.firestoreMod.deleteDoc(bundle.firestoreMod.doc(bundle.db, collectionName, id));
}
