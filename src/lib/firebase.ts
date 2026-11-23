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

/** Lazily loads and initializes the Firebase SDK only when it's actually
 *  needed, and only once. Keeps the firebase package out of the main
 *  bundle entirely when a project isn't configured (QR-first = fast first
 *  paint matters more than an SDK most visits will never touch). */
let dbPromise: Promise<import("firebase/firestore").Firestore> | null = null;

function getDb() {
  if (!isFirebaseConfigured) return Promise.resolve(null);
  if (!dbPromise) {
    dbPromise = Promise.all([
      import("firebase/app"),
      import("firebase/firestore"),
    ]).then(([{ initializeApp }, { getFirestore }]) => {
      const app = initializeApp(firebaseConfig);
      return getFirestore(app);
    });
  }
  return dbPromise;
}

export async function fetchCollectionSafe<T>(name: string): Promise<T[] | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const { collection, getDocs } = await import("firebase/firestore");
    const snap = await getDocs(collection(db, name));
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
  const db = await getDb();
  if (!db) return { ok: false, reason: "offline" };
  try {
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
    await addDoc(collection(db, "reviews"), {
      ...review,
      createdAt: serverTimestamp(),
    });
    return { ok: true };
  } catch (err) {
    console.error("[firebase] failed to submit review", err);
    return { ok: false, reason: "error" };
  }
}
