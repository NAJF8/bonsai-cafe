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

type SafeResult = { ok: true; id?: string } | { ok: false; reason: "offline" | "error" };

/** Adds a document to `collectionName`, stamping `createdAt` and stripping
 *  any `undefined` field — Firestore rejects those outright, and callers
 *  routinely leave optional inputs (name, phone, note) unset. */
export async function addDocSafe(
  collectionName: string,
  data: Record<string, unknown>
): Promise<SafeResult> {
  const loaded = await loadFirestore();
  if (!loaded) return { ok: false, reason: "offline" };
  const { db, firestore } = loaded;
  try {
    const clean: Record<string, unknown> = { createdAt: firestore.serverTimestamp() };
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) clean[key] = value;
    }
    const ref = await firestore.addDoc(firestore.collection(db, collectionName), clean);
    return { ok: true, id: ref.id };
  } catch (err) {
    console.error(`[firebase] failed to write to "${collectionName}"`, err);
    return { ok: false, reason: "error" };
  }
}

export async function submitReviewSafe(review: {
  rating: number;
  comment: string;
  customerName?: string;
  phone?: string;
  productId?: string;
}): Promise<SafeResult> {
  return addDocSafe("reviews", review);
}

/** Looks up a member's rewards profile by phone number (the document id).
 *  Returns `null` both when Firebase isn't configured and when no such
 *  member exists yet — callers treat both the same way (show "not found"
 *  / offer to join). */
export async function getMemberByPhone(phone: string): Promise<{ name: string; points: number } | null> {
  const loaded = await loadFirestore();
  if (!loaded) return null;
  const { db, firestore } = loaded;
  try {
    const snap = await firestore.getDoc(firestore.doc(db, "members", phone));
    if (!snap.exists()) return null;
    const data = snap.data() as { name?: string; points?: number };
    return { name: data.name ?? "", points: data.points ?? 0 };
  } catch (err) {
    console.error("[firebase] failed to read member", err);
    return null;
  }
}

/** Creates a new member profile starting at 0 points. Points are credited
 *  manually by staff after a confirmed order — see MembershipPanel for why
 *  this isn't automatic (client-side point writes can't be trusted without
 *  a backend function, which this project deliberately doesn't add). */
export async function createMemberSafe(phone: string, name: string): Promise<SafeResult> {
  const loaded = await loadFirestore();
  if (!loaded) return { ok: false, reason: "offline" };
  const { db, firestore } = loaded;
  try {
    await firestore.setDoc(firestore.doc(db, "members", phone), {
      name,
      phone,
      points: 0,
      createdAt: firestore.serverTimestamp(),
    });
    return { ok: true };
  } catch (err) {
    console.error("[firebase] failed to create member", err);
    return { ok: false, reason: "error" };
  }
}
