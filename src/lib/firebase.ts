import type { Firestore } from "firebase/firestore";

const FIREBASE_SDK_VERSION = "13.4.0";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

/** Lazily loads the Firebase SDK straight from Google's own CDN, only when
 *  actually needed (QR-first = most visits never touch it, so it must stay
 *  out of the main bundle). This is deliberate, not a missed optimization:
 *  bundling `firebase/app` + `firebase/firestore` through Vite/Rollup's
 *  production build corrupted the SDK's internal component registration
 *  (requests silently came back "Missing or insufficient permissions" for
 *  every read, even with fully public rules — verified the same config
 *  works from the official CDN build in the same browser). Loading the
 *  identical version from the CDN sidesteps that bundler-specific bug. */
let firestorePromise: Promise<{
  db: Firestore;
  firestore: typeof import("firebase/firestore");
} | null> | null = null;

function loadFirestore() {
  if (!isFirebaseConfigured) return Promise.resolve(null);
  if (!firestorePromise) {
    const base = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;
    firestorePromise = Promise.all([
      import(/* @vite-ignore */ `${base}/firebase-app.js`),
      import(/* @vite-ignore */ `${base}/firebase-firestore.js`),
    ]).then(([{ initializeApp }, firestore]) => {
      const app = initializeApp(firebaseConfig);
      const db = firestore.getFirestore(app) as Firestore;
      return { db, firestore };
    });
  }
  return firestorePromise;
}

export async function fetchCollectionSafe<T>(name: string): Promise<T[] | null> {
  const loaded = await loadFirestore();
  if (!loaded) return null;
  const { db, firestore } = loaded;
  try {
    const snap = await firestore.getDocs(firestore.collection(db, name));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  } catch (err) {
    console.error(`[firebase] failed to read "${name}"`, err);
    return null;
  }
}

export async function submitReviewSafe(review: {
  rating: number;
  comment: string;
  customerName?: string;
  phone?: string;
  productId?: string;
}): Promise<{ ok: true } | { ok: false; reason: "offline" | "error" }> {
  const loaded = await loadFirestore();
  if (!loaded) return { ok: false, reason: "offline" };
  const { db, firestore } = loaded;
  try {
    // Firestore rejects a field whose value is `undefined` outright, so
    // optional fields the caller left unset must be omitted, not nulled.
    const data: Record<string, unknown> = { createdAt: firestore.serverTimestamp() };
    for (const [key, value] of Object.entries(review)) {
      if (value !== undefined) data[key] = value;
    }
    await firestore.addDoc(firestore.collection(db, "reviews"), data);
    return { ok: true };
  } catch (err) {
    console.error("[firebase] failed to submit review", err);
    return { ok: false, reason: "error" };
  }
}
